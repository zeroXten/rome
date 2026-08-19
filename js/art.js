/* =====================================================================
   art.js — builds the illustrated "old map" of Rome as one SVG.
   Every drawn thing is tagged data-appear (era index it fades in) and
   optional data-out (era it fades away). app.js drives the cross-fade.
   Terrain (data-appear="0") is always visible.
   ===================================================================== */

(function () {
  const { VB, project, MONUMENTS } = window.ROME;

  // Ink-on-parchment palette
  const C = {
    land:   "#e9dcbf",
    landEdge:"#d8c39a",
    ink:    "#5a4632",
    stone:  "#efe6d2",
    stoneD: "#d9c8a6",
    roof:   "#b06a43",
    roofD:  "#8f5232",
    white:  "#f5f0e6",
    gold:   "#c39b45",
    water:  "#a9c4bf",
    waterD: "#89aca6",
    wall:   "#9c8862",
    wallD:  "#7c6a48",
    green:  "#93a267",
    hill:   "#d9c8a0",
  };

  // Project a real coord to viewBox space
  const P = (lat, lng) => project(lng, lat);

  const round = (n) => Math.round(n * 10) / 10;

  // Wrap markup in a positioned, scaled, fade-tagged group.
  // Buildings are lifted ~7 units so the ground/marker sits at their base.
  function place(lat, lng, scale, appear, out, inner, extra = "") {
    const p = P(lat, lng);
    const o = out != null ? ` data-out="${out}"` : "";
    return `<g class="feat" data-appear="${appear}"${o} ${extra}
      transform="translate(${round(p.x)},${round(p.y - 7)}) scale(${scale})">${inner}</g>`;
  }

  // Soft shadow ellipse to seat a building on the ground
  const shadow = (w, y = 6) =>
    `<ellipse cx="0" cy="${y}" rx="${w}" ry="${w * 0.32}" fill="#000" opacity="0.10"/>`;

  /* ---- building vocabulary (drawn centred on 0,0, ink outline) ---- */
  const ICON = {
    temple: () => `${shadow(11)}
      <rect x="-11" y="-8" width="22" height="16" fill="${C.stone}" stroke="${C.ink}" stroke-width="1"/>
      <line x1="-8" y1="-8" x2="-8" y2="8" stroke="${C.ink}" stroke-width="1"/>
      <line x1="-3.5" y1="-8" x2="-3.5" y2="8" stroke="${C.ink}" stroke-width="1"/>
      <line x1="1" y1="-8" x2="1" y2="8" stroke="${C.ink}" stroke-width="1"/>
      <line x1="6" y1="-8" x2="6" y2="8" stroke="${C.ink}" stroke-width="1"/>
      <polygon points="-13,-8 13,-8 0,-17" fill="${C.stoneD}" stroke="${C.ink}" stroke-width="1"/>`,

    amphi: () => `${shadow(26)}
      <ellipse cx="0" cy="0" rx="26" ry="17" fill="${C.stone}" stroke="${C.ink}" stroke-width="1.4"/>
      <ellipse cx="0" cy="0" rx="16" ry="10" fill="${C.landEdge}" stroke="${C.ink}" stroke-width="1"/>
      ${[...Array(11)].map((_, i) => { const a = (i / 11) * Math.PI * 2; return `<line x1="${round(Math.cos(a)*16)}" y1="${round(Math.sin(a)*10)}" x2="${round(Math.cos(a)*26)}" y2="${round(Math.sin(a)*17)}" stroke="${C.ink}" stroke-width="0.7"/>`; }).join("")}
      <path d="M-26,0 A26,17 0 0 1 26,0" fill="none" stroke="${C.stoneD}" stroke-width="3"/>`,

    theatre: () => `${shadow(16)}
      <path d="M-16,6 A16,16 0 0 1 16,6 Z" fill="${C.stone}" stroke="${C.ink}" stroke-width="1.2"/>
      <path d="M-11,6 A11,11 0 0 1 11,6" fill="none" stroke="${C.ink}" stroke-width="0.8"/>
      <path d="M-6,6 A6,6 0 0 1 6,6" fill="none" stroke="${C.ink}" stroke-width="0.8"/>
      <rect x="-16" y="6" width="32" height="4" fill="${C.stoneD}" stroke="${C.ink}" stroke-width="1"/>`,

    baths: () => `${shadow(20)}
      <rect x="-20" y="-11" width="40" height="22" fill="${C.stone}" stroke="${C.ink}" stroke-width="1.2"/>
      <path d="M-14,-11 a6,6 0 0 1 12,0" fill="${C.stoneD}" stroke="${C.ink}" stroke-width="1"/>
      <path d="M2,-11 a6,6 0 0 1 12,0" fill="${C.stoneD}" stroke="${C.ink}" stroke-width="1"/>
      <path d="M-9,11 a5,7 0 0 1 0,-14" fill="none" stroke="${C.ink}" stroke-width="0.8"/>
      <path d="M4,11 a5,7 0 0 1 0,-14" fill="none" stroke="${C.ink}" stroke-width="0.8"/>`,

    dome: () => `${shadow(15)}
      <rect x="-15" y="-2" width="30" height="12" fill="${C.stone}" stroke="${C.ink}" stroke-width="1"/>
      <rect x="-15" y="10" width="30" height="4" fill="${C.stoneD}" stroke="${C.ink}" stroke-width="1"/>
      <path d="M-11,-2 a11,13 0 0 1 22,0 Z" fill="${C.stoneD}" stroke="${C.ink}" stroke-width="1.2"/>
      <line x1="0" y1="-15" x2="0" y2="-19" stroke="${C.ink}" stroke-width="1"/>
      <circle cx="0" cy="-20" r="1.6" fill="${C.gold}" stroke="${C.ink}" stroke-width="0.6"/>`,

    column: () => `${shadow(5)}
      <rect x="-2" y="-30" width="4" height="34" fill="${C.stone}" stroke="${C.ink}" stroke-width="1"/>
      <rect x="-4" y="2" width="8" height="4" fill="${C.stoneD}" stroke="${C.ink}" stroke-width="1"/>
      <path d="M-2,-30 q2,-3 4,0" fill="none" stroke="${C.ink}" stroke-width="0.6"/>
      <circle cx="0" cy="-33" r="2.4" fill="${C.gold}" stroke="${C.ink}" stroke-width="0.6"/>`,

    arch: () => `${shadow(9)}
      <rect x="-9" y="-13" width="18" height="18" fill="${C.stone}" stroke="${C.ink}" stroke-width="1.2"/>
      <path d="M-4,5 v-8 a4,4 0 0 1 8,0 v8 Z" fill="${C.landEdge}" stroke="${C.ink}" stroke-width="1"/>
      <rect x="-9" y="-17" width="18" height="4" fill="${C.stoneD}" stroke="${C.ink}" stroke-width="1"/>`,

    pyramid: () => `${shadow(11)}
      <polygon points="0,-20 11,7 -11,7" fill="${C.white}" stroke="${C.ink}" stroke-width="1.2"/>
      <polygon points="0,-20 4,7 -11,7" fill="${C.stoneD}" opacity="0.6"/>`,

    tomb: () => `${shadow(18)}
      <ellipse cx="0" cy="6" rx="18" ry="6" fill="${C.stoneD}" stroke="${C.ink}" stroke-width="1"/>
      <rect x="-18" y="-4" width="36" height="10" fill="${C.stone}" stroke="${C.ink}" stroke-width="1.1"/>
      <ellipse cx="0" cy="-4" rx="18" ry="6" fill="${C.stone}" stroke="${C.ink}" stroke-width="1.1"/>
      <ellipse cx="0" cy="-6" rx="11" ry="4" fill="${C.green}" stroke="${C.ink}" stroke-width="0.8"/>`,

    castle: () => `${shadow(15)}
      <rect x="-15" y="-2" width="30" height="14" fill="${C.stone}" stroke="${C.ink}" stroke-width="1.2"/>
      <ellipse cx="0" cy="-2" rx="15" ry="5" fill="${C.stone}" stroke="${C.ink}" stroke-width="1.2"/>
      <rect x="-9" y="-15" width="18" height="13" fill="${C.stoneD}" stroke="${C.ink}" stroke-width="1.2"/>
      ${[-9,-3,3,9].map(x=>`<rect x="${x-0.5}" y="-18" width="3" height="3" fill="${C.stoneD}" stroke="${C.ink}" stroke-width="0.6"/>`).join("")}`,

    basilica: () => `${shadow(15)}
      <rect x="-15" y="-6" width="26" height="14" fill="${C.stone}" stroke="${C.ink}" stroke-width="1"/>
      <polygon points="-15,-6 11,-6 11,-11 -15,-11" fill="${C.roof}" stroke="${C.ink}" stroke-width="1"/>
      <rect x="11" y="-14" width="6" height="22" fill="${C.stoneD}" stroke="${C.ink}" stroke-width="1"/>
      <polygon points="11,-14 17,-14 14,-18" fill="${C.roofD}" stroke="${C.ink}" stroke-width="0.8"/>`,

    hall: () => `${shadow(15)}
      <rect x="-15" y="-9" width="30" height="18" fill="${C.stone}" stroke="${C.ink}" stroke-width="1.1"/>
      <polygon points="-15,-9 15,-9 11,-14 -11,-14" fill="${C.roof}" stroke="${C.ink}" stroke-width="1"/>
      <rect x="-11" y="-4" width="5" height="13" fill="${C.landEdge}" stroke="${C.ink}" stroke-width="0.7"/>
      <rect x="6" y="-4" width="5" height="13" fill="${C.landEdge}" stroke="${C.ink}" stroke-width="0.7"/>`,

    tower: () => `${shadow(6)}
      <rect x="-5" y="-26" width="10" height="32" fill="${C.stoneD}" stroke="${C.ink}" stroke-width="1.1"/>
      ${[-5,-1,3].map(x=>`<rect x="${x}" y="-29" width="2.5" height="3" fill="${C.stoneD}" stroke="${C.ink}" stroke-width="0.5"/>`).join("")}
      <rect x="-2" y="-4" width="4" height="10" fill="${C.ink}" opacity="0.5"/>`,

    fountain: () => `${shadow(12)}
      <ellipse cx="0" cy="4" rx="13" ry="6" fill="${C.water}" stroke="${C.ink}" stroke-width="1.1"/>
      <ellipse cx="0" cy="4" rx="13" ry="6" fill="none" stroke="${C.waterD}" stroke-width="0.6"/>
      <path d="M0,4 C-3,-4 3,-6 0,-12" fill="none" stroke="${C.waterD}" stroke-width="1"/>
      <rect x="-3" y="-6" width="6" height="10" fill="${C.stone}" stroke="${C.ink}" stroke-width="0.8"/>`,

    steps: () => `${shadow(11)}
      ${[0,3,6,9,12].map(y=>`<rect x="${-11+y*0.4}" y="${-8+y}" width="${22-y*0.8}" height="2.4" fill="${C.stone}" stroke="${C.ink}" stroke-width="0.6"/>`).join("")}`,

    colonnade: () => `${shadow(20)}
      <path d="M-20,10 A22,14 0 0 1 20,10" fill="none" stroke="${C.stone}" stroke-width="5"/>
      <path d="M-20,10 A22,14 0 0 1 20,10" fill="none" stroke="${C.ink}" stroke-width="0.7" stroke-dasharray="1.5 2"/>`,

    church: () => `${shadow(12)}
      <rect x="-12" y="-8" width="24" height="16" fill="${C.stone}" stroke="${C.ink}" stroke-width="1.1"/>
      <polygon points="-12,-8 12,-8 0,-15" fill="${C.roofD}" stroke="${C.ink}" stroke-width="1"/>
      <line x1="0" y1="-15" x2="0" y2="-20" stroke="${C.ink}" stroke-width="1.3"/>
      <line x1="-2.6" y1="-17.6" x2="2.6" y2="-17.6" stroke="${C.ink}" stroke-width="1.3"/>
      <path d="M-3,8 v-6 a3,3 0 0 1 6,0 v6 Z" fill="${C.landEdge}" stroke="${C.ink}" stroke-width="0.8"/>`,

    obelisk: () => `${shadow(4)}
      <rect x="-4" y="4" width="8" height="4" fill="${C.stone}" stroke="${C.ink}" stroke-width="1"/>
      <polygon points="-2.4,4 2.4,4 1.5,-25 -1.5,-25" fill="${C.stoneD}" stroke="${C.ink}" stroke-width="1"/>
      <polygon points="-1.5,-25 1.5,-25 0,-30" fill="${C.gold}" stroke="${C.ink}" stroke-width="0.8"/>`,

    bridge: () => `${shadow(14)}
      <path d="M-14,3 Q0,-9 14,3" fill="none" stroke="${C.stoneD}" stroke-width="2.4"/>
      <path d="M-12,3 a4.5,4.5 0 0 1 9,0 Z" fill="${C.water}" stroke="${C.ink}" stroke-width="0.9"/>
      <path d="M3,3 a4.5,4.5 0 0 1 9,0 Z" fill="${C.water}" stroke="${C.ink}" stroke-width="0.9"/>
      <line x1="-14" y1="3" x2="14" y2="3" stroke="${C.ink}" stroke-width="1"/>`,

    statue: () => `${shadow(6)}
      <rect x="-5" y="1" width="10" height="9" fill="${C.stoneD}" stroke="${C.ink}" stroke-width="1"/>
      <rect x="-6" y="9" width="12" height="2.5" fill="${C.stone}" stroke="${C.ink}" stroke-width="0.8"/>
      <circle cx="0" cy="-9" r="2.4" fill="${C.stone}" stroke="${C.ink}" stroke-width="0.9"/>
      <path d="M0,-6.6 L0,1 M0,-5 L-3.6,-7.6 M0,-4.5 L3.6,-2" fill="none" stroke="${C.ink}" stroke-width="1.4" stroke-linecap="round"/>`,

    aqueduct: () => `${shadow(16)}
      <rect x="-16" y="-9" width="32" height="3.5" fill="${C.stoneD}" stroke="${C.ink}" stroke-width="0.9"/>
      ${[-15,-8,-1,6,13].map(x=>`<rect x="${x}" y="-5.5" width="2.5" height="13.5" fill="${C.stone}" stroke="${C.ink}" stroke-width="0.8"/>`).join("")}
      ${[-15,-8,-1,6].map(x=>`<path d="M${x+2.5},-5.5 Q${x+4.75},-9.5 ${x+7},-5.5" fill="none" stroke="${C.ink}" stroke-width="0.7"/>`).join("")}`,

    gate: () => `${shadow(12)}
      <rect x="-11" y="-9" width="22" height="17" fill="${C.stoneD}" stroke="${C.ink}" stroke-width="1.1"/>
      <rect x="-13" y="-13" width="7" height="21" fill="${C.stone}" stroke="${C.ink}" stroke-width="1.1"/>
      <rect x="6" y="-13" width="7" height="21" fill="${C.stone}" stroke="${C.ink}" stroke-width="1.1"/>
      <path d="M-4,8 v-7 a4,4 0 0 1 8,0 v7 Z" fill="${C.landEdge}" stroke="${C.ink}" stroke-width="1"/>
      ${[-13,-9,6,10].map(x=>`<rect x="${x}" y="-16" width="3" height="3" fill="${C.stone}" stroke="${C.ink}" stroke-width="0.5"/>`).join("")}`,

    catacomb: () => `${shadow(12)}
      <path d="M-12,8 L-12,1 A12,9 0 0 1 12,1 L12,8 Z" fill="${C.stoneD}" stroke="${C.ink}" stroke-width="1"/>
      <path d="M-3,8 L-3,2 a3,3.5 0 0 1 6,0 L3,8 Z" fill="${C.ink}" opacity="0.75"/>
      <line x1="0" y1="-8" x2="0" y2="-2.5" stroke="${C.ink}" stroke-width="1.3"/>
      <line x1="-2.3" y1="-5.5" x2="2.3" y2="-5.5" stroke="${C.ink}" stroke-width="1.3"/>`,

    wedding: () => `${shadow(20)}
      <rect x="-20" y="2" width="40" height="7" fill="${C.white}" stroke="${C.ink}" stroke-width="1"/>
      <rect x="-15" y="-4" width="30" height="6" fill="${C.white}" stroke="${C.ink}" stroke-width="1"/>
      <path d="M-15,-4 q15,-14 30,0" fill="${C.white}" stroke="${C.ink}" stroke-width="1"/>
      ${[-11,-6,-1,4,9].map(x=>`<line x1="${x}" y1="-4" x2="${x}" y2="2" stroke="${C.ink}" stroke-width="0.7"/>`).join("")}`,

    village: () => `${shadow(10)}
      ${[[-7,2],[0,-1],[7,3]].map(([x,y])=>`<g transform="translate(${x},${y})"><polygon points="-4,2 4,2 0,-4" fill="${C.roof}" stroke="${C.ink}" stroke-width="0.8"/><rect x="-4" y="2" width="8" height="4" fill="${C.stone}" stroke="${C.ink}" stroke-width="0.8"/></g>`).join("")}`,

    circus: () => `${shadow(16)}
      <ellipse cx="0" cy="0" rx="17" ry="7" fill="${C.stone}" stroke="${C.ink}" stroke-width="1.3"/>
      <rect x="-8" y="-2" width="16" height="4" rx="2" fill="${C.stoneD}" stroke="${C.ink}" stroke-width="0.9"/>`,
  };

  // Circus Maximus is huge; its FOOTPRINT is drawn to real scale in the base layer
  // (below); the clickable marker uses the small ICON.circus glyph instead.
  function circusMaximus(m) {
    const c = P(m.lat, m.lng);
    return `<g class="feat" data-appear="${m.era}" transform="translate(${round(c.x)},${round(c.y)}) rotate(-8)">
      ${shadow(64)}
      <rect x="-64" y="-20" width="128" height="40" rx="20" fill="${C.landEdge}" stroke="${C.ink}" stroke-width="1.4"/>
      <rect x="-64" y="-20" width="128" height="40" rx="20" fill="none" stroke="${C.stoneD}" stroke-width="4" opacity="0.6"/>
      <rect x="-34" y="-3" width="68" height="6" rx="3" fill="${C.stoneD}" stroke="${C.ink}" stroke-width="1"/>
    </g>`;
  }

  /* ---------------- terrain (always visible) ---------------- */
  function terrain() {
    // land sheet
    let s = `<rect x="0" y="0" width="${VB.w}" height="${VB.h}" fill="${C.land}"/>`;

    // hills as soft shadows
    const hills = [
      [41.8894,12.4875,74,"Palatine"],[41.8931,12.4828,64,"Capitol"],
      [41.8836,12.4817,80,"Aventine"],[41.8860,12.4930,80,"Caelian"],
      [41.8958,12.4960,92,"Esquiline"],[41.8992,12.4928,70,"Viminal"],
      [41.9012,12.4882,78,"Quirinal"],[41.9075,12.4790,70,"Pincian"],
    ];
    s += hills.map(([la,ln,r]) => { const p = P(la,ln);
      return `<ellipse cx="${round(p.x)}" cy="${round(p.y)}" rx="${r}" ry="${r*0.8}" fill="${C.hill}" opacity="0.38"/>
              <ellipse cx="${round(p.x)}" cy="${round(p.y)}" rx="${r*0.6}" ry="${r*0.48}" fill="${C.hill}" opacity="0.34"/>`;
    }).join("");

    // Tiber
    const river = [
      [41.9120,12.4658],[41.9075,12.4655],[41.9035,12.4665],[41.9000,12.4690],
      [41.8965,12.4715],[41.8935,12.4745],[41.8912,12.4772],[41.8895,12.4787],
      [41.8875,12.4792],[41.8850,12.4787],[41.8820,12.4775],[41.8780,12.4772],[41.8730,12.4778],
    ].map(([la,ln]) => { const p = P(la,ln); return `${round(p.x)},${round(p.y)}`; });
    s += `<polyline points="${river.join(" ")}" fill="none" stroke="${C.water}" stroke-width="20" stroke-linecap="round" stroke-linejoin="round"/>`;
    s += `<polyline points="${river.join(" ")}" fill="none" stroke="${C.waterD}" stroke-width="20" stroke-linecap="round" stroke-linejoin="round" opacity="0.25"/>`;

    // Tiber Island
    const isl = P(41.8901,12.4780);
    s += `<ellipse cx="${round(isl.x)}" cy="${round(isl.y)}" rx="9" ry="4.5" fill="${C.land}" stroke="${C.ink}" stroke-width="0.8" transform="rotate(-20 ${round(isl.x)} ${round(isl.y)})"/>`;

    // Ancient roads (faint), for texture
    const road = (pts) => { const pp = pts.map(([la,ln]) => { const p = P(la,ln); return `${round(p.x)},${round(p.y)}`; });
      return `<polyline points="${pp.join(" ")}" fill="none" stroke="${C.landEdge}" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>`; };
    // Via Appia — out through the SE gate toward the catacombs
    s += road([[41.8905,12.4900],[41.8830,12.4952],[41.8762,12.5013],[41.8712,12.5052]]);
    return `<g class="feat" data-appear="0">${s}</g>`;
  }

  /* ---------------- aqueducts (geographic lines that grow over time) ---- */
  function aqueducts() {
    const line = (pts, from) => {
      const pp = pts.map(([la,ln]) => { const p = P(la,ln); return `${round(p.x)},${round(p.y)}`; });
      return `<g class="feat" data-appear="${from}">
        <polyline points="${pp.join(" ")}" fill="none" stroke="${C.stoneD}" stroke-width="3" stroke-linecap="round" opacity="0.7"/>
        <polyline points="${pp.join(" ")}" fill="none" stroke="${C.ink}" stroke-width="0.8" stroke-dasharray="1 4" stroke-linecap="round" opacity="0.6"/>
      </g>`;
    };
    let s = "";
    // Aqua Marcia (144 BC) — in from the east
    s += line([[41.8912,12.5120],[41.8940,12.5000],[41.8955,12.4884]], 3);
    // Aqua Virgo (19 BC) — curving down from the north to the Campus Martius
    s += line([[41.9090,12.4872],[41.9050,12.4840],[41.9012,12.4812],[41.9006,12.4790]], 4);
    // Aqua Claudia (AD 52) — striding in from Porta Maggiore to the Palatine
    s += line([[41.8916,12.5145],[41.8898,12.5030],[41.8878,12.4962],[41.8886,12.4882]], 5);
    return s;
  }

  /* ---------------- city fabric (grows, then recedes, then fills) -------- */
  function fabric() {
    // hatched rooftop texture
    const defs = `<pattern id="tiles" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(20)">
        <rect width="8" height="8" fill="${C.roof}" opacity="0.13"/>
        <path d="M0,4 H8 M4,0 V8" stroke="${C.roofD}" stroke-width="0.5" opacity="0.28"/>
      </pattern>`;
    const blob = (la, ln, rx, ry, from, out, rot = 0) => {
      const p = P(la, ln);
      const o = out != null ? ` data-out="${out}"` : "";
      return `<g class="feat" data-appear="${from}"${o}>
        <ellipse cx="${round(p.x)}" cy="${round(p.y)}" rx="${rx}" ry="${ry}"
          transform="rotate(${rot} ${round(p.x)} ${round(p.y)})"
          fill="url(#tiles)" stroke="${C.roofD}" stroke-width="0.5" stroke-opacity="0.35" opacity="0.5"/>
      </g>`;
    };
    let s = `<defs>${defs}</defs>`;
    // antiquity: cumulative growth within the walls, all receding at medieval (7)
    s += blob(41.8908,12.4855,60,50,1,7,10);
    s += blob(41.8925,12.4868,140,140,2,7);
    s += blob(41.8948,12.4820,205,185,3,7,10);
    s += blob(41.8975,12.4760,150,125,4,7,20);
    s += blob(41.8930,12.4855,320,290,5,7);
    s += blob(41.8915,12.4790,375,335,6,7);
    // medieval bend + Vatican borgo (the disabitato)
    s += blob(41.8985,12.4720,120,105,7,null,15);
    s += blob(41.9008,12.4600,64,52,7,null);
    // baroque densification
    s += blob(41.8980,12.4735,175,150,8,null,12);
    s += blob(41.9010,12.4585,80,64,8,null);
    // modern city fills the whole sheet and beyond
    s += `<g class="feat" data-appear="9"><rect x="-40" y="-40" width="${VB.w+80}" height="${VB.h+80}" fill="url(#tiles)" opacity="0.6"/></g>`;
    return s;
  }

  /* ---------------- walls ---------------- */
  function polyWall(coords, from, out, cls) {
    const pts = coords.map(([la, ln]) => { const p = P(la, ln); return `${round(p.x)},${round(p.y)}`; });
    const o = out != null ? ` data-out="${out}"` : "";
    return `<g class="feat" data-appear="${from}"${o}>
      <polygon points="${pts.join(" ")}" fill="none" stroke="${C.wallD}" stroke-width="6" stroke-linejoin="round"/>
      <polygon points="${pts.join(" ")}" fill="none" stroke="${C.wall}" stroke-width="3" stroke-linejoin="round" stroke-dasharray="1 5"/>
    </g>`;
  }
  function walls() {
    const servian = [
      [41.9008,12.4832],[41.9002,12.4905],[41.8972,12.4972],[41.8928,12.4982],
      [41.8878,12.4952],[41.8838,12.4882],[41.8828,12.4818],[41.8872,12.4802],[41.8940,12.4812],
    ];
    const aurelianE = [
      [41.9100,12.4828],[41.9082,12.4945],[41.9012,12.5038],[41.8905,12.5078],
      [41.8802,12.5022],[41.8748,12.4932],[41.8762,12.4832],[41.8800,12.4760],
      [41.8860,12.4735],[41.8935,12.4712],[41.9002,12.4692],[41.9062,12.4718],
    ];
    const aurelianW = [
      [41.9058,12.4560],[41.8995,12.4558],[41.8925,12.4638],[41.8882,12.4682],
      [41.8935,12.4718],[41.9012,12.4700],[41.9052,12.4638],
    ];
    return polyWall(servian, 2, 7) + polyWall(aurelianE, 6) + polyWall(aurelianW, 6);
  }

  /* ---------------- monument icons (rendered as fixed-size Leaflet markers) ----
     These are NOT part of the geographic overlay, so they keep a constant screen
     size — zooming in spreads the pins apart instead of magnifying the clutter.
     A small coloured "ground dot" under each building shows its visit status. */
  function iconSVG(type, status) {
    const draw = ICON[type] || ICON.hall;
    const dot = status === "gone"
      ? `<circle cx="0" cy="15" r="3.4" fill="${C.land}" stroke="${C.ink}" stroke-width="1.2" stroke-dasharray="2 2"/>`
      : `<circle cx="0" cy="15" r="3.4" fill="${status === "ruin" ? "#cf8b52" : "#c9a24b"}" stroke="${C.ink}" stroke-width="1.2"/>`;
    return `<svg class="mon-svg" viewBox="-30 -34 60 60" width="44" height="44" xmlns="http://www.w3.org/2000/svg">${dot}${draw()}</svg>`;
  }

  /* ---------------- assemble the geographic base (no point monuments) -------- */
  function buildScene() {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", `0 0 ${VB.w} ${VB.h}`);
    svg.setAttribute("preserveAspectRatio", "none");
    const circus = MONUMENTS.find((m) => m.type === "circus");
    svg.innerHTML = terrain() + fabric() + aqueducts() + walls() + (circus ? circusMaximus(circus) : "");
    return svg;
  }

  window.ROME.buildScene = buildScene;
  window.ROME.iconSVG = iconSVG;
})();
