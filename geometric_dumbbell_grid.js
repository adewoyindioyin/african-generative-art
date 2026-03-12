// ================================================================
// SKETCH 9 — Geometric Dumbbell Grid
// Repeating grid of dumbbell motifs measured from source_canvas.js
// ================================================================

// ── Palettes ─────────────────────────────────────────────────────
// Each palette defines:
//   bg       — canvas background
//   pole     — connecting pole colour
//   oA/oB/oC — orange-variant rings (outer → inner; bg fills centre)
//   gA/gB/gC — green-variant rings
//   oBar     — bar accent for orange variant
//   gBar     — bar accent for green variant
const PALETTES = [
  {
    name: 'Ọjọ',          // original SVG colours
    bg: '#fee9e2',  pole: '#363d60',
    oA: '#d7623e',  oB: '#f37650',  oC: '#faa862',
    gA: '#363d60',  gB: '#668b75',  gC: '#faa862',
    oBar: '#d7623e', gBar: '#363d60',
  },
  {
    name: 'Alẹ',          // midnight
    bg: '#0d1117',  pole: '#c89640',
    oA: '#7a0020',  oB: '#c04040',  oC: '#e89060',
    gA: '#1a2a6c',  gB: '#3060a0',  gC: '#70a0d0',
    oBar: '#7a0020', gBar: '#1a2a6c',
  },
  {
    name: 'Ilẹ',          // earth / forest
    bg: '#f5ece0',  pole: '#2c1810',
    oA: '#7a3510',  oB: '#c06020',  oC: '#f0b830',
    gA: '#2c5530',  gB: '#5e9c50',  gC: '#b8d868',
    oBar: '#7a3510', gBar: '#2c5530',
  },
  {
    name: 'Okun',         // ocean / indigo
    bg: '#1b2a4a',  pole: '#7eb8d4',
    oA: '#8b4513',  oB: '#c07030',  oC: '#e8d090',
    gA: '#0a3060',  gB: '#2060a0',  gC: '#70b0d0',
    oBar: '#8b4513', gBar: '#0a3060',
  },
];

let palIdx = 0;

// ── All geometry expressed as multiples of R (outer arc radius)
// Values measured directly from source_canvas.js.
// SVG source had R_outer = 123.5 SVG-units.

const RING_F     = [1.000, 0.788, 0.530, 0.295]; // ring radii / R
const POLE_GAP_F = 1.036;  // arch-centre → cup-centre distance / R
const TILE_Y_F   = 3.394;  // vertical row pitch / R
const COL_DX_F   = 2.966;  // x-offset A → B within one period / R
const TILE_X_F   = COL_DX_F * 2.000; // symmetric A-B-A spacing across the full period / R
const BAR_W_F    = 2.000;  // bar width / R  (= diameter)
const BAR_H_F    = 0.246;  // bar height / R
const BAR_OFF_F  = 0.120;  // bar-centre offset from arc flat-edge toward pole / R
const POLE_W_F   = 0.246;  // pole width / R
const POLE_EXT_F = 0.491;  // pole overhang beyond each arc centre / R
const STAGGER_F  = 0.50;   // column-B vertical offset in row units

// ── Animation tuning — now live-editable via Tweakpane ───────────
let PARAMS = {
  paletteIdx: 0,
  animSpeed:  0.07,
  breathAmt:  0.16,
};

// ── R is chosen so ≥ 5 complete rows fit on screen ───────────────
let R;
let isAnimating = true;
let pane;

function setup() {
  createCanvas(windowWidth, windowHeight);
  P5Capture.setDefaultOptions({
    format: 'mp4',
    quality: 1,
    framerate: 60,
  });
  R = min(height / (TILE_Y_F * 4.5),
          width  / (TILE_X_F * 1.5));

  // ── Tweakpane panel (v3 API) ──────────────────────────────────
  pane = new Tweakpane.Pane({ title: 'Dumbbell Grid' });

  pane.addInput(PARAMS, 'paletteIdx', {
    label: 'Palette',
    options: { 'Ọjọ': 0, 'Alẹ': 1, 'Ilẹ': 2, 'Okun': 3 },
  }).on('change', e => { palIdx = e.value; });

  pane.addInput(PARAMS, 'animSpeed', {
    label: 'Speed', min: 0.01, max: 0.3, step: 0.01,
  });

  pane.addInput(PARAMS, 'breathAmt', {
    label: 'Breathing', min: 0, max: 0.5, step: 0.01,
  });

  pane.addButton({ title: 'Save PNG' })
    .on('click', () => saveCanvas('dumbbell_grid_' + PALETTES[palIdx].name, 'png'));
}

