#!/usr/bin/env python3
"""
scrape_leads.py - Scrape publicly available business directory listings for
administradores de fincas (community administrators) in Spain.

Sources:
  - Paginas Amarillas (paginasamarillas.es)

Only publicly listed business information is collected.
Rate-limiting and proper identification headers are used throughout.
"""

import csv
import logging
import os
import random
import re
import sys
import time
from typing import Optional
from urllib.parse import quote_plus, urljoin

import requests
from bs4 import BeautifulSoup

# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
OUTPUT_CSV = os.path.join(SCRIPT_DIR, "leads.csv")

TARGET_CITIES = [
    "Madrid",
    "Barcelona",
    "Valencia",
    "Sevilla",
    "Zaragoza",
    "Malaga",
    "Murcia",
    "Palma de Mallorca",
    "Las Palmas de Gran Canaria",
    "Bilbao",
]

SEARCH_TERM = "administradores de fincas"

# Respectful delay range (seconds) between HTTP requests
DELAY_MIN = 1.0
DELAY_MAX = 2.0

# Maximum pages to fetch per city (to keep the run bounded)
MAX_PAGES_PER_CITY = 3

HEADERS = {
    "User-Agent": (
        "FincaHubLeadBot/1.0 "
        "(+https://fincahub.com/bot; contact@fincahub.com) "
        "python-requests"
    ),
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "es-ES,es;q=0.9,en;q=0.5",
}

# ---------------------------------------------------------------------------
# Logging
# ---------------------------------------------------------------------------

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)
log = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------


def respectful_delay() -> None:
    """Sleep for a random interval to avoid overwhelming servers."""
    delay = random.uniform(DELAY_MIN, DELAY_MAX)
    time.sleep(delay)


def fetch(session: requests.Session, url: str) -> Optional[BeautifulSoup]:
    """Fetch a URL and return a BeautifulSoup object, or None on failure."""
    try:
        log.info("GET %s", url)
        resp = session.get(url, timeout=15)
        resp.raise_for_status()
        return BeautifulSoup(resp.text, "lxml")
    except requests.RequestException as exc:
        log.warning("Request failed for %s: %s", url, exc)
        return None


def clean(text: Optional[str]) -> str:
    """Strip and normalise whitespace."""
    if not text:
        return ""
    return re.sub(r"\s+", " ", text).strip()


def extract_email(text: str) -> str:
    """Try to pull an email address out of arbitrary text."""
    match = re.search(r"[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}", text)
    return match.group(0) if match else ""


# ---------------------------------------------------------------------------
# Paginas Amarillas scraper
# ---------------------------------------------------------------------------


def scrape_paginas_amarillas(session: requests.Session) -> list[dict]:
    """
    Scrape paginasamarillas.es for 'administradores de fincas' in each
    target city. Returns a list of lead dicts.
    """
    leads: list[dict] = []

    for city in TARGET_CITIES:
        log.info("=== Paginas Amarillas - %s ===", city)

        for page_num in range(1, MAX_PAGES_PER_CITY + 1):
            # Build URL: paginasamarillas.es uses path-based search
            slug = quote_plus(SEARCH_TERM.replace(" ", "-"))
            city_slug = quote_plus(city.lower().replace(" ", "-"))

            if page_num == 1:
                url = (
                    f"https://www.paginasamarillas.es/search/"
                    f"{slug}/{city_slug}/all-702?what={quote_plus(SEARCH_TERM)}"
                    f"&where={quote_plus(city)}"
                )
            else:
                url = (
                    f"https://www.paginasamarillas.es/search/"
                    f"{slug}/{city_slug}/all-702/{page_num}"
                    f"?what={quote_plus(SEARCH_TERM)}&where={quote_plus(city)}"
                )

            respectful_delay()
            soup = fetch(session, url)
            if soup is None:
                break

            # Each listing is inside a container with class 'listado-item'
            # or similar (the site evolves, so we try several selectors).
            items = (
                soup.select("div.listado-item")
                or soup.select("div.search-result-item")
                or soup.select("div[class*='listing']")
                or soup.select("article")
            )

            if not items:
                log.info("No results found on page %d for %s, moving on.", page_num, city)
                break

            for item in items:
                lead = _parse_pa_item(item, city)
                if lead and lead["business_name"]:
                    leads.append(lead)

            log.info(
                "Page %d/%d for %s: found %d items",
                page_num,
                MAX_PAGES_PER_CITY,
                city,
                len(items),
            )

    return leads


