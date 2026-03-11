// ================================================================
// DAY 6: ORÍ — A SELL-READY GENERATIVE PRINT
// ================================================================
// "Orí" means personal spiritual intuition / inner head in Yoruba.
// Every output of this piece is unique — a different Orí.
//
// This is your first complete, sellable artwork.
// It combines everything from Days 1–5 into one cohesive piece:
//
//   • Adinkra symbols        (Day 2) — identity, meaning
//   • Perlin noise texture   (Day 3) — organic depth
//   • Rose curve / geometry  (Day 5) — sacred form
//   • Layered composition    (all days) — foreground / mid / background
//   • Seeded randomness      (Day 1) — every piece reproducible + unique
//
// OUTPUT: 800×800px on screen — press S for a 2400×2400 print file.
//
// CONTROLS:
//   R      = new seed → new unique piece
//   S      = save PRINT-READY PNG (2400×2400, named with seed)
//   1-5    = switch collection palette
//   SPACE  = toggle artist signature
// ================================================================

// ================================================================
// COLLECTIONS — each is a named palette series you can sell as a set
// ================================================================

const COLLECTIONS = [
  {
    series:   'Ọṣun Gilded',
    bg:       '#0C0800',
    deep:     '#1A1000',
    gold:     '#F5A204',
    light:    '#FFF0A0',
    accent:   '#8B4513',
    ink:      '#E8D5A3',
  },
  {
    series:   'Indigo Ancestors',
    bg:       '#020510',
    deep:     '#060A1A',
    gold:     '#7EB8D4',
    light:    '#E8D5A3',
    accent:   '#1B2A4A',
    ink:      '#C8E0F0',
  },
  {
    series:   'Sacred Grove',
    bg:       '#010801',
    deep:     '#021002',
    gold:     '#69F0AE',
    light:    '#CCFF90',
    accent:   '#1B4A1B',
    ink:      '#B9F6CA',
  },
  {
    series:   'Crimson Covenant',
    bg:       '#0A0101',
    deep:     '#160202',
    gold:     '#FF6D00',
    light:    '#FFD740',
    accent:   '#7B0000',
    ink:      '#FFCCBC',
  },
  {
    series:   'Moonrise Mudcloth',
    bg:       '#0A0805',
    deep:     '#1A140A',
    gold:     '#E8D5A3',
    light:    '#FFFFFF',
    accent:   '#5C4A2A',
    ink:      '#F5F0DC',
  },
];

let col = 0;  // active collection index

// ================================================================
// GLOBAL STATE
// ================================================================

let seed = 42;
let showSig = true;
let printScale = 3;     // S key renders at 3× = 2400×2400px
let W = 800;            // canvas size (screen)

// ================================================================
// SEEDED PARAMETERS
// These are computed from the seed — same seed = same artwork.
// ================================================================

let roseK, roseLayers, roseOffset, roseRadius;
let noiseOctave, noiseThreshold;
let symbolGrid;   // which Adinkra symbols appear where
let bgNoiseSeed;

// ================================================================
// SETUP
// ================================================================

function setup() {
  createCanvas(W, W);
  noLoop();         // static artwork — redraws only when R is pressed
  computeFromSeed();
}

// ================================================================
// COMPUTE PARAMETERS FROM SEED
// All randomness flows through one seed — reproducible forever.
// ================================================================

function computeFromSeed() {
  randomSeed(seed);
  noiseSeed(seed);

  // Rose parameters
  roseK       = random([3, 4, 5, 6, 7, 8, 3/2, 5/3, 7/4]);
  roseLayers  = floor(random(5, 11));
  roseOffset  = random(0.04, 0.28);
  roseRadius  = random(0.28, 0.40);   // as fraction of W

  // Noise parameters
  noiseOctave    = random(0.004, 0.012);
  noiseThreshold = random(0.48, 0.58);
  bgNoiseSeed    = floor(random(9999));

  // Symbol grid: 3×3 or 4×4 placement of Adinkra accents
  symbolGrid = [];
  let gridN = random() > 0.5 ? 3 : 4;
  for (let r = 0; r < gridN; r++) {
    for (let c = 0; c < gridN; c++) {
      symbolGrid.push({
        row: r, col: c, gridN,
        fn:  random([drawDwennimmen, drawGyeNyame, drawNyameDua, drawSankofa]),
        sz:  random(38, 62),
        rot: floor(random(4)) * 90,
        alpha: random(18, 55),
      });
    }
  }
}

// ================================================================
// DRAW — the full composition in layers
// ================================================================

