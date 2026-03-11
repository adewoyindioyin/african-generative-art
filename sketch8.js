// ================================================================
// SKETCH 8 — ÌBEJÌ  (Twins / Duality)
// ================================================================
// Ìbejì are the Orisha of twins in Yoruba tradition — symbols of
// duality, balance, and the sacred bond between two halves.
//
// The dumbbell motif — two rainbow-ringed semicircles joined by a
// pole — is the perfect visual twin: two halves, two colour
// families, one body.
//
// We arrange it in concentric radial rings to form a generative
// mandala, mixing techniques from the whole course:
//
//   • Radial placement via polar maths      (Day 2 / Day 5)
//   • push() / pop() for local transforms   (Day 2)
//   • Perlin noise for organic wobble       (Day 3)
//   • Seeded randomness for unique outputs  (Day 1 / Day 6)
//   • Multiple named palettes              (Day 6)
//
// CONTROLS
//   R          →  new seed  (new unique piece)
//   S          →  save PNG
//   1 2 3 4    →  switch colour palette
//   SPACE      →  toggle slow rotation
// ================================================================

// ── Colour palettes ───────────────────────────────────────────────
const PALETTES = [
  {
    name: 'Ọjọ',        // Day — lifted straight from the original SVG
    bg:   '#fee9e2',
    outA: '#363d60', midA: '#668b75', topA: '#faa862',
    outB: '#d7623e', midB: '#f37650', topB: '#faa862',
    pole: '#363d60',
  },
  {
    name: 'Alẹ',        // Night
    bg:   '#0d1117',
    outA: '#1a2a6c', midA: '#b21f1f', topA: '#fdbb2d',
    outB: '#4a1060', midB: '#a8325a', topB: '#ffd090',
    pole: '#c89640',
  },
  {
    name: 'Igbó',       // Forest
    bg:   '#f8f4ec',
    outA: '#2c5530', midA: '#5e9c50', topA: '#b8d868',
    outB: '#7a3510', midB: '#c06020', topB: '#f0b830',
    pole: '#2c5530',
  },
  {
    name: 'Okun',       // Ocean
    bg:   '#060e1c',
    outA: '#0a3060', midA: '#1a70b0', topA: '#60c0e0',
    outB: '#180a40', midB: '#3020a0', topB: '#8090d8',
    pole: '#1a70b0',
  },
];

// ── Ring layout ───────────────────────────────────────────────────
// Each entry: { n, distF, sizeF }
//   n      = number of dumbbells in this ring
//   distF  = distance from canvas centre  (× baseR)
//   sizeF  = radius of each bullseye head (× baseR)
const RINGS = [
  { n:  6, distF:  2.2, sizeF: 0.55 },
  { n: 10, distF:  4.2, sizeF: 0.60 },
  { n: 14, distF:  6.4, sizeF: 0.65 },
  { n: 19, distF:  8.8, sizeF: 0.70 },
  { n: 25, distF: 11.5, sizeF: 0.75 },
];

// ── State ─────────────────────────────────────────────────────────
let seed     = 2281;
let palIdx   = 0;
let rot      = 0;
let spinning = false;

// ─────────────────────────────────────────────────────────────────
function setup() {
  createCanvas(windowWidth, windowHeight);
  angleMode(RADIANS);
  noLoop();
}

function draw() {
  let p  = PALETTES[palIdx];
  let bR = baseR();

  background(p.bg);
  translate(width / 2, height / 2);

  if (spinning) rot += 0.003;
  rotate(rot);

  // Re-seed every frame so ring phases stay consistent
  randomSeed(seed);
  noiseSeed(seed);

  // Draw rings outermost-first so inner ones paint on top
  for (let ri = RINGS.length - 1; ri >= 0; ri--) {
    let { n, distF, sizeF } = RINGS[ri];
    let dist  = bR * distF;
    let headR = bR * sizeF;
    let phase = random(TWO_PI);     // unique angular phase per ring (seeded)

    for (let i = 0; i < n; i++) {
      let theta  = (TWO_PI / n) * i + phase;

      // Perlin noise gives each dumbbell a subtle orientation wobble (Day 3)
      let wobble = (noise(ri * 3.7, i * 0.85) - 0.5) * 0.15;

      // HALF_PI turns the vertical pole to face radially outward
      let orient = theta + HALF_PI + wobble;

      let x    = dist * cos(theta);
      let y    = dist * sin(theta);

      // Checkerboard colour alternation by ring + position parity
      let flip = (ri % 2 === 0) ? (i % 2 === 0) : (i % 2 !== 0);

      drawDumbbell(x, y, headR, orient, p, flip);
    }
  }

  // Central medallion — full concentric bullseye
  medallion(bR * 1.4, p);
}

