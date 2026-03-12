// ================================================================
// DAY 2B: ADINKRA SYMBOL FIELD — OFFSET + GUTTER GRID
// ================================================================
// Same symbols as adinkra_symbol_field.js, but uses the inspo.js grid:
//   • offset  — wide proportional outer margin
//   • gutter  — inner spacing between every cell
//   • tinted cell backgrounds — make the grid structure visible
// ================================================================
// CONTROLS:
//   R     = new seed → new layout
//   S     = save PRINT-READY PNG (2400×2400px, 300 DPI @ 8×8in)
//   1-6   = switch between colour palettes instantly
// ================================================================

// ---------------------------------------------------------------
// PALETTES — 6 moods, switchable with keys 1-6
// ---------------------------------------------------------------

const PALETTES_2B = [
  // 0 — Classic: black ink on aged parchment (authentic adinkra)
  { bg: '#E8D5A3', ink: '#1A1008', accent: '#8B4513', name: 'Classic' },
  // 1 — Kente: gold symbols on deep black
  { bg: '#111111', ink: '#F5A204', accent: '#00A86B', name: 'Kente Night' },
  // 2 — Earth: mudcloth palette
  { bg: '#C19A6B', ink: '#2C1810', accent: '#8B0000', name: 'Mudcloth' },
  // 3 — Indigo: West African resist-dye cloth
  { bg: '#1B2A4A', ink: '#E8D5A3', accent: '#7EB8D4', name: 'Indigo' },
  // 4 — Contemporary: bold modern presentation
  { bg: '#F5F0DC', ink: '#1B6B3A', accent: '#F5A204', name: 'Contemporary' },
  // 5 — Bonus palette: vibrant and playful
  { bg: '#000000', ink: '#FCA311', accent: '#E5E5E5', name: 'Black & Gold Elegance' },
];

let palette2b;
let currentSeed2b;
let printScale2b = 3; // S key renders at 3× = 2400×2400px

// ---------------------------------------------------------------
// SETUP
// ---------------------------------------------------------------

function setup() {
  createCanvas(windowWidth, windowHeight);
  palette2b = PALETTES_2B[0];
  currentSeed2b = floor(random(99999));
  noLoop();
}

// ---------------------------------------------------------------
// DRAW
// ---------------------------------------------------------------

function draw() {
  randomSeed(currentSeed2b);

  background(palette2b.bg);
  drawTexture2b();      // Layer 1: subtle grain/texture
  drawSymbolField2b();  // Layer 2: the Adinkra symbols in an offset+gutter grid
  drawBorder2b();       // Layer 3: decorative border frame
  showInfo2b();         // Layer 4: seed + palette name
}

// ================================================================
// LAYER 1: TEXTURE
// ================================================================

function drawTexture2b() {
  for (let i = 0; i < 20; i++) {
    let x = random(width);
    let y = random(height);
    stroke(red(color(palette2b.ink)), green(color(palette2b.ink)), blue(color(palette2b.ink)), random(8, 22));
    strokeWeight(random(0.3, 0.9));
    point(x, y);
  }
}

// ================================================================
// LAYER 2: SYMBOL FIELD — offset + gutter grid (from inspo.js)
//
// offset = wide proportional outer margin (borrowed from inspo.js)
// gutter = inner spacing between every cell
//
// Cell size is derived so all cells + gutters + offsets sum to width.
// Each cell gets a faint tinted background so the grid reads clearly.
// ================================================================

function drawSymbolField2b() {
  let cells  = floor(random(4, 8));   // seed controls grid density
  let offset = width / 10;            // proportional outer margin (~80px)
  let gutter = offset / 4;            // inner gap between cells (~20px)

  // Cell dimensions: total space = offset*2 + cells*cw + gutters*(cells-1)
  let cw = (width  - offset * 2 - gutter * (cells - 1)) / cells;
  let ch = (height - offset * 2 - gutter * (cells - 1)) / cells;
  let symbolSize = min(cw, ch) * 0.62;

  let symbolFns = [
    drawDwennimmen2b,
    drawGyeNyame2b,
    drawSankofa2b,
    drawNyameDua2b,
    drawFawohodie2b,
    drawOware2b,
  ];

  for (let row = 0; row < cells; row++) {
    for (let col = 0; col < cells; col++) {
      // Top-left corner of this cell
      let x  = offset + col * (cw + gutter);
      let y  = offset + row * (ch + gutter);
      let cx = x + cw / 2;
      let cy = y + ch / 2;

      let fn       = random(symbolFns);
      let rotation = random(360);

      // Subtle tinted cell background — makes the grid structure visible
      noStroke();
      fill(palette2b.ink + '0D');  // ~5% opacity tint
      rect(x, y, cw, ch);

      // THE HOLY TRINITY — translate → rotate → draw
      push();
        translate(cx, cy);
        rotate(radians(rotation));
        fn(symbolSize, palette2b.ink, palette2b.accent);
      pop();
    }
  }
}

// ================================================================
// THE SYMBOLS
// (renamed with 2b suffix so this file can coexist with adinkra_symbol_field.js
//  if both are loaded in index.html at the same time)
// ================================================================

// ----------------------------------------------------------------
// DWENNIMMEN — Ram's Horns
// ----------------------------------------------------------------

