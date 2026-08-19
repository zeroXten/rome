# Rome Through Time 🏛️

An interactive, illustrated history map of Rome. Drag a slider across **2,700 years** —
from the founding of the city (753 BC) to today — and watch the city grow, its walls
expand, and its great monuments rise, drawn as an old illustrated map. Tap any monument
for its story, and use your phone's GPS to place yourself on the map.

**Pure static site** — HTML, CSS and vanilla JavaScript, plus a locally-vendored copy of
[Leaflet](https://leafletjs.com/). No build step, no API keys, no external services.
Perfect for GitHub Pages.

## What's in the box

```
index.html                 – the page shell (loads the VT323 pixel font; falls back to monospace)
css/style.css              – Civ-2 / retro pixel-game styling (beveled panels, chunky slider)
js/data.js                 – SINGLE SOURCE OF TRUTH: eras + monuments (coords, dates, blurbs)
js/art.js                  – PIXEL-ART engine: draws the terrain to low-res canvases (one per era)
                             and each monument to a small pixel sprite
js/app.js                  – Leaflet map, time-slider cross-fade, popups, GPS, reset
lib/leaflet/               – vendored Leaflet 1.9.4 (map engine)
mockup-pixel.html          – standalone style mockup (reference only; not used by the app)
docs/historical-reference.md – the researched history behind the data, with references
```

The look is **pixel art**: the base map is rendered to small canvases that Leaflet scales up
with `image-rendering: pixelated`, and monuments are fixed-size pixel sprites — so it stays
crunchy at every zoom while the geography underneath is still real (GPS lands correctly).

The map is real-world-accurate under the hood: the illustration is pinned to true
latitude/longitude, so the GPS "you are here" dot lands in the right place and pan/zoom
behave like any map. All the dates, coordinates and era assignments live in
[`js/data.js`](js/data.js) and are documented in
[`docs/historical-reference.md`](docs/historical-reference.md).

## Run it locally

Because it loads a few local files, open it through a tiny web server (not `file://`):

```bash
python3 -m http.server 8000
```

Then visit **http://localhost:8000**. On desktop the GPS button will offer a rough
location; on a phone (over HTTPS — see below) it's accurate.

## Deploy to GitHub Pages

1. Create a new GitHub repository and push these files to it:

   ```bash
   git init
   git add .
   git commit -m "Rome Through Time"
   git branch -M main
   git remote add origin https://github.com/<you>/<repo>.git
   git push -u origin main
   ```

2. On GitHub: **Settings → Pages → Build and deployment**. Set **Source** to
   *Deploy from a branch*, choose **main** / **/ (root)**, and Save.

3. After a minute your map is live at `https://<you>.github.io/<repo>/`.

> **GPS note:** browser geolocation only works over **HTTPS** (or `localhost`). GitHub
> Pages is served over HTTPS, so location works there out of the box — great for using it
> on your phone while standing in Rome.

## Extending it

- **Add a monument:** add one object to `MONUMENTS` in [`js/data.js`](js/data.js)
  (name, `lat`/`lng`, `type`, `era` it appears, `date`, `blurb`, `wiki`). It will appear
  on the map and as a tappable marker automatically. Choose `type` from the vocabulary in
  [`js/art.js`](js/art.js) (`temple`, `amphi`, `baths`, `dome`, `arch`, `column`, `tomb`,
  `basilica`, `fountain`, `tower`, …).
- **Adjust the timeline:** the nine eras are defined in `ERAS` in `js/data.js`.
- **Change the drawing of a building type:** edit its entry in the `ICON` map in `js/art.js`.

## Accuracy

The style is deliberately *evocative but broadly accurate* — an ancient-drawing feel, not
survey-grade cartography. Dates and positions are correct at a broad level (good enough to
place your GPS dot by the right monument); footprints are impressionistic. See
[`docs/historical-reference.md`](docs/historical-reference.md) for sources.
