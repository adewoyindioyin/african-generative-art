// ================================================================
// DAY 5: ỌṢUN — SACRED GEOMETRY & ROSE CURVES
// ================================================================
// The Ọṣun-Ọṣogbo Sacred Grove in Osun State (your homeland)
// is a UNESCO World Heritage Site — a forest of shrines, sculptures
// and spiritual symbols on the banks of the Ọṣun River.
//
// The visual language of Ọṣun is: spirals, circles, reflections,
// flowing curves, layers of gold and deep water-blue.
//
// Today we generate that visual language mathematically using
// PARAMETRIC EQUATIONS and ROSE CURVES — the same mathematics
// behind spirographs, mandalas, Islamic geometric art, Celtic knots,
// and almost every piece of generative sacred geometry you have
// ever seen.
//
// CONTROLS:
//   SPACE     = pause / unpause
//   R         = randomise all parameters → new sacred form
//   S         = save PNG
//   1-5       = switch palettes
//   ← / →     = change rose k value (petal count)
//   ↑ / ↓     = change rotation speed
//   Click     = new random form centred at mouse
// ================================================================
//
// WHAT YOU LEARN TODAY:
//
//   1. Parametric equations
//      — Instead of y = f(x), you describe BOTH x and y as
//        functions of a third variable, usually called t or θ.
//      — A circle: x = r*cos(t),  y = r*sin(t)
//        As t goes from 0 → TWO_PI, you trace a full circle.
//      — A spiral: x = t*cos(t),  y = t*sin(t)
//        The radius grows as t grows. Same idea, extra multiplier.
//      — ANYTHING curved is describable this way — you just need
//        to find the right formula for x and y.
//
//   2. Rose curves (rhodonea)
//      — r = cos(k * θ)  in polar coordinates.
//      — k = 3 → 3 petals.  k = 4 → 8 petals.  k = 5 → 5 petals.
//      — k = 2/3 → a 6-petal form that never closes cleanly → infinite.
//      — Converting polar (r, θ) to cartesian (x, y):
//          x = r * cos(θ)
//          y = r * sin(θ)
//      — That's it. Every petal, mandala, spirograph comes from this.
//
//   3. Drawing with beginShape / vertex in a loop
//      — We step t from 0 to TWO_PI in small increments.
//      — At each step we compute x, y from the formula.
//      — vertex(x, y) records that point.
//      — endShape(CLOSE) connects all the dots into one smooth curve.
//
//   4. frameCount — p5's built-in frame counter
//      — frameCount increases by 1 every time draw() runs.
//      — Multiplying by a small number gives a slowly changing angle.
//      — Perfect for continuous, smooth rotation without managing
//        your own t variable.
//
//   5. Stacking layers with different rotation & alpha
//      — We draw the same rose multiple times with different:
//          • rotation angle (offset by a fraction of TWO_PI)
//          • colour (cycling through the palette)
//          • scale (slightly smaller each layer)
//      — The overlapping transparencies create the jewel-like depth
//        you see in real sacred geometry and mandala art.
//
// ================================================================

// ---------------------------------------------------------------
// PALETTES — sacred, watery, golden
// ---------------------------------------------------------------

const PALETTES = [
  {
    name: 'Ọṣun Gold',
    bg: '#0A0800',
    strokes: ['#F5A204', '#FFD700', '#E8C87A', '#FFF0A0', '#C8860A'],
  },
  {
    name: 'River Blue',
    bg: '#020810',
    strokes: ['#40C4FF', '#00B0FF', '#E8D5A3', '#B3E5FC', '#0277BD'],
  },
  {
    name: 'Sacred Grove',
    bg: '#020A02',
    strokes: ['#69F0AE', '#F5A204', '#CCFF90', '#FFD740', '#00C853'],
  },
  {
    name: 'Crimson Altar',
    bg: '#080002',
    strokes: ['#FF1744', '#FF6D00', '#FFD740', '#FF8A80', '#E040FB'],
  },
  {
    name: 'Moonrise',
    bg: '#050510',
    strokes: ['#E8D5A3', '#B0BEC5', '#FFFFFF', '#CFD8DC', '#F5A204'],
  },
];

