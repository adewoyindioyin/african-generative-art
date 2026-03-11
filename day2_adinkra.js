// ================================================================
// DAY 2: ADINKRA SYMBOL FIELD
// ================================================================
// CONTROLS:
//   R     = new seed → new layout
//   S     = save PRINT-READY PNG (2400×2400px, 300 DPI @ 8×8in)
//   1-6   = switch between colour palettes instantly
// ================================================================
//
// WHAT YOU LEARN TODAY:
//   1. Drawing with beginShape / vertex / endShape — custom polygons
//   2. arc() — drawing partial circles (critical for African motifs)
//   3. Functions with parameters — each symbol is a reusable function
//   4. Layered drawing — background texture THEN symbols THEN overlay
//   5. Using rotation INSIDE push/pop — spinning individual elements
//   6. How to read a symbol and decompose it into geometric rules
//
// THE SYMBOLS WE BUILD:
//   dwennimmen  — ram's horns, humility + strength (concentric spiral arcs)
//   gye nyame   — supremacy of God (interlocking curved cross)
//   sankofa     — "go back and fetch it" (heart+bird base, circle above)
//   nyame dua   — altar of God (cross with circle caps)
//   fawohodie   — freedom & emancipation (key-like form)
// ================================================================

// ---------------------------------------------------------------
// PALETTES — 6 moods, switchable with keys 1-6
// ---------------------------------------------------------------

const PALETTES = [
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

let palette;
let currentSeed;
let printScale = 3;   // S key renders at 3× = 2400×2400px (300 DPI @ 8×8in)

// ---------------------------------------------------------------
// SETUP
// ---------------------------------------------------------------

function setup() {
  createCanvas(800, 800);
  palette = PALETTES[0];
  currentSeed = floor(random(99999));
  noLoop();
}

// ---------------------------------------------------------------
// DRAW
// ---------------------------------------------------------------

function draw() {
  randomSeed(currentSeed);

  background(palette.bg);
  drawTexture();       // Layer 1: subtle grain/texture
  drawSymbolField();   // Layer 2: the Adinkra symbols
  drawBorder();        // Layer 3: decorative border frame
  showInfo();          // Layer 4: seed + palette name
}

// ================================================================
// LAYER 1: TEXTURE
//
// Real adinkra cloth has texture — handwoven fabric, stamped ink.
// We simulate this with many semi-transparent dots/lines.
// This is a technique you'll use in almost every artwork.
// ================================================================

function drawTexture() {
  // Scattered fine grain
  for (let i = 0; i < 20; i++) {
    let x = random(width);
    let y = random(height);
    // random() here is seeded — same seed = same grain pattern
    stroke(red(color(palette.ink)), green(color(palette.ink)), blue(color(palette.ink)), random(8, 22));
    strokeWeight(random(0.3, 0.9));
    point(x, y);
  }
}

// ================================================================
// LAYER 2: SYMBOL FIELD
//
// We divide the canvas into a grid. Each cell gets one symbol.
// The seed controls: which symbol, its size, and its rotation.
// ================================================================

function drawSymbolField() {
  let margin = 50;
  let cols = floor(random(3, 8));  // seed controls grid density
  let rows = cols;                  // square grid always looks best

  let cellW = (width  - margin * 2) / cols;
  let cellH = (height - margin * 2) / rows;
  let symbolSize = min(cellW, cellH) * 0.62; // fits inside cell with breathing room

  // List of all available drawing functions
  // Adding a new symbol = adding one function + adding its name here
  let symbolFns = [
    drawDwennimmen,
    drawGyeNyame,
    drawSankofa,
    drawNyameDua,
    drawFawohodie,
    drawOware,
  ];

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      let cx = margin + col * cellW + cellW / 2;
      let cy = margin + row * cellH + cellH / 2;

      let fn       = random(symbolFns);              // seed picks the symbol
      let rotation = random(360);      // 0, 90, 180, or 270 degrees

      // THE HOLY TRINITY — now with rotation added
      push();
        translate(cx, cy);
        rotate(radians(rotation));
        fn(symbolSize, palette.ink, palette.accent); // draw symbol at (0,0)
      pop();

      // Optional: thin cell separator lines
      noFill();
      stroke(palette.ink + '22'); // hex colour + 2-digit alpha = semi-transparent
      strokeWeight(0.5);
      rect(-cellW / 2, -cellH / 2, cellW, cellH);
    }
  }
}

