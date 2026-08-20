/* =====================================================================
   app.js — wires the illustrated map to Leaflet: pan/zoom, the time
   slider + era cross-fade, monument popups, and GPS "you are here".
   ===================================================================== */

(function () {
  const { MAP_BOUNDS, ERAS, MONUMENTS, buildBaseImages, spriteFor, SPRITE, LABELS } = window.ROME;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

  const bounds = L.latLngBounds(
    [MAP_BOUNDS.south, MAP_BOUNDS.west],
    [MAP_BOUNDS.north, MAP_BOUNDS.east]
  );

  const map = L.map("map", {
    zoomControl: true,
    attributionControl: false,
    maxBounds: bounds.pad(1.4),        // roomy void to explore around the island
    maxBoundsViscosity: 0.6,
    zoomSnap: 0.25,
    minZoom: 11,
    maxZoom: 18,
  });
  // Fit the whole city into view. Re-run on load and resize so a stale container
  // size at init (fonts still loading, etc.) can't leave the map mis-sized.
  let HOME = { center: bounds.getCenter(), zoom: 15 };
  function fitHome() {
    map.invalidateSize();
    map.fitBounds(bounds);
    const fitZoom = map.getZoom();
    // On tall (portrait / phone) screens, zoom in one step so the city fills the
    // frame instead of letterboxing — the monuments cluster in the centre anyway.
    if (map.getSize().y > map.getSize().x) map.setZoom(fitZoom + 1);
    map.setMinZoom(fitZoom - 2);   // allow zooming out to see the island in the void
    HOME = { center: map.getCenter(), zoom: map.getZoom() };
  }
  fitHome();
  window.addEventListener("load", fitHome);

  // Live scale bar (metric) — shows how far a given distance is at the current zoom.
  L.control.scale({ position: "topleft", metric: true, imperial: false, maxWidth: 120 }).addTo(map);

  // Pixel-art base terrain: one full image per era, stacked and cross-faded.
  const baseLayers = buildBaseImages().map((url) =>
    L.imageOverlay(url, bounds, { interactive: false, className: "pixel-base", opacity: 0 }).addTo(map)
  );
  function updateBase(t) {
    const lo = clamp(Math.floor(t), 0, 8);
    const hi = Math.min(lo + 1, 8);
    const frac = clamp(t - Math.floor(t), 0, 1);
    baseLayers.forEach((layer, i) => layer.setOpacity(i === lo ? 1 : (i === hi ? frac : 0)));
  }

  /* ---------------- fade engine ---------------- */
  // t runs 0..9 across the nine era-bands. A monument with era=E is fully solid
  // once t reaches E-1, and cross-fades in only over the last ~0.45 of the
  // previous band; out=O means fully gone when t reaches O-1.
  function opacityFor(appear, out, t) {
    const W = 0.45;
    const inEnd = appear - 1;
    let op = clamp((t - (inEnd - W)) / W, 0, 1);
    if (out != null) op *= clamp((out - 1 - t) / W, 0, 1);
    return op;
  }

  /* ---------------- monument markers (fixed-size icon markers) ---------------- */
  const STATUS = {
    standing: { badge: "Standing today — you can visit", icon: "🏛️", ghost: 1 },
    ruin:     { badge: "Ruins you can visit",            icon: "🏺", ghost: 1 },
    gone:     { badge: "Vanished — known from history",  icon: "✦",  ghost: 0.5 },
  };

  // Hover tooltips only make sense with a hover-capable pointer (desktop). On
  // touch, a tap would fire both the tooltip and the popup, leaving the tooltip
  // stranded under the popup — so we skip binding tooltips there.
  const canHover = !!(window.matchMedia && window.matchMedia("(hover: hover)").matches);

  const markersById = {};
  let userPos = null;                 // {lat,lng} once geolocation succeeds (shared by GPS + list)
  const markers = MONUMENTS.map((m) => {
    const st = STATUS[m.status] || STATUS.standing;
    const dest = encodeURIComponent(m.gmap || `${m.lat},${m.lng}`); // Google Maps directions target
    const marker = L.marker([m.lat, m.lng], {
      icon: L.divIcon({
        className: "mon-ico" + (m.status === "gone" ? " is-gone" : ""),
        html: `<img class="psprite" src="${spriteFor(m.sprite || m.type, m.status)}" width="${SPRITE.SW * 2}" height="${SPRITE.SH * 2}" alt="">`,
        iconSize: [SPRITE.SW * 2, SPRITE.SH * 2],
        iconAnchor: [SPRITE.GX * 2, SPRITE.GY * 2],   // the ground point pins to the real coordinate
        popupAnchor: [0, -SPRITE.GY * 2 + 8],
        tooltipAnchor: [0, -SPRITE.GY * 2 + 12],
      }),
      riseOnHover: true,
      keyboard: false,
    });
    if (canHover) marker.bindTooltip(m.name, { direction: "top", className: "mon-tip" });
    marker.bindPopup(
      `<div class="pop">
         <h3>${m.name}</h3>
         <div class="date">${m.date}</div>
         ${m.type === "moment"
           ? '<div class="badge moment">◈ A moment in history</div>'
           : `<div class="badge ${m.status}">${st.icon} ${st.badge}</div>`}
         ${m.secret ? '<div class="secret-tag">✦ A little secret most walk past</div>' : ""}
         <p>${m.blurb}</p>
         <div class="links">
           <a href="${m.wiki}" target="_blank" rel="noopener">📖 Wikipedia</a>
           <a href="https://www.google.com/maps/dir/?api=1&destination=${dest}" target="_blank" rel="noopener">📍 Directions</a>
         </div>
       </div>`,
      { maxWidth: 264, className: "rome-popup",
        autoPanPaddingTopLeft: L.point(14, 134), autoPanPaddingBottomRight: L.point(14, 124) }
    );
    marker._m = m;
    marker._ghost = st.ghost;
    markersById[m.id] = marker;
    return marker;
  });

  const FADE_W = 0.45;
  function updateMarkers(t) {
    markers.forEach((mk) => {
      const op = opacityFor(mk._m.era, mk._m.out, t);
      if (op > 0.08) {
        if (!map.hasLayer(mk)) mk.addTo(map);
        mk.setOpacity(op * mk._ghost);
        // "new" = actively fading in as you cross into its era (self-limiting: only
        // the arrivals at the boundary you're crossing glow, never a whole era at once)
        const appearOp = clamp((t - (mk._m.era - 1 - FADE_W)) / FADE_W, 0, 1);
        if (mk._icon) mk._icon.classList.toggle("is-new", appearOp > 0.1 && appearOp < 0.96);
      } else if (map.hasLayer(mk)) {
        map.removeLayer(mk);
      }
    });
  }

  /* ---------------- district labels (non-interactive) ---------------- */
  const labels = (LABELS || []).map((l) => {
    const rot = l.rotate ? `transform:rotate(${l.rotate}deg);` : "";
    const marker = L.marker([l.lat, l.lng], {
      icon: L.divIcon({
        className: "map-label",
        html: `<span style="${rot}font-size:${l.size}px">${l.text}</span>`,
        iconSize: [140, 22],
        iconAnchor: [70, 11],
      }),
      interactive: false,
      keyboard: false,
      zIndexOffset: -1000,
    });
    marker._l = l;
    return marker;
  });

  function updateLabels(t) {
    labels.forEach((mk) => {
      const op = opacityFor(mk._l.era, null, t);
      if (op > 0.05) {
        if (!map.hasLayer(mk)) mk.addTo(map);
        mk.setOpacity(op);
      } else if (map.hasLayer(mk)) {
        map.removeLayer(mk);
      }
    });
  }

  /* ---------------- slider + readout ---------------- */
  const slider = document.getElementById("time");
  const eraName = document.getElementById("era-name");
  const eraSub = document.getElementById("era-sub");
  const eraYear = document.getElementById("era-year");
  const eraPop = document.getElementById("era-pop");
  const eraBlurb = document.getElementById("era-blurb");

  const lerp = (a, b, f) => a + (b - a) * f;
  function fmtYear(y) {
    y = Math.round(y);
    if (y < 0) return `${-y} BC`;
    if (y < 1000) return `AD ${y}`;
    return `${y}`;
  }

  function render() {
    const t = (slider.value / 1000) * 9; // 0..9
    updateBase(t);
    updateMarkers(t);
    updateLabels(t);

    // readout
    const k = clamp(Math.floor(t), 0, 8);
    const era = ERAS[k];
    const frac = clamp(t - k, 0, 1);
    eraName.textContent = era.name;
    eraSub.textContent = era.sub;
    eraYear.textContent = fmtYear(lerp(era.start, era.end, frac));
    eraPop.textContent = era.pop === "declining" ? "population declining" : era.pop.replace("~", "") + " people";
    eraBlurb.textContent = era.blurb;
    document.body.dataset.era = era.i;
  }
  slider.addEventListener("input", render);

  /* ---------------- era quick-jump chips ---------------- */
  const chips = document.getElementById("chips");
  ERAS.forEach((era, idx) => {
    const b = document.createElement("button");
    b.textContent = era.name;
    b.className = "chip";
    b.addEventListener("click", () => {
      // jump to the middle of that era band
      slider.value = Math.round(((idx + 0.5) / 9) * 1000);
      render();
    });
    chips.appendChild(b);
  });

  /* ---------------- GPS "you are here" ---------------- */
  let youMarker = null, youCircle = null;
  const locateBtn = document.getElementById("locate");
  const locateMsg = document.getElementById("locate-msg");

  locateBtn.addEventListener("click", () => {
    if (!navigator.geolocation) {
      locateMsg.textContent = "Geolocation isn't available in this browser.";
      return;
    }
    locateMsg.textContent = "Locating…";
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude, accuracy } = pos.coords;
        userPos = { lat: latitude, lng: longitude };
        refreshListDistances();
        const ll = L.latLng(latitude, longitude);
        if (youMarker) { map.removeLayer(youMarker); map.removeLayer(youCircle); }
        youCircle = L.circle(ll, { radius: accuracy, color: "#2b6cb0", weight: 1, fillColor: "#4299e1", fillOpacity: 0.15 }).addTo(map);
        youMarker = L.marker(ll, { icon: youIcon() }).addTo(map);
        if (bounds.contains(ll)) {
          map.setView(ll, Math.max(map.getZoom(), 16));
          locateMsg.textContent = "You're on the map!";
        } else {
          const km = (map.distance(ll, bounds.getCenter()) / 1000).toFixed(1);
          map.fitBounds(bounds);
          locateMsg.textContent = `You're about ${km} km from historic Rome — dot shown at your real position.`;
        }
      },
      (err) => {
        locateMsg.textContent =
          err.code === 1 ? "Location permission denied." : "Couldn't get your location.";
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  });

  function youIcon() {
    return L.divIcon({ className: "you-icon", html: '<div class="you-dot"></div>', iconSize: [18, 18] });
  }

  /* ---------------- sites list view ---------------- */
  const listPanel = document.getElementById("listpanel");
  const listRows = document.getElementById("listrows");
  const listSub = document.getElementById("list-sub");
  const sortDistBtn = document.getElementById("sort-dist");
  const sortYearBtn = document.getElementById("sort-year");
  const searchInput = document.getElementById("list-search");
  const SHORT = { standing: "Standing", ruin: "Ruins", gone: "Vanished" };
  let sortMode = "year";
  let searchQ = "";

  // normalise for forgiving search: lowercase, strip accents & punctuation
  const norm = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/['’`]/g, "").replace(/[^a-z0-9 ]+/g, " ").replace(/\s+/g, " ").trim();

  function parseYear(m) {
    const d = m.date; let x;
    if (/archaic/i.test(d)) return ERAS[m.era - 1].start;
    if ((x = /(\d+)\s*BC/i.exec(d))) return -parseInt(x[1]);
    if ((x = /(\d+)(?:st|nd|rd|th)\s*c\.\s*BC/i.exec(d))) return -(parseInt(x[1]) * 100 - 50);
    if ((x = /AD\s*(\d+)/i.exec(d))) return parseInt(x[1]);
    if ((x = /\b(1[0-9]{3}|20[0-9]{2})\b/.exec(d))) return parseInt(x[1]);
    if ((x = /(\d+)(?:st|nd|rd|th)\s*c\./i.exec(d))) return parseInt(x[1]) * 100 - 50;
    return ERAS[m.era - 1].start;
  }
  MONUMENTS.forEach((m) => { m._year = parseYear(m); m._hay = norm(m.name + " " + m.date + " " + m.blurb); });

  function siteLatLng(m) { // catacombs marker sits at the map edge; use the real spot for distance
    if (m.gmap) { const p = m.gmap.split(","); return L.latLng(+p[0], +p[1]); }
    return L.latLng(m.lat, m.lng);
  }
  function distMeters(m) { return userPos ? map.distance(L.latLng(userPos.lat, userPos.lng), siteLatLng(m)) : null; }
  function fmtDist(d) { return d == null ? "" : (d < 1000 ? Math.round(d / 10) * 10 + " m" : (d / 1000).toFixed(d < 10000 ? 1 : 0) + " km"); }

  const rowEls = MONUMENTS.map((m) => {
    const row = document.createElement("button");
    row.className = "lrow";
    row.innerHTML =
      `<img class="lspr" src="${spriteFor(m.sprite || m.type, m.status)}" alt="">
       <span class="ltext"><span class="lname">${m.name}</span>` +
      `<span class="lmeta">${m.date} · ${m.type === "moment" ? '<span class="lmoment">◈ moment</span>' : `<span class="lstatus ${m.status}">${SHORT[m.status]}</span>`}` +
      `${m.secret ? ' · <span class="lsecret">✦ secret</span>' : ""}</span>` +
      `<span class="lblurb">${m.blurb}</span></span>` +
      `<span class="ldist"></span>`;
    row.addEventListener("click", () => goToSite(m));
    return row;
  });

  function renderList() {
    let arr = MONUMENTS.map((m, i) => ({ m, el: rowEls[i], d: distMeters(m) }));
    if (searchQ) {
      const toks = searchQ.split(" ").filter(Boolean);
      arr = arr.filter(({ m }) => toks.every((t) => m._hay.indexOf(t) !== -1));
    }
    if (sortMode === "dist" && userPos) arr.sort((a, b) => a.d - b.d);
    else arr.sort((a, b) => a.m._year - b.m._year);
    listRows.innerHTML = "";
    if (!arr.length) {
      listRows.innerHTML = '<div class="lnone">No sites match your search.</div>';
    } else {
      arr.forEach(({ el, d }) => { el.querySelector(".ldist").textContent = fmtDist(d); listRows.appendChild(el); });
    }
    sortDistBtn.classList.toggle("on", sortMode === "dist");
    sortYearBtn.classList.toggle("on", sortMode === "year");
    sortDistBtn.disabled = !userPos;
    listSub.textContent = searchQ
      ? `${arr.length} match${arr.length === 1 ? "" : "es"}`
      : (userPos ? "sorted by distance from you" : "sorted oldest → newest");
  }
  searchInput.addEventListener("input", () => { searchQ = norm(searchInput.value); renderList(); });
  function refreshListDistances() { if (listPanel.classList.contains("open")) renderList(); }

  function openList() {
    listPanel.classList.add("open");
    if (!userPos && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        userPos = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        sortMode = "dist"; renderList();
      }, () => {}, { timeout: 8000 });
    }
    if (userPos) sortMode = "dist";
    renderList();
  }
  document.getElementById("list-btn").addEventListener("click", () =>
    listPanel.classList.contains("open") ? listPanel.classList.remove("open") : openList());
  document.getElementById("list-close").addEventListener("click", () => listPanel.classList.remove("open"));
  sortDistBtn.addEventListener("click", () => { if (userPos) { sortMode = "dist"; renderList(); } });
  sortYearBtn.addEventListener("click", () => { sortMode = "year"; renderList(); });

  function goToSite(m) {
    listPanel.classList.remove("open");
    slider.value = Math.round(((m.era - 0.5) / 9) * 1000);  // show the era this site belongs to
    render();
    const mk = markersById[m.id];
    if (!mk) return;
    map.flyTo(L.latLng(m.lat, m.lng), Math.max(map.getZoom(), 16), { duration: 0.6 });
    setTimeout(() => { if (!map.hasLayer(mk)) mk.addTo(map); mk.openPopup(); }, 680);
  }

  /* ---------------- reset view ---------------- */
  document.getElementById("reset").addEventListener("click", () => {
    map.setView(HOME.center, HOME.zoom, { animate: true });
    locateMsg.textContent = "";
  });

  /* ---------------- map key ---------------- */
  const legend = document.getElementById("legend");
  document.getElementById("key-btn").addEventListener("click", () => legend.classList.toggle("open"));
  document.getElementById("legend-close").addEventListener("click", () => legend.classList.remove("open"));

  /* ---------------- intro card ---------------- */
  const intro = document.getElementById("intro");
  document.getElementById("intro-close").addEventListener("click", () => intro.classList.add("hidden"));

  // start in the Imperial peak — the most iconic skyline
  slider.value = Math.round((4.5 / 9) * 1000);
  render();
})();
