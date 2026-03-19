"""
Scraper Google Maps → Google Sheets
Despachos de abogados por provincia andaluza

SETUP (una sola vez):
─────────────────────
1. Ve a https://console.cloud.google.com
2. Crea un proyecto nuevo (o usa uno existente)
3. Activa: "Google Sheets API" y "Google Drive API"
4. Crea una Cuenta de Servicio:
   IAM y administración → Cuentas de servicio → Crear cuenta de servicio
5. Descarga el JSON de credenciales y guárdalo como:
   credentials.json  (en la misma carpeta que este script)
6. Copia el email de la cuenta de servicio (acaba en @...iam.gserviceaccount.com)
7. Crea un Google Sheet vacío y compártelo con ese email (editor)
8. Copia el ID del Sheet (la parte larga de la URL) y ponlo en SHEET_ID abajo

DEPENDENCIAS:
─────────────
pip install playwright gspread google-auth
playwright install chromium

USO:
────
python scraper-gmaps-to-sheets.py                          # Sevilla, 80 resultados
python scraper-gmaps-to-sheets.py --provincias malaga      # solo Málaga
python scraper-gmaps-to-sheets.py --provincias sevilla malaga --max 50
"""

import asyncio
import argparse
import re
from datetime import datetime
from playwright.async_api import async_playwright
import gspread
from google.oauth2.service_account import Credentials

# ─── CONFIGURACIÓN ────────────────────────────────────────────────────────────
SHEET_ID = "PEGA_AQUI_EL_ID_DE_TU_GOOGLE_SHEET"
CREDENTIALS_FILE = "credentials.json"
# ──────────────────────────────────────────────────────────────────────────────

PROVINCIAS = ["Sevilla", "Málaga", "Córdoba", "Jaén", "Almería", "Cádiz", "Huelva"]

CABECERAS = [
    "Nombre despacho",
    "Provincia",
    "Dirección",
    "Teléfono",
    "Web",
    "Valoración",
    "Nº reseñas",
    "Horario",
    # Rellenar manualmente / enriquecer
    "Nombre abogado principal",
    "Email",
    "Área práctica",
    "Tamaño despacho",
    "Tiene chatbot",
    "Estado outreach",
    "Notas",
]


def conectar_sheets():
    scopes = [
        "https://spreadsheets.google.com/feeds",
        "https://www.googleapis.com/auth/drive",
    ]
    creds = Credentials.from_service_account_file(CREDENTIALS_FILE, scopes=scopes)
    client = gspread.authorize(creds)
    return client.open_by_key(SHEET_ID)


def preparar_hoja(spreadsheet, nombre_hoja: str):
    """Crea la hoja si no existe, o la limpia si ya existe."""
    try:
        hoja = spreadsheet.worksheet(nombre_hoja)
        hoja.clear()
    except gspread.exceptions.WorksheetNotFound:
        hoja = spreadsheet.add_worksheet(title=nombre_hoja, rows=500, cols=len(CABECERAS))

    # Cabeceras con formato
    hoja.append_row(CABECERAS)
    hoja.format("A1:O1", {
        "textFormat": {"bold": True},
        "backgroundColor": {"red": 0.15, "green": 0.5, "blue": 0.85},
    })
    hoja.freeze(rows=1)
    return hoja