// ================================================================
// THE SYMBOLS — each is a self-contained function
//
// Parameters:
//   s      = size (the symbol fills roughly this diameter)
//   ink    = main drawing colour
//   accent = secondary / highlight colour
//
// All drawing happens at (0,0) — the centre of the symbol.
// push/translate in the field function already moved us there.
// ================================================================

// ----------------------------------------------------------------
// DWENNIMMEN — Ram's Horns
// Meaning: humility combined with strength
//
// Form: 4 spiral arcs arranged in rotational symmetry,
//       like ram horns curling inward from each corner.
// Technique: arc() — you specify the bounding box + start/end angle
// ----------------------------------------------------------------

function drawDwennimmen(s, ink, accent) {
  let r = s * 0.25;       // radius of each horn curl

  noFill();
  stroke(ink);
  strokeWeight(s * 0.06);

  // 4 horns at 90° intervals — loop replaces copy-pasting 4 times
  for (let i = 0; i < 4; i++) {
    push();
      rotate(radians(i * 90));         // each iteration rotates 90° more
      // Outer arc — the main horn curve
      arc(r, r, r * 2, r * 2, PI, TWO_PI + HALF_PI);
      // Inner arc — inner edge of the horn (slightly smaller)
      arc(r, r, r * 0.9, r * 0.9, PI, TWO_PI + HALF_PI);
    pop();
  }

  // Centre dot — the "eye" connecting all horns
  fill(accent);
  noStroke();
  circle(0, 0, s * 0.12);
}

// ----------------------------------------------------------------
// GYE NYAME — Except God / Supremacy of God
// Meaning: the omnipotence and omnipresence of God
// Most popular Adinkra symbol in the world.
//
// Form: a cross-like shape with curved extensions at each end,
//       and oval lobes on the sides. Built from ellipses + arcs.
// ----------------------------------------------------------------

function drawGyeNyame(s, ink, accent) {
  let hw = s * 0.18;  // half-width of cross bar
  let hl = s * 0.45;  // half-length of cross bar

  stroke(ink);
  strokeWeight(s * 0.055);
  noFill();

  // Vertical bar
  line(0, -hl, 0, hl);
  // Horizontal bar
  line(-hl, 0, hl, 0);

  // Four petal extensions at each end — convex arcs outward
  for (let i = 0; i < 4; i++) {
    push();
      rotate(radians(i * 90));
      // Each petal is an arc at the tip of the cross arm
      arc(0, -hl, hw * 2.5, hw * 2.5, PI, TWO_PI); // top petal
    pop();
  }

  // Oval lobes flanking the centre (distinctive Gye Nyame feature)
  fill(accent + 'AA');
  noStroke();
  ellipse(-hw * 1.6, 0, hw * 1.2, hw * 2.2);
  ellipse( hw * 1.6, 0, hw * 1.2, hw * 2.2);
  ellipse(0, -hw * 1.6, hw * 2.2, hw * 1.2);
  ellipse(0,  hw * 1.6, hw * 2.2, hw * 1.2);

  // Centre diamond accent
  fill(accent);
  beginShape();
    vertex(0,       -hw * 0.8);
    vertex(hw * 0.8, 0);
    vertex(0,        hw * 0.8);
    vertex(-hw * 0.8, 0);
  endShape(CLOSE);
}

// ----------------------------------------------------------------
// SANKOFA — Return and Fetch It
// Meaning: learn from the past; it is not wrong to go back
//
// Form: a heart-like base (the bird's body looking backward),
//       a small circle above (the egg the bird holds — wisdom),
//       and a curved neck.
// ----------------------------------------------------------------

function drawSankofa(s, ink, accent) {
  let r = s * 0.32;

  stroke(ink);
  strokeWeight(s * 0.055);
  noFill();

  // Body — two arcs forming the heart base
  // Left lobe
  arc(-r * 0.5, -r * 0.1, r * 1.1, r * 1.1, PI, TWO_PI);
  // Right lobe
  arc( r * 0.5, -r * 0.1, r * 1.1, r * 1.1, PI, TWO_PI);

  // Converging lines to bottom point (base of heart = tail of bird)
  line(-r, -r * 0.1, 0, r * 0.7);
  line( r, -r * 0.1, 0, r * 0.7);

  // Neck curve — the S-bend of the Sankofa bird's backward-looking neck
  noFill();
  arc(r * 0.3, -r * 0.7, r * 0.8, r * 0.8, 0, PI); // neck arc

  // Egg/circle at top — the fetched wisdom
  fill(accent);
  noStroke();
  circle(0, -r * 1.2, r * 0.32);

  // Eye of the bird
  fill(palette.bg);
  circle(0, -r * 1.2, r * 0.12);
}

