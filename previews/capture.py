from playwright.sync_api import sync_playwright
import time

PAGES = [
    {
        "url": "http://localhost:3001",
        "output": "/Users/ahmednurabdi/Documents/umatul-islam/previews/final-home.png",
        "width": 1280,
        "height": 900,
    },
    {
        "url": "http://localhost:3001/events",
        "output": "/Users/ahmednurabdi/Documents/umatul-islam/previews/final-events.png",
        "width": 1280,
        "height": 900,
    },
    {
        "url": "http://localhost:3001/azkars",
        "output": "/Users/ahmednurabdi/Documents/umatul-islam/previews/final-azkars.png",
        "width": 1280,
        "height": 900,
    },
    {
        "url": "http://localhost:3001",
        "output": "/Users/ahmednurabdi/Documents/umatul-islam/previews/final-mobile.png",
        "width": 390,
        "height": 844,
    },
]

with sync_playwright() as p:
    browser = p.chromium.launch()
    for page_info in PAGES:
        print(f"Capturing {page_info['url']} at {page_info['width']}x{page_info['height']} -> {page_info['output']}")
        page = browser.new_page(viewport={"width": page_info["width"], "height": page_info["height"]})
        page.goto(page_info["url"], wait_until="networkidle")
        time.sleep(3)
        page.screenshot(path=page_info["output"], full_page=True)
        page.close()
        print(f"  Saved: {page_info['output']}")
    browser.close()
    print("All screenshots captured.")