async def scrape_provincia(page, provincia: str, max_resultados: int) -> list[list]:
    print(f"\n{'='*50}\n  {provincia}\n{'='*50}")

    query = f"despacho de abogados {provincia}"
    url = f"https://www.google.com/maps/search/{query.replace(' ', '+')}"
    await page.goto(url, wait_until="networkidle", timeout=30000)
    await page.wait_for_timeout(2000)

    resultados = []
    hrefs_vistos = set()
    sin_nuevos = 0

    while len(resultados) < max_resultados:
        tarjetas = await page.query_selector_all('a[href*="/maps/place/"]')
        nuevos = 0

        for tarjeta in tarjetas:
            if len(resultados) >= max_resultados:
                break
            href = await tarjeta.get_attribute("href")
            if not href or href in hrefs_vistos:
                continue
            try:
                await tarjeta.click()
                await page.wait_for_timeout(1800)
            except Exception:
                continue

            fila = await extraer_fila(page, provincia)
            if fila:
                resultados.append(fila)
                hrefs_vistos.add(href)
                nuevos += 1
                print(f"  [{len(resultados):>3}] {fila[0][:55]}")

        lista = await page.query_selector('div[role="feed"]')
        if lista:
            await lista.evaluate("el => el.scrollBy(0, 800)")
            await page.wait_for_timeout(1500)

        sin_nuevos = 0 if nuevos else sin_nuevos + 1
        if sin_nuevos >= 3:
            break

    return resultados


async def extraer_fila(page, provincia: str) -> list | None:
    try:
        nombre_el = await page.query_selector('h1[class*="fontHeadlineLarge"], h1')
        nombre = (await nombre_el.inner_text()).strip() if nombre_el else ""
        if not nombre:
            return None

        direccion = await _boton_texto(page, 'button[data-item-id="address"]')
        telefono = await _boton_texto(page, 'button[data-item-id*="phone"]')
        if not telefono:
            el = await page.query_selector('button[aria-label*="Teléfono"]')
            if el:
                telefono = (await el.get_attribute("aria-label") or "").replace("Teléfono: ", "").strip()

        web = ""
        web_el = await page.query_selector('a[data-item-id="authority"]')
        if web_el:
            web = await web_el.get_attribute("href") or ""

        valoracion, n_resenas = "", ""
        rating_el = await page.query_selector('span[role="img"]')
        if rating_el:
            aria = await rating_el.get_attribute("aria-label") or ""
            m = re.search(r"([\d,\.]+)\s+estrellas.*?(\d[\d\.]*)\s+rese", aria)
            if m:
                valoracion = m.group(1).replace(",", ".")
                n_resenas = m.group(2)

        horario = ""
        h_el = await page.query_selector('div[aria-label*="Horario"]')
        if h_el:
            horario = (await h_el.inner_text()).strip().replace("\n", " | ")

        return [nombre, provincia, direccion, telefono, web, valoracion, n_resenas,
                horario, "", "", "", "", "", "Pendiente", ""]
    except Exception:
        return None


async def _boton_texto(page, selector: str) -> str:
    el = await page.query_selector(selector)
    if not el:
        return ""
    return ((await el.inner_text()) or "").strip()


async def main(provincias: list[str], max_resultados: int):
    print("Conectando con Google Sheets...")
    spreadsheet = conectar_sheets()
    nombre_hoja = f"Abogados {' + '.join(provincias)} {datetime.today().strftime('%d/%m/%Y')}"
    hoja = preparar_hoja(spreadsheet, nombre_hoja)
    print(f"Hoja lista: {nombre_hoja}")

    todas_filas = []

    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        ctx = await browser.new_context(
            locale="es-ES",
            user_agent="Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 "
                       "(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        )
        page = await ctx.new_page()

        for provincia in provincias:
            filas = await scrape_provincia(page, provincia, max_resultados)
            todas_filas.extend(filas)
            # Subir por lotes según avanza para no perder datos
            if filas:
                hoja.append_rows(filas, value_input_option="RAW")
                print(f"  → {len(filas)} filas subidas a Sheets ({provincia})")
            await asyncio.sleep(3)

        await browser.close()

    print(f"\n{'='*50}")
    print(f"  TOTAL: {len(todas_filas)} despachos")
    print(f"  Hoja: {nombre_hoja}")
    print(f"  URL: https://docs.google.com/spreadsheets/d/{SHEET_ID}")
    print(f"{'='*50}")


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--provincias", nargs="+", default=["Sevilla"], metavar="P")
    parser.add_argument("--max", type=int, default=80)
    args = parser.parse_args()

    asyncio.run(main(args.provincias, args.max))