let paletteIdx = 0;

// ---------------------------------------------------------------
// ROSE PARAMETERS (each form has its own set)
// ---------------------------------------------------------------

// k controls petal count in r = cos(k * θ)
// Try: 2, 3, 4, 5, 7, 0.5, 1.5, 2/3, 3/5 — each is unique
let k = 10;

let layers     = 10;     // how many overlapping petals drawn
let resolution = 800;    // how many points per curve (smoothness)
                         // 200 = slightly angular, 1200 = perfectly smooth
let baseRadius = 300;    // outer radius of the form
let rotSpeed   = 0.003;  // how fast the whole form rotates
let paused     = false;

// Additional per-render parameters (randomised with R)
let layerAngleOffset = Math.PI * 2 /100; // angle gap between each layer
let layerScaleFactor = 0.93;         // each layer is this × smaller

// ---------------------------------------------------------------
// SETUP
// ---------------------------------------------------------------

function setup() {
  createCanvas(800, 800);
  // No noLoop() — we animate continuously
}

// ---------------------------------------------------------------
// DRAW
// ---------------------------------------------------------------

function draw() {
  background(PALETTES[paletteIdx].bg);

  // push/pop ensures translate resets each frame — without it,
  // translate() accumulates and everything shifts off-screen.
  push();
    translate(width / 2, height / 2); // work from canvas centre

    let baseAngle = paused ? 0 : frameCount * rotSpeed;

    drawSacredForm(0, 0, baseAngle);
    drawSpiral(6, PALETTES[paletteIdx].strokes[1]);
    drawCentreOrb();
  pop();

  showHUD(); // drawn AFTER pop() so it uses normal screen coordinates
}

// ================================================================
// THE SACRED FORM — stacked rose curves
// ================================================================

function drawSacredForm(cx, cy, baseAngle) {
  let cols = PALETTES[paletteIdx].strokes;

  for (let layer = 0; layer < layers; layer++) {

    // Each layer: slightly rotated, slightly smaller, different colour
    let angle  = baseAngle + layer * layerAngleOffset;
    let radius = baseRadius * pow(layerScaleFactor, layer);
    let col    = cols[layer % cols.length];

    // Alpha decreases for inner layers — transparency builds depth
    // Outermost layer (layer 0) is most opaque
    let alpha = map(layer, 0, layers - 1, 180, 40);

    drawRoseCurve(cx, cy, radius, angle, col, alpha);
  }
}

// ================================================================
// THE SPIRAL FORM
// ================================================================

function drawSpiral(turns, col) {
  let c = color(col);
  c.setAlpha(60);
  stroke(c);
  strokeWeight(0.8);
  noFill();
  beginShape();
  let steps = 600;
  for (let i = 0; i < steps; i++) {
    let theta = map(i, 0, steps, 0, TWO_PI * turns);
    let r = map(i, 0, steps, 0, baseRadius);
    vertex(r * cos(theta), r * sin(theta));
  }
  endShape();
}

// ================================================================
// THE ROSE CURVE
//
// r = cos(k * θ)            ← polar equation of the rose
// x = r * cos(θ)            ← convert polar to cartesian x
// y = r * sin(θ)            ← convert polar to cartesian y
//
// We trace θ from 0 all the way to TWO_PI * k (to complete
// the full rose — some k values need more than one revolution).
// ================================================================