function drawDwennimmen2b(s, ink, accent) {
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

// ----------------------------------------------------------------
// GYE NYAME — Except God / Supremacy of God
// ----------------------------------------------------------------

function drawGyeNyame2b(s, ink, accent) {
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

  fill(accent + 'AA');
  noStroke();
  ellipse(-hw * 1.6, 0, hw * 1.2, hw * 2.2);
  ellipse( hw * 1.6, 0, hw * 1.2, hw * 2.2);
  ellipse(0, -hw * 1.6, hw * 2.2, hw * 1.2);
  ellipse(0,  hw * 1.6, hw * 2.2, hw * 1.2);

  fill(accent);
  beginShape();
    vertex(0,        -hw * 0.8);
    vertex(hw * 0.8,  0);
    vertex(0,         hw * 0.8);
    vertex(-hw * 0.8, 0);
  endShape(CLOSE);
}

// ----------------------------------------------------------------
// SANKOFA — Return and Fetch It
// ----------------------------------------------------------------

function drawSankofa2b(s, ink, accent) {
  let r = s * 0.32;

  stroke(ink);
  strokeWeight(s * 0.055);
  noFill();

  arc(-r * 0.5, -r * 0.1, r * 1.1, r * 1.1, PI, TWO_PI);
  arc( r * 0.5, -r * 0.1, r * 1.1, r * 1.1, PI, TWO_PI);

  line(-r, -r * 0.1, 0, r * 0.7);
  line( r, -r * 0.1, 0, r * 0.7);

  noFill();
  arc(r * 0.3, -r * 0.7, r * 0.8, r * 0.8, 0, PI);

  fill(accent);
  noStroke();
  circle(0, -r * 1.2, r * 0.32);

  fill(palette2b.bg);
  circle(0, -r * 1.2, r * 0.12);
}

// ----------------------------------------------------------------
// NYAME DUA — Tree of God / God's Altar
// ----------------------------------------------------------------

function drawNyameDua2b(s, ink, accent) {
  let arm = s * 0.38;
  let cap = s * 0.13;

  stroke(ink);
  strokeWeight(s * 0.06);

  line(0, -arm, 0, arm);
  line(-arm, 0, arm, 0);

  fill(accent);
  noStroke();
  circle(0,    -arm, cap * 2);
  circle(0,     arm, cap * 2);
  circle(-arm,  0,   cap * 2);
  circle( arm,  0,   cap * 2);

  fill(ink);
  circle(0, 0, cap * 2.2);
}

// ----------------------------------------------------------------
// FAWOHODIE — Independence / Emancipation
// ----------------------------------------------------------------

function drawFawohodie2b(s, ink, accent) {
  let r  = s * 0.28;
  let sw = s * 0.06;

  stroke(ink);
  strokeWeight(sw);
  noFill();

  circle(0, -r * 0.5, r * 2);

  line(0, r * 0.5, 0, r * 1.6);
  line(0, r * 0.85, r * 0.4, r * 0.85);
  line(0, r * 1.2,  r * 0.3, r * 1.2);

  stroke(accent);
  strokeWeight(sw * 1.3);
  line(-r * 0.55, -r * 0.5, r * 0.55, -r * 0.5);

  fill(accent);
  noStroke();
  circle(0, -r * 0.5, sw * 2.5);
}

// ----------------------------------------------------------------
// OWARE — Game of Strategy
// ----------------------------------------------------------------

function drawOware2b(s, ink, accent) {
  let r = s * 0.28;

  stroke(ink);
  strokeWeight(s * 0.06);
  noFill();
  circle(-r * 0.5, 0, r * 2);
  circle( r * 0.5, 0, r * 2);

  fill(accent);
  noStroke();
  circle(0, 0, r * 0.3);
}

// ================================================================
// LAYER 3: BORDER
// ================================================================

function drawBorder2b() {
  let m = 18;
  noFill();
  stroke(palette2b.ink);
  strokeWeight(5);
  rect(m, m, width - m * 2, height - m * 2);
  strokeWeight(1);
  rect(m + 6, m + 6, width - (m + 6) * 2, height - (m + 6) * 2);
}

// ================================================================
// LAYER 4: INFO
// ================================================================

function showInfo2b() {
  fill(palette2b.ink + 'AA');
  noStroke();
  textSize(11);
  textAlign(LEFT, BOTTOM);
  text('seed: ' + currentSeed2b + '  |  palette: ' + palette2b.name + '  |  R=new  S=print-save  1-6=palette', 26, height - 24);
}

// ================================================================
// KEYBOARD CONTROLS
// ================================================================

function keyPressed() {
  if (key === 'r' || key === 'R') {
    currentSeed2b = floor(random(99999));
    redraw();
  }

  if (key === 's' || key === 'S') {
    let printSize = 800 * printScale2b;
    resizeCanvas(printSize, printSize);
    redraw();
    saveCanvas('adinkra_grid_' + palette2b.name.replace(/\s/g, '_') + '_seed' + currentSeed2b, 'png');
    resizeCanvas(800, 800);
    redraw();
  }

  if (key === '1') { palette2b = PALETTES_2B[0]; redraw(); }
  if (key === '2') { palette2b = PALETTES_2B[1]; redraw(); }
  if (key === '3') { palette2b = PALETTES_2B[2]; redraw(); }
  if (key === '4') { palette2b = PALETTES_2B[3]; redraw(); }
  if (key === '5') { palette2b = PALETTES_2B[4]; redraw(); }
  if (key === '6') { palette2b = PALETTES_2B[5]; redraw(); }
}