function draw() {
  background(PALETTES[palIdx].bg);
  noStroke();

  const t    = frameCount * PARAMS.animSpeed;

  const TILE_X    = R * TILE_X_F;
  const TILE_Y    = R * TILE_Y_F;
  const COL_DX    = R * COL_DX_F;
  const POLE_GAP  = R * POLE_GAP_F;
  const STAGGER_Y  = R * TILE_Y_F * STAGGER_F;
  const breathPush = POLE_GAP * PARAMS.breathAmt * sin(t) * 0.5;

  // Over-tile by one period in each direction so edges never show gaps
  let colsNeeded = ceil(width  / TILE_X) + 2;
  let rowsNeeded = ceil(height / TILE_Y) + 2;

  for (let ix = -1; ix <= colsNeeded; ix++) {
    let xA = ix * TILE_X;
    let xB = xA + COL_DX;

    for (let iy = -1; iy <= rowsNeeded; iy++) {
      const baseArchYA = iy * TILE_Y;                    // col-A base top centre
      const baseArchYB = baseArchYA + STAGGER_Y;         // col-B base top centre
      const baseCupYA  = baseArchYA + POLE_GAP;          // col-A base bottom centre
      const baseCupYB  = baseArchYB + POLE_GAP;          // col-B base bottom centre

      // Equal-and-opposite push-up motion around each dumbbell's base gap.
      let archYA = baseArchYA - breathPush;
      let archYB = baseArchYB - breathPush;
      let cupYA  = baseCupYA  + breathPush;
      let cupYB  = baseCupYB  + breathPush;

      // Col A: orange arch (red outer), green cup (navy outer)
      drawDumbbell(xA, archYA, cupYA, 'orange', 'green');

      // Col B: green arch (navy outer), orange cup (red outer)
      drawDumbbell(xB, archYB, cupYB, 'green', 'orange');
    }
  }
}

// ================================================================
// DUMBBELL
//
//  archY ── [ top arch  ∩ ]  ← orange OR green variant
//           ══ top bar ══════  ← col-A: red ; col-B: navy
//           │   pole   │
//           ══ bot bar ══════  ← col-A: navy; col-B: red
//  cupY  ── [ bottom cup ∪ ]  ← green OR orange variant
// ================================================================
function drawDumbbell(cx, archY, cupY, topV, botV) {
  const POLE_W   = R * POLE_W_F;
  const POLE_EXT = R * POLE_EXT_F;
  const BAR_W    = R * BAR_W_F;
  const BAR_H    = R * BAR_H_F;
  const BAR_OFF  = R * BAR_OFF_F;

  let p = PALETTES[palIdx];
  noStroke();

  // 1 ── Vertical pole (drawn first, behind discs)
  fill(p.pole);
  let poleTop = archY - POLE_EXT;
  let poleBot = cupY  + POLE_EXT;
  rect(cx - POLE_W / 2, poleTop, POLE_W, poleBot - poleTop);

  // 2 ── Concentric half-discs
  drawHalfBullseye(cx, archY, true,  topV);   // arch  (∩)
  drawHalfBullseye(cx, cupY,  false, botV);   // cup   (∪)

  // 3 ── Horizontal bars (drawn over the disc flat edges)
  fill((topV === 'orange') ? p.oBar : p.gBar);
  rect(cx - BAR_W / 2, archY + BAR_OFF - BAR_H / 2, BAR_W, BAR_H);

  fill((botV === 'orange') ? p.oBar : p.gBar);
  rect(cx - BAR_W / 2, cupY - BAR_OFF - BAR_H / 2, BAR_W, BAR_H);
}

// ================================================================
// CONCENTRIC HALF-DISC (arch ∩ or cup ∪)
//
// isTop = true  → arc sweeps PI → TWO_PI (top half of circle → arch ∩)
// isTop = false → arc sweeps 0  → PI     (bottom half         → cup  ∪)
// PIE mode closes the wedge back to centre.
// ================================================================
function drawHalfBullseye(cx, cy, isTop, variant) {
  let startA = isTop ? PI : 0;
  let stopA  = isTop ? TWO_PI : PI;

  let p = PALETTES[palIdx];

  // orange variant: oA → oB → oC → bg
  // green  variant: gA → gB → gC → bg
  let cols = (variant === 'orange')
    ? [p.oA, p.oB, p.oC, p.bg]
    : [p.gA, p.gB, p.gC, p.bg];

  noStroke();
  for (let i = 0; i < 4; i++) {
    fill(cols[i]);
    let d = R * RING_F[i] * 2;
    arc(cx, cy, d, d, startA, stopA, PIE);
  }
}

// ── Controls ─────────────────────────────────────────────────────
function keyPressed() {
  if (key === 'S' || key === 's') saveCanvas('dumbbell_grid_' + PALETTES[palIdx].name, 'png');
  if (key === 'A' || key === 'a') {
    isAnimating = !isAnimating;
    if (isAnimating) loop();
    else noLoop();
  }
  if (key === 'C' || key === 'c') {
    const cap = P5Capture.getInstance();
    if (cap.state === 'idle') cap.start();
    else cap.stop();
  }
  if (key >= '1' && key <= '4') {
    palIdx = int(key) - 1;
  }
}

function windowResized() {
  // Canvas stays fixed at 1080×1080 — do not resize on window change
}
