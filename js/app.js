/* =====================================================================
   app.js — wires the illustrated map to Leaflet: pan/zoom, the time
   slider + era cross-fade, monument popups, and GPS "you are here".
   ===================================================================== */

(function () {
  const { MAP_BOUNDS, ERAS, MONUMENTS, buildScene, iconSVG, LABELS } = window.ROME;

  const bounds = L.latLngBounds(
    [MAP_BOUNDS.south, MAP_BOUNDS.west],
    [MAP_BOUNDS.north, MAP_BOUNDS.east]
  );

  const map = L.map("map", {
    zoomControl: true,
    attributionControl: false,
    maxBounds: bounds.pad(0.35),
    maxBoundsViscosity: 0.9,
    zoomSnap: 0.25,
    minZoom: 13,
    maxZoom: 18,
  });
  map.fitBounds(bounds);
  const fitZoom = map.getZoom();
  // On tall (portrait / phone) screens, zoom in one step so the city fills the
  // frame instead of letterboxing — the monuments cluster in the centre anyway.
  if (map.getSize().y > map.getSize().x) map.setZoom(fitZoom + 1);
  map.setMinZoom(fitZoom - 1);

  // Remember this framing so the "Back to Rome" button can return to it
  const HOME = { center: map.getCenter(), zoom: map.getZoom() };

  // Illustrated basemap as an SVG overlay pinned to real coordinates
  const scene = buildScene();
  L.svgOverlay(scene, bounds, { interactive: false, className: "rome-art" }).addTo(map);

  /* ---------------- fade engine ---------------- */
  // t runs 0..9 across the nine era-bands. Element with data-appear=E is
  // fully in when t reaches E-1; data-out=O means fully gone when t reaches O-1.
  function opacityFor(appear, out, t) {
    const inEnd = appear - 1;
    let op = clamp((t - (inEnd - 0.7)) / 0.7, 0, 1);
    if (out != null) op *= clamp((out - 1 - t) / 0.6, 0, 1);
    return op;
  }
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const featEls = () => scene.querySelectorAll(".feat");

  /* ---------------- monument markers (fixed-size icon markers) ---------------- */
  const STATUS = {
    standing: { badge: "Standing today — you can visit", icon: "🏛️", ghost: 1 },
    ruin:     { badge: "Ruins you can visit",            icon: "🏺", ghost: 1 },
    gone:     { badge: "Vanished — known from history",  icon: "✦",  ghost: 0.5 },
  };

  const markers = MONUMENTS.map((m) => {
    const st = STATUS[m.status] || STATUS.standing;
    const dest = encodeURIComponent(m.gmap || `${m.lat},${m.lng}`); // Google Maps directions target
    const marker = L.marker([m.lat, m.lng], {
      icon: L.divIcon({
        className: "mon-ico" + (m.status === "gone" ? " is-gone" : ""),
        html: iconSVG(m.type, m.status),
        iconSize: [44, 44],
        iconAnchor: [22, 36],   // the ground dot pins to the real coordinate
        popupAnchor: [0, -30],
        tooltipAnchor: [0, -26],
      }),
      riseOnHover: true,
      keyboard: false,
    });
    marker.bindTooltip(m.name, { direction: "top", className: "mon-tip" });
    marker.bindPopup(
      `<div class="pop">
         <h3>${m.name}</h3>
         <div class="date">${m.date}</div>
         <div class="badge ${m.status}">${st.icon} ${st.badge}</div>
         <p>${m.blurb}</p>
         <div class="links">
           <a href="${m.wiki}" target="_blank" rel="noopener">📖 Wikipedia</a>
           <a href="https://www.google.com/maps/dir/?api=1&destination=${dest}" target="_blank" rel="noopener">📍 Directions</a>
         </div>
       </div>`,
      { maxWidth: 264, className: "rome-popup" }
    );
    marker._m = m;
    marker._ghost = st.ghost;
    return marker;
  });

  function updateMarkers(t) {
    markers.forEach((mk) => {
      const op = opacityFor(mk._m.era, mk._m.out, t);
      if (op > 0.08) {
        if (!map.hasLayer(mk)) mk.addTo(map);
        mk.setOpacity(op * mk._ghost);
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
    // fade all artwork
    featEls().forEach((el) => {
      const appear = parseFloat(el.dataset.appear);
      const out = el.dataset.out != null ? parseFloat(el.dataset.out) : null;
      if (appear === 0 && out == null) { el.style.opacity = 1; return; }
      el.style.opacity = opacityFor(appear, out, t);
    });
    updateMarkers(t);
    updateLabels(t);

    // readout
    const k = clamp(Math.floor(t), 0, 8);
    const era = ERAS[k];
    const frac = clamp(t - k, 0, 1);
    eraName.textContent = era.name;
    eraSub.textContent = era.sub;
    eraYear.textContent = fmtYear(lerp(era.start, era.end, frac));
    eraPop.textContent = "≈ " + era.pop + " people";
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
