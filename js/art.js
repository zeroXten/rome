/* =====================================================================
   art.js — PIXEL-ART engine (Civ-2 style).
   Renders the map as low-res canvases (used as Leaflet image overlays) plus
   small pixel sprites for monuments. image-rendering:pixelated keeps it crunchy.
   Everything is geo-anchored via data.js project(), so GPS still lands right.
   ===================================================================== */

(function () {
  const { VB, project, MONUMENTS } = window.ROME;

  const PX = 0.3;                                  // canvas pixels per viewBox unit
  const BW = Math.round(VB.w * PX);               // base image width  (~362)
  const BH = Math.round(VB.h * PX);               // base image height (~300)
  const pt = (lat, lng) => { const p = project(lng, lat); return { x: p.x * PX, y: p.y * PX }; };

  const C = {
    grassA: "#699640", grassB: "#5f8d38", grassC: "#54812f", forest: "#3a6a25",
    wat: "#356fae", watHi: "#63a6dd", watLo: "#264f7c", bank: "#8a7448",
    st: "#c2b99f", stM: "#9a9179", stD: "#5f5946",
    aqued: "#b8935a", aquedHi: "#d8c39a", aquedD: "#7c5c33",
    fabRoof: "#9d5c44", fabWall: "#b0997180", fabRoofD: "#7f3a24",
    road: "#cdb079", roadD: "#a5884f",
    cyA: "#2c5730", cyB: "#3f7442", trunk: "#6b4a2a",
    lawnA: "#69a83a", lawnB: "#5c9a31", scrub: "#2f5620",
    mar: "#efe9d6", marS: "#c9bf9e", roof: "#b5482f", roofD: "#7f3120",
    gold: "#f2cf58",
  };

  const nz = (a, b) => { const n = Math.sin(a * 12.9898 + b * 78.233) * 43758.5453; return n - Math.floor(n); };

  function newCanvas(w, h) { const cv = document.createElement("canvas"); cv.width = w; cv.height = h; return cv; }
  function px(x, ix, iy, w, h, c) { x.fillStyle = c; x.fillRect(ix | 0, iy | 0, Math.max(1, w | 0), Math.max(1, h | 0)); }
  function ellF(x, cx, cy, rx, ry, c) { x.fillStyle = c; for (let dy = -ry; dy <= ry; dy++) { const tt = 1 - (dy * dy) / (ry * ry); if (tt < 0) continue; const dx = Math.round(rx * Math.sqrt(tt)); x.fillRect(Math.round(cx - dx), Math.round(cy + dy), dx * 2 + 1, 1); } }
  function halfDome(x, cx, cy, rx, ry, c) { x.fillStyle = c; for (let dy = -ry; dy <= 0; dy++) { const tt = 1 - (dy * dy) / (ry * ry); if (tt < 0) continue; const dx = Math.round(rx * Math.sqrt(tt)); x.fillRect(Math.round(cx - dx), Math.round(cy + dy), dx * 2 + 1, 1); } }
  function triUp(x, cx, by, base, hgt, c) { for (let i = 0; i < hgt; i++) { const w = Math.round(base * (1 - i / hgt)); px(x, cx - Math.round(w / 2), by - i, w, 1, c); } }

  /* ----------------------------------------------------------------- *
   *  BASE TERRAIN  (one full opaque image per era, cross-faded)         *
   * ----------------------------------------------------------------- */

  // Tiber traced through its real bridges (each bridge sits on the river), so the
  // characteristic westward bend around the Campus Martius is captured.
  const RIVER = [
    [41.9220,12.4690],[41.9165,12.4715],                                      // enters from the north
    [41.9120,12.4745],[41.9083,12.4756],[41.9058,12.4744],[41.9017,12.4712], // → Ponte Sant'Angelo
    [41.9013,12.4664],[41.8994,12.4649],[41.8975,12.4640],                    // westward bend
    [41.8949,12.4664],[41.8925,12.4694],[41.8909,12.4757],[41.8901,12.4780],  // → Tiber Island
    [41.8888,12.4798],[41.8860,12.4788],[41.8837,12.4765],[41.8790,12.4740],[41.8730,12.4715],
  ];
  const HILLS = [
    [41.8894,12.4875,74],[41.8931,12.4828,60],[41.8836,12.4817,80],[41.8860,12.4930,80],
    [41.8958,12.4960,92],[41.8992,12.4928,70],[41.9012,12.4882,78],[41.9075,12.4790,64],
  ];
  const FABRIC = [
    [41.8908,12.4855,60,50,1,7],[41.8925,12.4868,140,140,2,7],[41.8948,12.4820,205,185,3,7],
    [41.8975,12.4760,150,125,4,7],[41.8930,12.4855,320,290,5,7],[41.8915,12.4790,375,335,6,7],
    [41.8985,12.4720,120,105,7,99],[41.9008,12.4600,64,52,7,99],
    [41.8980,12.4735,175,150,8,99],[41.9010,12.4585,80,64,8,99],
  ];
  const SERVIAN = [[41.9008,12.4832],[41.9002,12.4905],[41.8972,12.4972],[41.8928,12.4982],[41.8878,12.4952],[41.8838,12.4882],[41.8828,12.4818],[41.8872,12.4802],[41.8940,12.4812]];
  // Aurelian circuit traced through its real gates on the land side, following the
  // Tiber's east bank on the river side. West-bank loop encloses Trastevere/Janiculum.
  const AUR_E = [
    [41.9100,12.4840],[41.9089,12.4884],[41.9086,12.4975],[41.9095,12.5028], // Pincio→Porta Pia
    [41.9067,12.5052],[41.8955,12.5113],[41.8916,12.5147],                    // Castra→Tiburtina→Maggiore
    [41.8862,12.5064],[41.8836,12.5015],[41.8797,12.5030],[41.8762,12.5013],  // S.Giovanni→Latina→S.Sebastiano
    [41.8730,12.4952],[41.8759,12.4808],                                      // Ardeatina→Porta S.Paolo (Pyramid)
    [41.8745,12.4758],[41.8850,12.4790],[41.8905,12.4762],[41.8985,12.4660],  // up the river's east bank
    [41.9045,12.4725],[41.9090,12.4785],[41.9100,12.4840],
  ];
  const AUR_W = [[41.8798,12.4725],[41.8835,12.4640],[41.8875,12.4588],[41.8935,12.4602],[41.8948,12.4658],[41.8930,12.4692]];
  const AQ_MARCIA = [[41.8912,12.5120],[41.8940,12.5000],[41.8955,12.4884]];
  const AQ_VIRGO = [[41.9090,12.4872],[41.9050,12.4840],[41.9012,12.4812],[41.9006,12.4790]];
  const AQ_CLAUDIA = [[41.8916,12.5145],[41.8898,12.5030],[41.8878,12.4962],[41.8886,12.4882]];
  const APPIA = [[41.8905,12.4900],[41.8830,12.4952],[41.8762,12.5013],[41.8712,12.5052]];

  function polyPts(list) { return list.map(([la, ln]) => pt(la, ln)); }

  function thickLine(x, list, w, colorFn) {
    const p = polyPts(list);
    for (let s = 0; s < p.length - 1; s++) {
      const a = p[s], b = p[s + 1], steps = Math.max(1, Math.hypot(b.x - a.x, b.y - a.y));
      for (let t = 0; t <= steps; t++) {
        const cx = a.x + (b.x - a.x) * t / steps, cy = a.y + (b.y - a.y) * t / steps;
        for (let o = -w; o <= w; o++) { px(x, cx, cy + o, 1, 1, colorFn(cx, cy, o)); px(x, cx + o, cy, 1, 1, colorFn(cx, cy, o)); }
      }
    }
  }

  function drawRiver(x) {
    const p = polyPts(RIVER);
    for (let s = 0; s < p.length - 1; s++) {
      const a = p[s], b = p[s + 1], steps = Math.max(1, Math.hypot(b.x - a.x, b.y - a.y));
      for (let t = 0; t <= steps; t++) {
        const cx = a.x + (b.x - a.x) * t / steps, cy = a.y + (b.y - a.y) * t / steps, half = 4;
        px(x, cx - half - 1, cy, 1, 1, C.bank); px(x, cx + half + 1, cy, 1, 1, C.bank);
        for (let i = -half; i <= half; i++) { const c = (i < -half + 1) ? C.watLo : (((i + (cy | 0)) % 6 === 0) ? C.watHi : C.wat); px(x, cx + i, cy, 1, 1, c); }
      }
    }
    const isl = pt(41.8901, 12.4780); ellF(x, isl.x, isl.y, 3, 2, C.grassB);
  }

  // Aqueduct: warm sandstone channel with little arch-piers below, so it reads
  // distinctly from the cool-grey crenellated walls and the tan roads.
  function drawAqueduct(x, list) {
    const p = polyPts(list); let acc = 0;
    for (let s = 0; s < p.length - 1; s++) {
      const a = p[s], b = p[s + 1], steps = Math.max(1, Math.hypot(b.x - a.x, b.y - a.y));
      for (let t = 0; t <= steps; t++) {
        const cx = Math.round(a.x + (b.x - a.x) * t / steps), cy = Math.round(a.y + (b.y - a.y) * t / steps);
        px(x, cx, cy - 1, 1, 3, C.aqued); px(x, cx, cy - 1, 1, 1, C.aquedHi);
        if (++acc % 4 === 0) px(x, cx, cy + 2, 1, 2, C.aquedD);   // arch pier
      }
    }
  }

  function drawWall(x, list) {
    const p = polyPts(list);
    for (let s = 0; s < p.length - 1; s++) {
      const a = p[s], b = p[s + 1], steps = Math.max(1, Math.hypot(b.x - a.x, b.y - a.y));
      for (let t = 0; t <= steps; t++) {
        const cx = Math.round(a.x + (b.x - a.x) * t / steps), cy = Math.round(a.y + (b.y - a.y) * t / steps);
        px(x, cx - 1, cy - 2, 3, 4, C.stM); px(x, cx - 1, cy - 2, 3, 1, C.st); px(x, cx - 1, cy + 1, 3, 1, C.stD);
        if (t % 4 === 0) px(x, cx - 1, cy - 3, 1, 1, C.stM);
      }
    }
  }

  function drawFabricBlob(x, la, ln, rx, ry) {
    // Coarser 2x2 blocks + muted, mostly-translucent tan + sparse red roofs =
    // reads as "built up" without the busy 1px speckle.
    const c = pt(la, ln), RX = rx * PX, RY = ry * PX;
    for (let dy = -RY; dy <= RY; dy += 2) {
      const tt = 1 - (dy * dy) / (RY * RY); if (tt < 0) continue;
      const dx = Math.round(RX * Math.sqrt(tt)), yy = Math.round(c.y + dy);
      for (let ix = Math.round(c.x - dx); ix <= c.x + dx; ix += 2) {
        const r = nz(ix, yy);
        if (r > 0.86) px(x, ix, yy, 2, 2, C.fabRoof);
        else if (r > 0.4) px(x, ix, yy, 2, 2, C.fabWall);
      }
    }
  }

  function drawPark(x, la, ln, r) {
    const c = pt(la, ln), R = r * PX;
    for (let dy = -R; dy <= R; dy++) {
      const tt = 1 - (dy * dy) / (R * R); if (tt < 0) continue;
      const dx = Math.round(R * Math.sqrt(tt)), yy = Math.round(c.y + dy);
      for (let ix = Math.round(c.x - dx); ix <= c.x + dx; ix++) {
        const n = nz(ix * 1.4, yy * 1.4);
        px(x, ix, yy, 1, 1, n > 0.78 ? C.forest : (n > 0.42 ? C.lawnA : C.lawnB));
      }
    }
    const clusters = Math.max(3, Math.round(R / 5));
    for (let k = 0; k < clusters; k++) {
      const a = nz(k + 1, c.x) * 6.28, rr = nz(c.y, k + 1) * R * 0.82;
      const tx = c.x + Math.cos(a) * rr, ty = c.y + Math.sin(a) * rr * 0.9;
      ellF(x, tx, ty - 1, 2, 2, C.forest); ellF(x, tx, ty - 2, 1, 1, C.cyB);
    }
  }

  // ragged "coastline" so the map is an organic green island in the void, not a hard rectangle
  function raggedEdge(x) {
    const margin = 30;
    for (let iy = 0; iy < BH; iy++) for (let ix = 0; ix < BW; ix++) {
      const d = Math.min(ix, iy, BW - 1 - ix, BH - 1 - iy);
      if (d > margin) continue;
      const tt = d / margin;
      const cut = 0.28 + 0.5 * nz(ix * 0.55, iy * 0.55);
      if (tt < cut) x.clearRect(ix, iy, 1, 1);
      else if (tt < cut + 0.16) px(x, ix, iy, 1, 1, nz(ix, iy) > 0.5 ? C.forest : C.scrub);
    }
  }

  function drawCircus(x) {
    const m = MONUMENTS.find(mm => mm.type === "circus"); if (!m) return;
    const c = pt(m.lat, m.lng);
    ellF(x, c.x, c.y, 19, 6, C.stM); ellF(x, c.x, c.y, 15, 4, C.grassC); px(x, c.x - 10, c.y - 1, 20, 2, C.stD);
  }

  function drawBase(era) {
    const cv = newCanvas(BW, BH), x = cv.getContext("2d");
    x.imageSmoothingEnabled = false;
    // grass, dithered
    px(x, 0, 0, BW, BH, C.grassB);
    for (let yy = 0; yy < BH; yy += 2) for (let xx = 0; xx < BW; xx += 2) { const n = nz(xx, yy); if (n > 0.85) px(x, xx, yy, 2, 2, C.grassA); else if (n < 0.16) px(x, xx, yy, 2, 2, C.grassC); }
    // hills
    HILLS.forEach(([la, ln, r]) => { const c = pt(la, ln), R = r * PX; for (let dy = -R * 0.8; dy <= R * 0.8; dy++) { const tt = 1 - (dy * dy) / (R * 0.8 * R * 0.8); if (tt < 0) continue; const dx = Math.round(R * Math.sqrt(tt)); for (let ix = Math.round(c.x - dx); ix <= c.x + dx; ix++) if (nz(ix, c.y + dy) > 0.45) px(x, ix, Math.round(c.y + dy), 1, 1, C.forest); } });
    drawRiver(x);
    // roads
    thickLine(x, APPIA, 1, () => C.road);
    // aqueduct lines
    if (era >= 3) drawAqueduct(x, AQ_MARCIA);
    if (era >= 4) drawAqueduct(x, AQ_VIRGO);
    if (era >= 5) drawAqueduct(x, AQ_CLAUDIA);
    // (The built-up "population" texture was removed — it added too much visual
    //  noise. The city's extent is told by its buildings, walls and parks instead;
    //  the population figure lives in the readout panel.)
    // parks & green spaces
    MONUMENTS.forEach((m) => { if (m.type === "park" && m.era <= era) drawPark(x, m.lat, m.lng, m.r || 30); });
    if (era >= 2) drawCircus(x);
    // walls
    if (era >= 2 && era < 7) drawWall(x, SERVIAN);
    if (era >= 6) { drawWall(x, AUR_E); drawWall(x, AUR_W); }
    raggedEdge(x);
    return cv.toDataURL();
  }

  function buildBaseImages() { const arr = []; for (let e = 1; e <= 9; e++) arr.push(drawBase(e)); return arr; }

  /* ----------------------------------------------------------------- *
   *  MONUMENT SPRITES  (small pixel canvases, one per type+status)      *
   * ----------------------------------------------------------------- */
  const SW = 26, SH = 30, GX = 13, GY = 24;   // sprite canvas + ground point

  const S = {
    village:(x)=>{[[GX-6,GY-2],[GX,GY-4],[GX+5,GY-1]].forEach(([a,b])=>{triUp(x,a,b,7,4,C.roof);px(x,a-3,b,7,3,C.marS);});},
    temple:(x)=>{px(x,GX-9,GY-1,18,3,C.marS);for(let i=0;i<6;i++)px(x,GX-8+i*3,GY-10,2,9,C.mar);px(x,GX-8,GY-11,17,2,C.marS);triUp(x,GX,GY-11,20,7,C.roof);px(x,GX-9,GY-11,18,1,C.roofD);},
    amphi:(x)=>{ // Colosseum — oval arena + surviving multi-tier facade stepping down (broken)
      ellF(x,GX,GY-3,12,6,C.st);ellF(x,GX,GY-3,12,6,C.stM);ellF(x,GX,GY-3,7,3,C.stD);
      for(let a=0;a<22;a++){const an=a/22*6.28;px(x,GX+Math.round(Math.cos(an)*11),GY-3+Math.round(Math.sin(an)*5.5),1,2,C.st);}
      for(let c=0;c<13;c++){const h=Math.max(2,14-c);px(x,GX-11+c,GY-4-h,1,h,C.st);px(x,GX-11+c,GY-4-h,1,1,C.stM);}
      for(let r=0;r<3;r++)for(let cc=0;cc<4;cc++)px(x,GX-9+cc*3,GY-15+r*4,1,2,C.stD);},
    theatre:(x)=>{halfDome(x,GX,GY,12,9,C.stM);halfDome(x,GX,GY-1,9,7,C.st);px(x,GX-12,GY,24,2,C.stD);for(let i=0;i<5;i++)px(x,GX-9+i*4,GY-6,1,6,C.stD);},
    baths:(x)=>{px(x,GX-11,GY-9,22,11,C.stM);halfDome(x,GX-5,GY-9,5,4,C.st);halfDome(x,GX+5,GY-9,5,4,C.st);px(x,GX-11,GY-9,22,1,C.st);px(x,GX-8,GY-4,4,6,C.stD);px(x,GX+4,GY-4,4,6,C.stD);},
    dome:(x)=>{px(x,GX-10,GY-2,20,4,C.marS);halfDome(x,GX,GY-2,9,10,C.stM);halfDome(x,GX,GY-3,7,8,C.st);px(x,GX-1,GY-14,2,3,C.gold);for(let i=0;i<4;i++)px(x,GX-8+i*5,GY-2,2,4,C.mar);},
    pantheon:(x)=>{ // portico of columns + pediment, shallow dome behind
      px(x,GX-9,GY-3,20,5,C.stM);halfDome(x,GX+2,GY-3,10,6,C.stM);halfDome(x,GX+2,GY-4,8,4,C.st);
      triUp(x,GX-3,GY-7,17,5,C.marS);px(x,GX-12,GY-7,18,1,C.mar);
      for(let i=0;i<6;i++)px(x,GX-11+i*3,GY-6,2,8,C.mar);px(x,GX-12,GY+1,19,1,C.stD);},
    stpeters:(x)=>{ // Michelangelo's great ribbed dome, lantern & cross, over the facade
      px(x,GX-11,GY-4,22,6,C.mar);px(x,GX-11,GY-4,22,1,C.marS);
      for(let i=0;i<9;i++)px(x,GX-10+Math.round(i*2.6),GY-3,1,5,C.marS);
      halfDome(x,GX,GY-4,9,11,C.st);halfDome(x,GX,GY-5,7,9,C.mar);
      for(const dx of[-6,-3,0,3,6]){const hh=Math.round(10*(1-Math.abs(dx)/8));px(x,GX+dx,GY-4-hh,1,hh,C.marS);}
      px(x,GX-1,GY-18,2,3,C.st);px(x,GX-1,GY-22,2,3,C.gold);px(x,GX-2,GY-21,4,1,C.gold);},
    column:(x)=>{px(x,GX-1,GY-16,3,17,C.mar);px(x,GX-2,GY,5,2,C.marS);px(x,GX-2,GY-18,5,2,C.marS);px(x,GX-1,GY-21,2,3,C.gold);},
    arch:(x)=>{px(x,GX-8,GY-11,16,13,C.stM);px(x,GX-8,GY-13,16,2,C.st);px(x,GX-3,GY-3,6,5,C.stD);halfDome(x,GX,GY-3,3,4,C.stD);},
    pyramid:(x)=>{triUp(x,GX,GY,20,16,C.mar);for(let i=0;i<16;i++)px(x,GX,GY-i,Math.round(10*(1-i/16)),1,C.marS);},
    tomb:(x)=>{ellF(x,GX,GY-2,11,4,C.stM);px(x,GX-11,GY-8,22,6,C.st);ellF(x,GX,GY-8,11,4,C.st);ellF(x,GX,GY-10,6,2,C.cyA);},
    castle:(x)=>{ // Castel Sant'Angelo — round drum on square base, bronze angel on top
      px(x,GX-11,GY-3,22,5,C.stM);px(x,GX-11,GY-3,22,1,C.st);
      px(x,GX-8,GY-13,16,10,C.st);px(x,GX-8,GY-13,16,1,C.stM);ellF(x,GX,GY-13,8,2,C.st);
      for(const dx of[-8,-4,0,4,7])px(x,GX+dx,GY-15,2,2,C.stM);
      px(x,GX-3,GY-18,6,5,C.stM);px(x,GX-3,GY-18,6,1,C.st);
      px(x,GX-1,GY-22,2,4,C.gold);px(x,GX-3,GY-21,6,1,C.gold);},
    basilica:(x)=>{px(x,GX-10,GY-6,17,8,C.marS);triUp(x,GX-2,GY-6,17,4,C.roof);px(x,GX+7,GY-12,4,14,C.st);px(x,GX+8,GY-15,2,3,C.stD);px(x,GX+7,GY-14,4,1,C.stD);},
    hall:(x)=>{px(x,GX-10,GY-8,20,10,C.marS);triUp(x,GX,GY-8,22,4,C.roof);px(x,GX-7,GY-4,4,6,C.stD);px(x,GX+3,GY-4,4,6,C.stD);},
    tower:(x)=>{px(x,GX-3,GY-18,7,20,C.stM);for(const dx of[-3,0,3])px(x,GX+dx,GY-20,2,2,C.stM);px(x,GX-1,GY-4,2,4,C.stD);},
    fountain:(x)=>{ellF(x,GX,GY-1,10,4,C.watHi);ellF(x,GX,GY-1,10,4,C.wat);px(x,GX-1,GY-8,3,7,C.marS);px(x,GX-3,GY-9,7,2,C.mar);},
    steps:(x)=>{for(let i=0;i<6;i++)px(x,GX-9+i,GY-2-i*2,18-i*2,2,i%2?C.marS:C.mar);},
    colonnade:(x)=>{for(let i=0;i<9;i++){const an=(i/8-0.5)*2.2;px(x,GX+Math.sin(an)*12,GY-2-Math.cos(an)*3,2,5,C.mar);}},
    wedding:(x)=>{ // Vittoriano — the white "wedding cake": tiers, colonnade, gilded quadrigae
      px(x,GX-12,GY-1,24,3,C.mar);px(x,GX-11,GY-4,22,3,C.marS);px(x,GX-9,GY-6,18,2,C.mar);
      for(let i=0;i<11;i++)px(x,GX-9+Math.round(i*1.8),GY-11,1,5,C.mar);
      px(x,GX-9,GY-12,18,1,C.marS);px(x,GX-6,GY-15,12,3,C.mar);
      px(x,GX-2,GY-18,4,3,C.gold);px(x,GX-9,GY-15,2,2,C.gold);px(x,GX+7,GY-15,2,2,C.gold);},
    circus:(x)=>{ellF(x,GX,GY-3,12,5,C.stM);ellF(x,GX,GY-3,9,3,C.grassC);px(x,GX-6,GY-4,12,2,C.stD);},
    church:(x)=>{px(x,GX-9,GY-7,18,9,C.marS);triUp(x,GX,GY-13,18,6,C.roofD);px(x,GX-1,GY-19,2,6,C.marS);px(x,GX-3,GY-17,6,2,C.marS);px(x,GX-2,GY-4,4,6,C.stD);},
    obelisk:(x)=>{px(x,GX-3,GY-1,6,3,C.marS);for(let i=0;i<20;i++)px(x,GX,GY-2-i,Math.round(4*(1-i/26)),1,C.st);triUp(x,GX,GY-22,3,3,C.gold);},
    bridge:(x)=>{px(x,GX-11,GY-2,22,2,C.stM);halfDome(x,GX-6,GY,4,3,C.wat);halfDome(x,GX+6,GY,4,3,C.wat);px(x,GX-11,GY-3,22,1,C.st);},
    statue:(x)=>{px(x,GX-4,GY-4,8,6,C.stM);px(x,GX-5,GY+1,10,2,C.st);ellF(x,GX,GY-10,2,2,C.marS);px(x,GX-1,GY-8,2,5,C.mar);px(x,GX,GY-7,4,1,C.mar);},
    aqueduct:(x)=>{px(x,GX-11,GY-8,22,3,C.st);for(const gx of[-11,-4,3,10])px(x,GX+gx,GY-5,2,7,C.stM);for(const gx of[-9,-2,5])halfDome(x,GX+gx+2,GY-5,3,3,C.stM);},
    gate:(x)=>{px(x,GX-8,GY-8,16,10,C.stM);px(x,GX-10,GY-12,5,14,C.st);px(x,GX+5,GY-12,5,14,C.st);px(x,GX-3,GY-3,6,5,C.stD);halfDome(x,GX,GY-3,3,4,C.stD);},
    catacomb:(x)=>{halfDome(x,GX,GY,11,7,C.stM);px(x,GX-2,GY-4,4,6,C.stD);px(x,GX-1,GY-11,2,5,C.st);px(x,GX-2,GY-9,4,1,C.st);},
    park:(x)=>{px(x,GX-10,GY-1,20,3,C.lawnB);for(const [dx,dy] of [[-7,-1],[-1,-4],[6,-2],[-4,-6],[3,-7],[8,-5]]){px(x,GX+dx,GY+dy,2,4,C.trunk);ellF(x,GX+dx+1,GY+dy-2,3,4,C.cyA);ellF(x,GX+dx,GY+dy-3,2,3,C.cyB);}},
  };

  function statusPad(x, status) {
    const c = status === "gone" ? null : (status === "ruin" ? "#cf8b52" : "#c9a24b");
    if (c) { px(x, GX - 3, GY + 1, 6, 3, "#3a2c14"); px(x, GX - 2, GY + 1, 4, 2, c); }
    else { px(x, GX - 3, GY + 1, 6, 1, "#8a744a"); }
  }

  const cache = {};
  function spriteFor(type, status) {
    const key = type + "_" + status;
    if (cache[key]) return cache[key];
    const cv = newCanvas(SW, SH), x = cv.getContext("2d");
    x.imageSmoothingEnabled = false;
    statusPad(x, status);
    (S[type] || S.hall)(x);
    return (cache[key] = cv.toDataURL());
  }

  window.ROME.buildBaseImages = buildBaseImages;
  window.ROME.spriteFor = spriteFor;
  window.ROME.SPRITE = { SW, SH, GX, GY };
})();
