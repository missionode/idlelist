# IdleList — A lightweight Craigslist-style declutter app (HTML + Tailwind + Vanilla JS)

IdleList helps you track personal items, detect what’s been idle for too long, and list those items for **sale** or **rent**—all in your browser with local storage and optional file-based autosave.

---

## ✨ Features

- **Idle detection:** Items become **Idle** when `lastUsedAt` exceeds your threshold (default 30 days).
- **One-click listing:** Convert Idle items to **For Sale** or **For Rent** from the Dashboard.
- **My Items:** Add/edit items with photos, condition, price or rent rates, and location.
- **Marketplace:** Local listings grid with search and filters (mode/type); copy-share text for quick posting.
- **Preferences:** Set idle threshold, map item types → allowed modes, Export/Import JSON, and **Auto-save to file** (via File System Access API).
- **Help page:** How-tos, FAQs, privacy notes.
- **Fully offline:** No backend, no sign-in, data stays on your device.

---

## 🧱 Tech Stack

- **HTML + CSS + Vanilla JS**
- **Tailwind (CDN)**:  
  `<script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>`
- **Typography:** Tailwind prose on Help page.
- **Storage:** `localStorage` + optional file autosave (if supported by your browser).

---

## 📂 Project Structure

```

idlelist/
assets/
css/
styles.css
js/
core.js
store.js
dashboard.js
items.js
market.js
prefs.js
index.html
items.html
market.html
prefs.html
help.html
README.md

```

- **index.html** — Dashboard (stats + “Needs Action”).
- **items.html** — Add/edit items, upload photos, check-in, list for sale/rent.
- **market.html** — Searchable listings grid.
- **prefs.html** — Idle threshold, allowed modes, backup/import, autosave.
- **help.html** — Guidance and FAQs.
- **js/** — Core boot, store, and page controllers.
- **css/styles.css** — Minimal utilities for cards, inputs, and buttons.

---

## 🚀 Quick Start

1) Serve the folder (recommended; avoids CORS issues and enables some APIs).

- Python:
```

cd idlelist
python3 -m http.server 5173

```
Visit: http://localhost:5173

- Node (http-server):
```

npx http-server -p 5173 idlelist

````
Visit: http://localhost:5173

2) Open **index.html** to see the Dashboard, then head to **My Items** to add your first item.

> Tip: Opening files with `file://` may block some features (like autosave or image previews in certain browsers). Prefer a local server.

---

## 🧠 Core Concepts

### Idle logic
- Each item has `lastUsedAt` (ISO).
- Idle if `today - lastUsedAt ≥ idleThresholdDays`.
- Idle items surface on the Dashboard under **Needs Action** for quick listing.

### Listing modes
- `status` can be: `in-use | idle | planned | listed-sale | listed-rent`.
- Transaction modes allowed per type come from **Preferences** (e.g., clothing → sale only).

---

## 🗃️ Data Model

```json
Item {
"id": "uuid",
"title": "String",
"type": "electronics|furniture|tools|clothing|books|other",
"condition": "new|like-new|good|used|for-parts",
"description": "String",
"photos": ["dataurl", "..."],
"transactionMode": "sale|rent|both",
"price": 0,
"rentRates": {"day":0,"week":0,"month":0},
"location": "String",
"lastUsedAt": "ISO date",
"createdAt": "ISO date",
"status": "in-use|idle|planned|listed-sale|listed-rent"
}
````

* **Storage keys:**

  * `idlelist.items.v1`
  * `idlelist.prefs.v1`

---

## 💾 Backup, Import, and Auto-save

* **Export JSON:** Preferences → “Export JSON”. Downloads a single portable file.
* **Import JSON:** Preferences → “Import JSON”. Select a previous backup to restore.
* **Auto-save to file:**

  * Click **Enable Auto-save** to choose a `.json` file.
  * Changes write to this file automatically (desktop Chromium browsers).
  * **Disable Auto-save** stops writing and clears the file handle.

> If your browser doesn’t support file-based autosave, export manually.

---

## 📸 Photos

* Added images are stored as Data URLs (base64) in your local storage.
* Keep photos reasonably sized to avoid exceeding storage limits.
* Placeholders use `https://picsum.photos/w/h` for cards without images.

---

## 🧭 Pages Overview

* **Dashboard:** Totals, in-use/idle/listed counts + quick actions for idle items.
* **My Items:** Create or edit items, check-in to mark as “used today,” and set listing status.
* **Marketplace:** Filter by mode/type, search by text; grab a “share” text block for quick posting anywhere.
* **Preferences:** Adjust idle threshold and allowed modes per type; manage backups and autosave.
* **Help:** Local documentation, privacy notes, and tips.

---

## 🛠️ Customization

* Branding text and UI labels live inside each page’s inline JSON blocks with keys like `brand`, `tagline`, and `nav`.
* Tailwind classes drive the layout; `css/styles.css` adds a light, consistent visual system (rounded cards, inputs, and buttons).

---

## ❓ FAQ

**Q: Can this post to public marketplaces automatically?**
No. IdleList generates **copy-share** text you can post anywhere. It’s local-first and privacy-friendly.

**Q: Where is my data stored?**
In your browser’s `localStorage`. Export/import keeps data portable. Auto-save writes to a local file you choose.

**Q: Why are some features disabled when I double-click HTML files?**
Browsers often restrict APIs on `file://`. Use a local HTTP server.

**Q: Can I change which types allow rent vs sale?**
Yes. Preferences → “Type to allowed modes”.

---

## 🧪 Testing Checklist

* Add an item with photos and description.
* Change the **Idle threshold** in Preferences to `0` or `1` and reload to see idle detection.
* Click “I used this today” to reset idle status.
* List an item for **Sale** or **Rent**, then find it in **Marketplace** and copy the share text.
* Export JSON, clear `localStorage`, then Import to validate restore.
* Enable Auto-save, make edits, confirm the chosen `.json` file updates.

---

## 🗺️ Roadmap (suggested)

* Inline price guidance per category
* Image compression before storage
* Simple PWA install
* CSV export/import
* Optional cloud sync adapter

---

## 🔒 Privacy

IdleList is local-first. No tracking, no external calls, unless you explicitly export or enable file auto-save.

---

## 📜 License

MIT — do what you want, just don’t remove attribution.

```
```