// ── baseR: keeps outermost ring inside the canvas ─────────────────
function baseR() {
  let last    = RINGS[RINGS.length - 1];
  let maxFrac = last.distF + last.sizeF * 2.2;
  return (min(width, height) * 0.5) / maxFrac;
}

// ── Single dumbbell ───────────────────────────────────────────────
// cx, cy  — world position of the dumbbell's midpoint
// r       — head radius
// angle   — orientation (top head points this way = radially outward)
// p       — active palette
// flip    — swap which head gets which colour family
function drawDumbbell(cx, cy, r, angle, p, flip) {
  let gap   = r * 0.65;   // centre → each arc centre
  let poleW = r * 0.22;

  push();
  translate(cx, cy);
  rotate(angle);
  noStroke();

  // Pole — drawn first so it sits behind both heads
  fill(p.pole);
  rect(-poleW / 2, -gap, poleW, gap * 2, poleW * 0.4);

  // Two bullseye half-discs
  if (flip) {
    drawHead(0, -gap, r, p, 'B', PI, 0);    // B family → outer (top in local)
    drawHead(0,  gap, r, p, 'A', 0, PI);    // A family → inner (bottom in local)
  } else {
    drawHead(0, -gap, r, p, 'A', PI, 0);    // A family → outer
    drawHead(0,  gap, r, p, 'B', 0, PI);    // B family → inner
  }

  pop();
}

// ── Bullseye half-disc ─────────────────────────────────────────────
// Four concentric arcs painted largest → smallest so each ring
// covers the centre of the one before it — classic bullseye effect.
//
//   arc(cx, cy, d, d, PI,  0, PIE)  → upper dome (faces away from centre)
//   arc(cx, cy, d, d,  0, PI, PIE)  → lower dome (faces away from centre)
function drawHead(cx, cy, r, p, family, startA, stopA) {
  let bg = PALETTES[palIdx].bg;
  let c1 = family === 'A' ? p.outA : p.outB;
  let c2 = family === 'A' ? p.midA : p.midB;
  let c3 = family === 'A' ? p.topA : p.topB;

  noStroke();
  [
    { rf: 1.00, c: c1 },
    { rf: 0.73, c: c2 },
    { rf: 0.47, c: c3 },
    { rf: 0.24, c: bg  },
  ].forEach(({ rf, c }) => {
    fill(c);
    arc(cx, cy, rf * r * 2, rf * r * 2, startA, stopA, PIE);
  });
}

// ── Central medallion: full concentric rings ──────────────────────
function medallion(r, p) {
  noStroke();
  [
    { rf: 1.00, c: p.outA },
    { rf: 0.82, c: p.outB },
    { rf: 0.64, c: p.midA },
    { rf: 0.48, c: p.midB },
    { rf: 0.33, c: p.topA },
    { rf: 0.20, c: p.topB },
    { rf: 0.10, c: p.bg   },
  ].forEach(({ rf, c }) => {
    fill(c);
    circle(0, 0, rf * r * 2);
  });
}

// ── Controls ──────────────────────────────────────────────────────
function keyPressed() {
  if (key === 'R' || key === 'r') {
    seed = floor(Math.random() * 99998) + 1;
    if (!spinning) redraw();
  }
  if (key === 'S' || key === 's') {
    saveCanvas('ibeji_' + PALETTES[palIdx].name + '_' + seed, 'png');
  }
  if (key === ' ') {
    spinning = !spinning;
    spinning ? loop() : noLoop();
  }
  if (key >= '1' && key <= '4') {
    palIdx = int(key) - 1;
    if (!spinning) redraw();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  if (!spinning) redraw();
}