function drawRoseCurve(cx, cy, radius, rotation, col, alpha) {

  // How far we need to go in θ depends on k:
  // For integer k, TWO_PI is enough.
  // For fractional k, we need lcm(numerator, denominator) * PI.
  // Simplest safe choice: go around enough times to close the curve.
  // TWO_PI * max(k, 10) is generous enough for all values we'll use.
  let totalAngle = TWO_PI * max(k, 10);
  let step = totalAngle / resolution;

  let c = color(col);
  c.setAlpha(alpha);

  noFill();
  stroke(c);
  strokeWeight(1.2);

  push();
    translate(cx, cy);
    rotate(rotation);      // each layer has its own rotation offset

    let f = color(col);
f.setAlpha(alpha * 0.15);
fill(f);

    beginShape();
    for (let theta = 0; theta <= totalAngle; theta += step) {
      let r = radius * cos(k * theta);   // THE ROSE FORMULA
      let x = r * cos(theta);
      let y = r * sin(theta);
      vertex(x, y);
    }
    endShape(CLOSE);

  pop();
}

// ================================================================
// CENTRE ORB — the eye of the form
// ================================================================

function drawCentreOrb() {
  let col = color(PALETTES[paletteIdx].strokes[0]);

  // Outer glow rings
  noFill();
  for (let i = 5; i > 0; i--) {
    col.setAlpha(i * 12);
    stroke(col);
    strokeWeight(1);
    ellipse(0, 0, i * 18, i * 18);
  }

  // Solid centre dot
  col.setAlpha(220);
  fill(col);
  noStroke();
  ellipse(0, 0, 10, 10);
}

// ================================================================
// HUD
// ================================================================

function showHUD() {
  // HUD is drawn AFTER translate, so negative-offset to reach corners
  fill(255, 255, 255, 70);
  noStroke();
  textSize(10);
  textAlign(LEFT, BOTTOM);
  text(
    'ỌṢUN  |  k=' + nf(k, 1, 2) +
    '  layers=' + layers +
    '  palette: ' + PALETTES[paletteIdx].name +
    '   |   SPACE=pause  R=random  S=save  1-5=palette  ←→=petals  ↑↓=speed',
    10,
    height - 10
  );
  if (paused) {
    fill(255, 255, 255, 120);
    textAlign(CENTER, TOP);
    textSize(13);
    text('— PAUSED —', width / 2, 14);
    textAlign(LEFT, BOTTOM);
  }
}

// ================================================================
// INPUT
// ================================================================

function mousePressed() {
  // Draw a second form at mouse position (relative to centre)
  let mx = mouseX - width / 2;
  let my = mouseY - height / 2;
  drawSacredForm(mx, my, frameCount * rotSpeed * 1.618);
}

function keyPressed() {
  if (key === ' ') { paused = !paused; return false; }

  if (key === 'r' || key === 'R') {
    k                = random([1, 2, 3, 4, 5, 6, 7, 1.5, 2.5, 3/2, 5/4, 7/3]);
    layers           = floor(random(4, 12));
    rotSpeed         = random(0.001, 0.008);
    layerAngleOffset = random(TWO_PI / 20, TWO_PI / 5);
    layerScaleFactor = random(0.88, 0.97);
    baseRadius       = random(200, 360);
  }

  if (key === 's' || key === 'S') {
    saveCanvas('osun_k' + nf(k, 1, 2) + '_' + PALETTES[paletteIdx].name.replace(/\s/g, '_'), 'png');
  }

  if (key === '1') paletteIdx = 0;
  if (key === '2') paletteIdx = 1;
  if (key === '3') paletteIdx = 2;
  if (key === '4') paletteIdx = 3;
  if (key === '5') paletteIdx = 4;

  // Change petal count
  if (keyCode === LEFT_ARROW)  { k = max(1, k - 1); }
  if (keyCode === RIGHT_ARROW) { k = k + 1; }

  // Change rotation speed
  if (keyCode === UP_ARROW)    { rotSpeed = min(rotSpeed + 0.001, 0.02); }
  if (keyCode === DOWN_ARROW)  { rotSpeed = max(rotSpeed - 0.001, 0.0005); }
}
