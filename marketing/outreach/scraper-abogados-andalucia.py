"""
Scraper de despachos de abogados — Andalucía (excepto Granada)
Exporta CSV listo para importar en HubSpot.

Dependencias:
    pip install playwright pandas
    playwright install chromium

Uso:
    python scraper-abogados-andalucia.py
    python scraper-abogados-andalucia.py --provincias sevilla malaga
    python scraper-abogados-andalucia.py --max 50
"""

import asyncio
import csv
import argparse
import re
import time
from datetime import datetime
from pathlib import Path
from playwright.async_api import async_playwright

PROVINCIAS = [
    "Sevilla",
    "Málaga",
    "Córdoba",
    "Jaén",
    "Almería",
    "Cádiz",
    "Huelva",
]

CAMPOS_CSV = [
    "Nombre despacho",
    "Provincia",
    "Dirección",
    "Teléfono",
    "Web",
    "Valoración Google",
    "Nº reseñas",
    "Horario",
    "Notas",
    # Campos para rellenar manualmente / enriquecer después
    "Nombre abogado principal",
    "Email",
    "LinkedIn",
    "Área práctica",
    "Tamaño despacho",
    "Tiene chatbot",
    "Tiene secretaria visible",
    "Estado outreach",
]


async def scrape_provincia(page, provincia: str, max_resultados: int) -> list[dict]:
    print(f"\n{'='*50}")
    print(f"  Buscando en: {provincia}")
    print(f"{'='*50}")

    query = f"despacho de abogados {provincia}"
    url = f"https://www.google.com/maps/search/{query.replace(' ', '+')}"

    await page.goto(url, wait_until="networkidle", timeout=30000)
    await page.wait_for_timeout(2000)

    resultados = []
    intentos_sin_nuevos = 0

    while len(resultados) < max_resultados:
        # Recoger tarjetas visibles
        tarjetas = await page.query_selector_all('a[href*="/maps/place/"]')
        hrefs_vistos = {r.get("_href", "") for r in resultados}

        nuevos = 0
        for tarjeta in tarjetas:
            if len(resultados) >= max_resultados:
                break

            href = await tarjeta.get_attribute("href")
            if not href or href in hrefs_vistos:
                continue

            # Clic para abrir el panel de detalles
            try:
                await tarjeta.click()
                await page.wait_for_timeout(1800)
            except Exception:
                continue

            datos = await extraer_datos_panel(page, provincia)
            if datos:
                datos["_href"] = href
                resultados.append(datos)
                hrefs_vistos.add(href)
                nuevos += 1
                print(f"  [{len(resultados):>3}] {datos['Nombre despacho'][:55]}")

        # Scroll en la lista lateral para cargar más
        lista = await page.query_selector('div[role="feed"]')
        if lista:
            await lista.evaluate("el => el.scrollBy(0, 800)")
            await page.wait_for_timeout(1500)

        if nuevos == 0:
            intentos_sin_nuevos += 1
            if intentos_sin_nuevos >= 3:
                print(f"  No hay más resultados para {provincia}.")
                break
        else:
            intentos_sin_nuevos = 0

    return resultados


async def extraer_datos_panel(page, provincia: str) -> dict | None:
    try:
        # Nombre
        nombre_el = await page.query_selector('h1[class*="fontHeadlineLarge"]')
        if not nombre_el:
            nombre_el = await page.query_selector("h1")
        nombre = (await nombre_el.inner_text()).strip() if nombre_el else ""
        if not nombre:
            return None

        # Dirección
        direccion = await _texto_boton(page, 'button[data-item-id="address"]')

        # Teléfono
        telefono = await _texto_boton(page, 'button[data-item-id*="phone"]')
        if not telefono:
            # Fallback: buscar por aria-label que contenga teléfono
            tel_el = await page.query_selector('button[aria-label*="Teléfono"]')
            if tel_el:
                telefono = (await tel_el.get_attribute("aria-label") or "").replace("Teléfono: ", "").strip()

        # Web
        web = ""
        web_el = await page.query_selector('a[data-item-id="authority"]')
        if web_el:
            web = await web_el.get_attribute("href") or ""

        # Valoración y reseñas
        valoracion = ""
        n_resenas = ""
        rating_el = await page.query_selector('span[aria-hidden="true"][role="img"]')
        if rating_el:
            aria = await rating_el.get_attribute("aria-label") or ""
            m = re.search(r"([\d,\.]+)\s+estrellas.*?(\d[\d\.]*)\s+rese", aria)
            if m:
                valoracion = m.group(1).replace(",", ".")
                n_resenas = m.group(2)

        # Horario (abierto/cerrado y horario)
        horario = ""
        horario_el = await page.query_selector('div[aria-label*="Horario"]')
        if horario_el:
            horario = (await horario_el.inner_text()).strip().replace("\n", " | ")

        return {
            "Nombre despacho": nombre,
            "Provincia": provincia,
            "Dirección": direccion,
            "Teléfono": telefono,
            "Web": web,
            "Valoración Google": valoracion,
            "Nº reseñas": n_resenas,
            "Horario": horario,
            "Notas": "",
            "Nombre abogado principal": "",
            "Email": "",
            "LinkedIn": "",
            "Área práctica": "",
            "Tamaño despacho": "",
            "Tiene chatbot": "",
            "Tiene secretaria visible": "",
            "Estado outreach": "Pendiente",
        }
    except Exception as e:
        return None


async def _texto_boton(page, selector: str) -> str:
    el = await page.query_selector(selector)
    if not el:
        return ""
    texto = await el.inner_text()
    return texto.strip() if texto else ""


async def main(provincias: list[str], max_por_provincia: int, fichero_salida: str):
    todos = []

    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context(
            locale="es-ES",
            user_agent="Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 "
                       "(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        )
        page = await context.new_page()

        for provincia in provincias:
            resultados = await scrape_provincia(page, provincia, max_por_provincia)
            todos.extend(resultados)
            # Pausa entre provincias para no levantar sospechas
            await asyncio.sleep(3)

        await browser.close()

    # Limpiar columna interna
    for r in todos:
        r.pop("_href", None)

    # Exportar CSV
    salida = Path(fichero_salida)
    salida.parent.mkdir(parents=True, exist_ok=True)
    with open(salida, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=CAMPOS_CSV)
        writer.writeheader()
        writer.writerows(todos)

    print(f"\n{'='*50}")
    print(f"  TOTAL: {len(todos)} despachos exportados")
    print(f"  Archivo: {salida.resolve()}")
    print(f"{'='*50}\n")
    print("Próximos pasos:")
    print("  1. Abre el CSV y revisa / enriquece emails y LinkedIn manualmente")
    print("  2. Importa en HubSpot: Contactos → Importar → Subir archivo")
    print("  3. Crea una lista por provincia para controlar el outreach")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Scraper abogados Andalucía → HubSpot CSV")
    parser.add_argument(
        "--provincias",
        nargs="+",
        default=PROVINCIAS,
        metavar="PROVINCIA",
        help=f"Provincias a scrapear (defecto: todas). Opciones: {', '.join(PROVINCIAS)}",
    )
    parser.add_argument(
        "--max",
        type=int,
        default=80,
        metavar="N",
        help="Máximo de resultados por provincia (defecto: 80)",
    )
    parser.add_argument(
        "--salida",
        default=f"output/abogados-andalucia-{datetime.today().strftime('%Y%m%d')}.csv",
        metavar="FICHERO",
        help="Ruta del CSV de salida",
    )
    args = parser.parse_args()

    asyncio.run(main(args.provincias, args.max, args.salida))