def _parse_pa_item(item: BeautifulSoup, city: str) -> Optional[dict]:
    """Parse a single Paginas Amarillas listing card."""
    try:
        # Business name - try several selectors
        name_tag = (
            item.select_one("a.business-name")
            or item.select_one("h2 a")
            or item.select_one("h2 span")
            or item.select_one("a[class*='name']")
            or item.select_one("span[class*='name']")
            or item.select_one("h2")
            or item.select_one("h3")
        )
        name = clean(name_tag.get_text()) if name_tag else ""

        # Phone
        phone_tag = (
            item.select_one("a[href^='tel:']")
            or item.select_one("span.phone")
            or item.select_one("span[class*='phone']")
            or item.select_one("a[class*='phone']")
        )
        phone = ""
        if phone_tag:
            href = phone_tag.get("href", "")
            if href.startswith("tel:"):
                phone = href.replace("tel:", "").strip()
            else:
                phone = clean(phone_tag.get_text())
        # Normalise phone (digits, spaces, + only)
        phone = re.sub(r"[^\d\s+]", "", phone).strip()

        # Website
        web_tag = item.select_one("a[class*='web']") or item.select_one(
            "a[data-event-action='website']"
        )
        website = ""
        if web_tag:
            website = web_tag.get("href", "").strip()

        # Email - sometimes embedded in the page text or a mailto link
        email = ""
        mailto_tag = item.select_one("a[href^='mailto:']")
        if mailto_tag:
            email = mailto_tag["href"].replace("mailto:", "").strip()
        else:
            email = extract_email(item.get_text())

        # Address / city
        addr_tag = item.select_one("span[class*='address']") or item.select_one(
            "p[class*='address']"
        )
        address = clean(addr_tag.get_text()) if addr_tag else ""

        return {
            "source": "PaginasAmarillas",
            "business_name": name,
            "city": city,
            "address": address,
            "phone": phone,
            "email": email,
            "website": website,
        }
    except Exception as exc:
        log.debug("Error parsing PA item: %s", exc)
        return None


# ---------------------------------------------------------------------------
# Fallback / secondary source: direct web search via DuckDuckGo HTML
# ---------------------------------------------------------------------------


def scrape_duckduckgo_listings(session: requests.Session) -> list[dict]:
    """
    Use DuckDuckGo HTML search to find additional administrador de fincas
    listings. This is a best-effort supplement; DuckDuckGo may block or
    limit automated queries.
    """
    leads: list[dict] = []

    for city in TARGET_CITIES:
        log.info("=== DuckDuckGo fallback - %s ===", city)
        query = f"{SEARCH_TERM} {city} telefono email"
        url = f"https://html.duckduckgo.com/html/?q={quote_plus(query)}"

        respectful_delay()
        soup = fetch(session, url)
        if soup is None:
            continue

        results = soup.select("div.result") or soup.select("div.results_links")
        for res in results[:10]:
            title_tag = res.select_one("a.result__a") or res.select_one("a")
            snippet_tag = res.select_one("a.result__snippet") or res.select_one(
                "td.result__snippet"
            )
            title = clean(title_tag.get_text()) if title_tag else ""
            snippet = clean(snippet_tag.get_text()) if snippet_tag else ""
            link = title_tag.get("href", "") if title_tag else ""

            # Try to extract phone / email from snippet
            phone_match = re.search(r"(\+?34[\s.\-]?\d[\d\s.\-]{6,})", snippet)
            phone = re.sub(r"[^\d\s+]", "", phone_match.group(1)).strip() if phone_match else ""
            email = extract_email(snippet)

            if title:
                leads.append(
                    {
                        "source": "DuckDuckGo",
                        "business_name": title,
                        "city": city,
                        "address": "",
                        "phone": phone,
                        "email": email,
                        "website": link,
                    }
                )

    return leads


# ---------------------------------------------------------------------------
# CSV output
# ---------------------------------------------------------------------------

CSV_FIELDS = [
    "source",
    "business_name",
    "city",
    "address",
    "phone",
    "email",
    "website",
]


def deduplicate(leads: list[dict]) -> list[dict]:
    """Remove exact duplicate rows (by name + city + phone)."""
    seen: set[tuple] = set()
    unique: list[dict] = []
    for lead in leads:
        key = (
            lead["business_name"].lower(),
            lead["city"].lower(),
            lead["phone"],
        )
        if key not in seen:
            seen.add(key)
            unique.append(lead)
    return unique


def write_csv(leads: list[dict], path: str) -> None:
    with open(path, "w", newline="", encoding="utf-8") as fh:
        writer = csv.DictWriter(fh, fieldnames=CSV_FIELDS)
        writer.writeheader()
        writer.writerows(leads)
    log.info("Wrote %d leads to %s", len(leads), path)


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------


def main() -> None:
    log.info("Starting lead scraper for administradores de fincas in Spain")
    log.info("Target cities: %s", ", ".join(TARGET_CITIES))
    log.info("Output file: %s", OUTPUT_CSV)

    session = requests.Session()
    session.headers.update(HEADERS)

    all_leads: list[dict] = []

    # Primary source: Paginas Amarillas
    try:
        pa_leads = scrape_paginas_amarillas(session)
        log.info("Paginas Amarillas yielded %d raw leads", len(pa_leads))
        all_leads.extend(pa_leads)
    except Exception as exc:
        log.error("Paginas Amarillas scraper failed: %s", exc)

    # Secondary source: DuckDuckGo HTML search
    try:
        ddg_leads = scrape_duckduckgo_listings(session)
        log.info("DuckDuckGo yielded %d raw leads", len(ddg_leads))
        all_leads.extend(ddg_leads)
    except Exception as exc:
        log.error("DuckDuckGo scraper failed: %s", exc)

    # Deduplicate and write
    all_leads = deduplicate(all_leads)
    log.info("Total unique leads: %d", len(all_leads))

    write_csv(all_leads, OUTPUT_CSV)

    # Summary
    print(f"\n{'='*60}")
    print(f"Scraping complete.")
    print(f"  Total unique leads: {len(all_leads)}")
    print(f"  Output file:        {OUTPUT_CSV}")
    if all_leads:
        sources = {}
        for l in all_leads:
            sources[l["source"]] = sources.get(l["source"], 0) + 1
        for src, cnt in sorted(sources.items()):
            print(f"    - {src}: {cnt}")
    print(f"{'='*60}\n")


if __name__ == "__main__":
    main()