function draw() {
  let C = COLLECTIONS[col];

  // ── LAYER 0: solid background ──────────────────────────────────
  background(C.bg);

  // ── LAYER 1: noise texture (the "woven cloth" ground) ──────────
  drawNoiseGround(C);

  // ── LAYER 2: Adinkra symbol grid (faint, background presence) ──
  drawSymbolLayer(C);

  // ── LAYER 3: sacred rose geometry (the focal form) ─────────────
  push();
    translate(W / 2, W / 2);
    drawRoseForm(C);
    drawCentreOrb(C);
  pop();

  // ── LAYER 4: vignette (darkens edges, focuses the eye) ─────────
  drawVignette(C);

  // ── LAYER 5: border ────────────────────────────────────────────
  drawBorder(C);

  // ── LAYER 6: signature / edition info ─────────────────────────
  if (showSig) drawSignature(C);
}

// ================================================================
// LAYER 1: NOISE GROUND
// Simulates the woven cloth texture beneath everything else.
// ================================================================

function drawNoiseGround(C) {
  noiseSeed(bgNoiseSeed);
  let cell = 6;
  noStroke();

  for (let x = 0; x < W; x += cell) {
    for (let y = 0; y < W; y += cell) {
      let n = noise(x * noiseOctave, y * noiseOctave);
      if (n > noiseThreshold) {
        let a = map(n, noiseThreshold, 1, 0, 38);
        fill(red(color(C.gold)), green(color(C.gold)), blue(color(C.gold)), a);
        rect(x, y, cell, cell);
      }
    }
  }

  // restore main seed for subsequent layers
  randomSeed(seed);
}

// ================================================================
// LAYER 2: ADINKRA SYMBOL GRID
// Ghostly symbols behind the main form — cultural grounding.
// ================================================================

function drawSymbolLayer(C) {
  let margin = W * 0.08;
  let usable = W - margin * 2;

  for (let s of symbolGrid) {
    let x = margin + (s.col + 0.5) * (usable / s.gridN);
    let y = margin + (s.row + 0.5) * (usable / s.gridN);

    push();
      translate(x, y);
      rotate(radians(s.rot));
      let inkCol = color(C.ink);
      inkCol.setAlpha(s.alpha);
      s.fn(s.sz, inkCol, color(C.accent + '20'));
    pop();
  }
}

// ================================================================
// LAYER 3: ROSE FORM (drawn at canvas centre via push/translate)
// ================================================================

function drawRoseForm(C) {
  let R = W * roseRadius;
  let totalAngle = PI * 2 * max(roseK, 10);
  let steps = 1000;
  let step = totalAngle / steps;

  for (let layer = 0; layer < roseLayers; layer++) {
    let rotation = layer * roseOffset;
    let radius   = R * pow(0.93, layer);
    let alpha    = map(layer, 0, roseLayers - 1, 190, 35);
    let colIdx   = layer % 3;
    let strokeCol = colIdx === 0 ? C.gold : colIdx === 1 ? C.light : C.ink;

    let sc = color(strokeCol);
    sc.setAlpha(alpha);

    // Filled petals — very subtle inner glow
    let fc = color(strokeCol);
    fc.setAlpha(alpha * 0.12);
    fill(fc);
    stroke(sc);
    strokeWeight(1.0);

    push();
      rotate(rotation);
      beginShape();
      for (let theta = 0; theta <= totalAngle; theta += step) {
        let r = radius * cos(roseK * theta);
        vertex(r * cos(theta), r * sin(theta));
      }
      endShape(CLOSE);
    pop();
  }
}

// ================================================================
// CENTRE ORB
// ================================================================

function drawCentreOrb(C) {
  noStroke();
  for (let i = 8; i > 0; i--) {
    let gc = color(C.gold);
    gc.setAlpha(i * 8);
    fill(gc);
    ellipse(0, 0, i * 14, i * 14);
  }
  fill(C.light);
  ellipse(0, 0, 10, 10);
}

// ================================================================
// LAYER 4: VIGNETTE
// Radial gradient — dark edges pull focus to centre.
// ================================================================

function drawVignette(C) {
  noStroke();
  let steps = 80;
  for (let i = steps; i > 0; i--) {
    let r = (W * 0.82) * (i / steps);
    let a = map(i, 0, steps, 90, 0);
    let vc = color(C.bg);
    vc.setAlpha(a);
    fill(vc);
    ellipse(W / 2, W / 2, r, r);
  }
}

// ================================================================
// LAYER 5: BORDER — clean frame for print presentation
// ================================================================

function drawBorder(C) {
  noFill();
  stroke(C.gold + '55');
  strokeWeight(1);
  let m = 14;
  rect(m, m, W - m * 2, W - m * 2);
  stroke(C.gold + '28');
  rect(m + 5, m + 5, W - (m + 5) * 2, W - (m + 5) * 2);
}