// ----------------------------------------------------------------
// NYAME DUA — Tree of God / God's Altar
// Meaning: the presence and protection of God
//
// Form: a plus/cross with circle caps at the ends of each arm.
// Clean, architectural — the easiest symbol to read at small sizes.
// ----------------------------------------------------------------

function drawNyameDua(s, ink, accent) {
  let arm = s * 0.38;   // how long each arm extends from centre
  let cap = s * 0.13;   // radius of the circle at each arm tip

  stroke(ink);
  strokeWeight(s * 0.06);

  // Cross arms
  line(0, -arm, 0, arm);  // vertical
  line(-arm, 0, arm, 0);  // horizontal

  // Circle cap at each of the 4 arm tips
  fill(accent);
  noStroke();
  circle(0,    -arm, cap * 2);
  circle(0,     arm, cap * 2);
  circle(-arm,  0,   cap * 2);
  circle( arm,  0,   cap * 2);

  // Centre circle
  fill(ink);
  circle(0, 0, cap * 2.2);
}

// ----------------------------------------------------------------
// FAWOHODIE — Independence / Emancipation
// Meaning: freedom, independence, emancipation
//
// Form: looks like a key or a padlock opened.
//       A circle with crossed bars, and a stem below.
// ----------------------------------------------------------------

function drawFawohodie(s, ink, accent) {
  let r  = s * 0.28;  // ring radius
  let sw = s * 0.06;  // stroke weight

  stroke(ink);
  strokeWeight(sw);
  noFill();

  // The ring (top of the key)
  circle(0, -r * 0.5, r * 2);

  // Vertical stem going down
  line(0, r * 0.5, 0, r * 1.6);

  // Key teeth (horizontal bars on the stem)
  line(0, r * 0.85, r * 0.4, r * 0.85);
  line(0, r * 1.2,  r * 0.3, r * 1.2);

  // Crossbar inside the ring (the shackle bar)
  stroke(accent);
  strokeWeight(sw * 1.3);
  line(-r * 0.55, -r * 0.5, r * 0.55, -r * 0.5);

  // Centre point of the ring
  fill(accent);
  noStroke();
  circle(0, -r * 0.5, sw * 2.5);
}

// ================================================================
function drawOware(s, ink, accent) {
  let r = s * 0.28; // radius of the main circle 

  stroke(ink);
  strokeWeight(s * 0.06);
  noFill();
  circle(-r * 0.5, 0, r * 2);   // left circle
  circle( r * 0.5, 0, r * 2);   // right circle

  fill(accent);
  noStroke();
  circle(0, 0, r * 0.3); // center dot where they overlap
}

// ================================================================
// LAYER 3: BORDER
// ================================================================

function drawBorder() {
  let m = 18;
  noFill();
  stroke(palette.ink);
  strokeWeight(5);
  rect(m, m, width - m * 2, height - m * 2);
  strokeWeight(1);
  rect(m + 6, m + 6, width - (m + 6) * 2, height - (m + 6) * 2);
}

// ================================================================
// LAYER 4: INFO
// ================================================================

function showInfo() {
  fill(palette.ink + 'AA');
  noStroke();
  textSize(11);
  textAlign(LEFT, BOTTOM);
  text('seed: ' + currentSeed + '  |  palette: ' + palette.name + '  |  R=new  S=print-save  1-6=palette', 26, height - 24);
}

// ================================================================
// KEYBOARD CONTROLS
// ================================================================

function keyPressed() {
  if (key === 'r' || key === 'R') {
    currentSeed = floor(random(99999));
    redraw();
  }

  // PRINT SAVE — temporarily resize to 2400×2400, render, save, restore
  if (key === 's' || key === 'S') {
    let printSize = 800 * printScale;
    resizeCanvas(printSize, printSize);
    redraw();
    saveCanvas('adinkra_' + palette.name.replace(/\s/g, '_') + '_seed' + currentSeed, 'png');
    resizeCanvas(800, 800);
    redraw();
  }

  // Switch palettes with number keys
  if (key === '1') { palette = PALETTES[0]; redraw(); }
  if (key === '2') { palette = PALETTES[1]; redraw(); }
  if (key === '3') { palette = PALETTES[2]; redraw(); }
  if (key === '4') { palette = PALETTES[3]; redraw(); }
  if (key === '5') { palette = PALETTES[4]; redraw(); }
  if (key === '6') { palette = PALETTES[5]; redraw(); }
}
