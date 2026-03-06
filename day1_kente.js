// ================================================================
// DAY 1: KENTE CLOTH — Your First African Generative Artwork
// ================================================================
// CONTROLS:
//   S  = save a PNG of your artwork
//   R  = regenerate a new variation
// ================================================================
//
// WHAT YOU WILL UNDERSTAND BY THE END OF THIS FILE:
//   1. Color palettes stored as arrays — the foundation of all your art
//   2. Grid systems using for loops — how every pattern-based art works
//   3. push() + translate() + pop() — THE most important p5.js concept
//   4. noLoop() — what makes a piece static (use for prints/NFTs)
//   5. Drawing shapes at LOCAL coordinates (relative to a cell, not the whole canvas)
//
// ================================================================

// ---------------------------------------------------------------
// SECTION 1: COLOR PALETTE
//
// Instead of writing colors directly inside drawing functions,
// we store them as named constants at the top.
// This is how you stay in control when making variations.
// ---------------------------------------------------------------

const KENTE_GOLD   = '#F5A204'; // The signature color of Asante kente
const KENTE_RED    = '#C0392B'; // Prestige, political power
const KENTE_GREEN  = '#1B6B3A'; // Growth, renewal, the land
const KENTE_BLACK  = '#111111'; // Maturity, intensified spiritual energy
const KENTE_BLUE   = '#1A3A8F'; // Harmony, love, serenity
const KENTE_WHITE  = '#F5F0DC'; // Festivity, victory
const KENTE_ORANGE = '#D4580A'; // Warmth, earth

// Each strip in the cloth gets a pair of contrasting colors.
// Change these pairings to create completely different moods.
const STRIP_PALETTES = [
  [KENTE_GOLD,   KENTE_RED],
  [KENTE_GREEN,  KENTE_GOLD],
  [KENTE_BLACK,  KENTE_GOLD],
  [KENTE_BLUE,   KENTE_WHITE],
  [KENTE_RED,    KENTE_BLACK],
  [KENTE_GOLD,   KENTE_GREEN],
  [KENTE_ORANGE, KENTE_BLACK],
  [KENTE_WHITE,  KENTE_BLUE],
  [KENTE_GREEN,  KENTE_RED],
  [KENTE_GOLD,   KENTE_BLACK],
];

// ---------------------------------------------------------------
// SECTION 2: COMPOSITION SETTINGS
//
// Change these two numbers to get completely different results.
//   - More strips → more narrow, more complex
//   - More cells  → more elongated, more fabric-like
// Try: NUM_STRIPS = 6, NUM_CELLS = 8  → bold and simple
// Try: NUM_STRIPS = 14, NUM_CELLS = 16 → intricate and dense
// ---------------------------------------------------------------

let NUM_STRIPS = 6; // number of vertical strips
let NUM_CELLS  = 8; // number of pattern units per strip (vertically)


// ================================================================
// SETUP — runs once at the start
// ================================================================

function setup() {
  createCanvas(800, 800);
  noLoop(); // draw once and stop — this is how you make static art
}


// ================================================================
// DRAW — called by p5.js after setup
// ================================================================

function draw() {
  background(KENTE_BLACK);
  drawKente();
}


// ================================================================
// MAIN COMPOSITION FUNCTION
// ================================================================