// ================================================================
// LAYER 6: SIGNATURE
// Appears in the print — establishes you as the artist.
// ================================================================

function drawSignature(C) {
  let tc = color(C.ink);
  tc.setAlpha(90);
  fill(tc);
  noStroke();
  textSize(10);

  // Bottom left — series name + seed (edition identifier)
  textAlign(LEFT, BOTTOM);
  text('ORÍ  |  ' + COLLECTIONS[col].series + '  |  #' + seed, 22, W - 18);

  // Bottom right — your name (change this to your name!)
  textAlign(RIGHT, BOTTOM);
  text('adewoyindioyin', W - 22, W - 18);
}

// ================================================================
// ================================================================
// ADINKRA SYMBOL FUNCTIONS
// Same as Day 2 — reused here as cultural layer.
// ================================================================
// ================================================================

function drawDwennimmen(s, ink, accent) {
  let r = s * 0.25;
  noFill();
  stroke(ink);
  strokeWeight(s * 0.06);
  for (let i = 0; i < 4; i++) {
    push();
      rotate(radians(i * 90));
      arc(r, r, r * 2, r * 2, PI, TWO_PI + HALF_PI);
      arc(r, r, r * 0.9, r * 0.9, PI, TWO_PI + HALF_PI);
    pop();
  }
  fill(accent);
  noStroke();
  circle(0, 0, s * 0.12);
}

function drawGyeNyame(s, ink, accent) {
  let hw = s * 0.18;
  let hl = s * 0.45;
  stroke(ink);
  strokeWeight(s * 0.055);
  noFill();
  line(0, -hl, 0, hl);
  line(-hl, 0, hl, 0);
  for (let i = 0; i < 4; i++) {
    push();
      rotate(radians(i * 90));
      arc(0, -hl, hw * 2.5, hw * 2.5, PI, TWO_PI);
    pop();
  }
  fill(accent);
  noStroke();
  ellipse(-hw * 1.6, 0, hw * 1.2, hw * 2.2);
  ellipse( hw * 1.6, 0, hw * 1.2, hw * 2.2);
  ellipse(0, -hw * 1.6, hw * 2.2, hw * 1.2);
  ellipse(0,  hw * 1.6, hw * 2.2, hw * 1.2);
}

function drawNyameDua(s, ink, accent) {
  let arm = s * 0.38;
  let cap = s * 0.13;
  stroke(ink);
  strokeWeight(s * 0.06);
  line(0, -arm, 0, arm);
  line(-arm, 0, arm, 0);
  fill(accent);
  noStroke();
  circle(0, -arm, cap * 2);
  circle(0,  arm, cap * 2);
  circle(-arm, 0, cap * 2);
  circle( arm, 0, cap * 2);
  fill(ink);
  circle(0, 0, cap * 2.2);
}

function drawSankofa(s, ink, accent) {
  let r = s * 0.32;
  stroke(ink);
  strokeWeight(s * 0.055);
  noFill();
  arc(-r * 0.5, -r * 0.1, r * 1.1, r * 1.1, PI, TWO_PI);
  arc( r * 0.5, -r * 0.1, r * 1.1, r * 1.1, PI, TWO_PI);
  line(-r, -r * 0.1, 0, r * 0.7);
  line( r, -r * 0.1, 0, r * 0.7);
  arc(r * 0.3, -r * 0.7, r * 0.8, r * 0.8, 0, PI);
  fill(accent);
  noStroke();
  circle(0, -r * 1.2, r * 0.32);
}

// ================================================================
// KEYBOARD CONTROLS
// ================================================================

function keyPressed() {
  if (key === 'r' || key === 'R') {
    seed = floor(random(99999));
    computeFromSeed();
    redraw();
  }

  // PRINT SAVE — renders 3× larger for print quality
  if (key === 's' || key === 'S') {
    // Temporarily resize canvas to print dimensions, draw, save, restore
    let printW = W * printScale;
    resizeCanvas(printW, printW);
    W = printW;
    computeFromSeed();   // recompute with new W
    redraw();
    saveCanvas('ori_' + COLLECTIONS[col].series.replace(/\s/g, '_') + '_seed' + seed, 'png');
    // Restore screen size
    W = 800;
    resizeCanvas(W, W);
    computeFromSeed();
    redraw();
  }

  if (key === ' ') { showSig = !showSig; redraw(); return false; }

  if (key === '1') { col = 0; redraw(); }
  if (key === '2') { col = 1; redraw(); }
  if (key === '3') { col = 2; redraw(); }
  if (key === '4') { col = 3; redraw(); }
  if (key === '5') { col = 4; redraw(); }
}
