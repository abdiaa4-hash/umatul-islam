from playwright.sync_api import sync_playwright
import os

output_dir = "/Users/ahmednurabdi/Documents/umatul-islam/previews"
os.makedirs(output_dir, exist_ok=True)

pages = [
    ("http://localhost:3001",           "home2.png",        1280, 900),
    ("http://localhost:3001/events",    "events2.png",      1280, 900),
    ("http://localhost:3001/azkars",    "azkars2.png",      1280, 900),
    ("http://localhost:3001/donations", "donations2.png",   1280, 900),
    ("http://localhost:3001/ask",       "ask2.png",         1280, 900),
    ("http://localhost:3001",           "home2-mobile.png", 390,  844),
]

with sync_playwright() as p:
    browser = p.chromium.launch()

    for url, filename, width, height in pages:
        print(f"Capturing {url} -> {filename} ({width}x{height})")
        page = browser.new_page(viewport={"width": width, "height": height})
        page.goto(url, wait_until="networkidle", timeout=30000)
        page.wait_for_timeout(2000)  # extra 2s for Unsplash images
        out = os.path.join(output_dir, filename)
        page.screenshot(path=out, full_page=True)
        page.close()
        print(f"  Saved: {out}")

    browser.close()
    print("All screenshots captured successfully.")