function drawKente() {
  let margin = 30;
  let totalW  = width  - margin * 2;
  let totalH  = height - margin * 2;
  let sW = totalW / NUM_STRIPS; // width of each strip
  let cH = totalH / NUM_CELLS;  // height of each cell unit

  // --- DRAW ALL STRIPS ---
  for (let s = 0; s < NUM_STRIPS; s++) {
    let x = margin + s * sW;

    // Each strip gets its own color pair and motif type
    let [c1, c2] = STRIP_PALETTES[s % STRIP_PALETTES.length];
    let motif = s % 4; // cycles through 4 motif types (0, 1, 2, 3)

    // --- DRAW ALL CELLS WITHIN THIS STRIP ---
    for (let c = 0; c < NUM_CELLS; c++) {
      let y = margin + c * cH;

      // THE HOLY TRINITY: push → translate → draw → pop
      //
      // push()          — saves the current state of the canvas
      // translate(x, y) — moves the origin (0,0) to the top-left of THIS cell
      // drawCell(...)   — now we draw as if (0,0) is the cell corner
      // pop()           — restores the canvas state, undoes the translate
      //
      // WHY: without this pattern, every shape would need x+offsetX, y+offsetY
      // calculations everywhere. With it, drawCell always works from (0,0).

      push();
        translate(x, y);
        drawCell(sW, cH, motif, c1, c2, c);
      pop();
    }
  }

  // --- DECORATIVE DIVIDER LINES ---
  // Thin gold lines between strips simulate the seams of real kente weaving
  stroke(KENTE_GOLD);
  strokeWeight(0.02);
  for (let s = 1; s < NUM_STRIPS; s++) {
    let x = margin + s * sW;
    line(x, margin, x, height - margin);
  }

  // --- OUTER FRAME (double-line border typical in kente presentation) ---
  noFill();
  stroke(KENTE_GOLD);
  strokeWeight(4);
  rect(margin - 1, margin - 1, totalW + 2, totalH + 2);
  strokeWeight(1);
  rect(margin - 8, margin - 8, totalW + 16, totalH + 16);
}


// ================================================================
// drawCell — THE BUILDING BLOCK OF THE ARTWORK
//
// This function draws ONE unit of pattern.
// Parameters:
//   w, h        — width and height of this cell
//   motif       — which pattern type to draw (0, 1, 2, or 3)
//   c1, c2      — the two colors for this strip
//   cellIndex   — which row we're in (used for alternation)
//
// KEY INSIGHT: x=0, y=0 is the TOP-LEFT of THIS cell, not the canvas.
// That is the power of translate() — we think locally.
// ================================================================

function drawCell(w, h, motif, c1, c2, cellIndex) {
  noStroke();
  let alt = cellIndex % 2 === 0; // flips true/false on alternating rows

  if (motif === 0) {
    // ---- DIAGONAL TRIANGLE ----
    // The most iconic kente motif: a rectangle split diagonally
    // The two triangles alternate colors with each row

    fill(alt ? c1 : c2);   // background triangle
    rect(0, 0, w, h);

    fill(alt ? c2 : c1);   // foreground triangle
    triangle(0, 0,  w, 0,  w, h); // top-right triangle

  } else if (motif === 1) {
    // ---- HOURGLASS ----
    // Two triangles pointing inward, meeting at the center.
    // Very common in Asante kente — represents the meeting of forces.

    fill(c1);
    rect(0, 0, w, h);

    fill(c2);
    triangle(0, 0,    w, 0,    w/2, h/2); // top triangle pointing down
    triangle(0, h,    w, h,    w/2, h/2); // bottom triangle pointing up

  } else if (motif === 2) {
    // ---- CROSS / PLUS SIGN ----
    // Horizontal and vertical bars crossing — simulates warp/weft thread intersection.
    // The center square uses c1 as an accent.

    fill(c1);
    rect(0, 0, w, h);

    fill(c2);
    rect(0,        h * 0.3,   w,        h * 0.4); // horizontal bar
    rect(w * 0.3,  0,         w * 0.4,  h);        // vertical bar

    fill(c1); // accent at the center
    rect(w * 0.3,  h * 0.3,  w * 0.4,  h * 0.4);

  } else if (motif === 3) {
    // ---- SOLID BANDS ----
    // Horizontal color stripes — the "resting" pattern between busy strips.
    // In real kente, these are the plain weave sections.

    let bands = 4;
    let bH = h / bands;
    for (let b = 0; b < bands; b++) {
      fill(b % 2 === 0 ? c1 : c2);
      rect(0, b * bH, w, bH);
    }
  }
}


// ================================================================
// KEYBOARD CONTROLS
// ================================================================

function keyPressed() {
  // S — save the canvas as a PNG file (this is how you export for printing)
  if (key === 's' || key === 'S') {
    saveCanvas('kente_art_day1', 'png');
  }

  // R — regenerate (redraw). Right now nothing is random,
  // so it looks the same. Tomorrow we add controlled randomness.
  if (key === 'r' || key === 'R') {
    redraw();
  }
}
