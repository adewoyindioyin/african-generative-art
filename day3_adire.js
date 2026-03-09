// ================================================================
// DAY 3: ADIRE — YORUBA RESIST-DYE CLOTH
// ================================================================
// Adire is Yoruba — from your homeland in Osun State.
// Cloth is dyed with indigo; wax (eleko) or tied raffia (oniko)
// blocks the dye from soaking in, leaving organic light patterns
// on a deep indigo ground.
//
// We simulate this with Perlin noise — the perfect tool for
// anything organic: cloth, water, smoke, terrain, fire, dye.
//
// CONTROLS:
//   SPACE  = pause / unpause
//   R      = new noise seed → new pattern
//   S      = save PNG
//   1-4    = switch cloth styles
//   ↑ / ↓  = zoom noise in / out (bigger blobs vs finer detail)
// ================================================================
//
// WHAT YOU LEARN TODAY:
//
//   1. noise(x, y, z)
//      — Perlin noise: smooth, connected randomness.
//      — Unlike random() which gives chaotic, unrelated values,
//        noise() gives values where nearby inputs → nearby outputs.
//      — Perfect for anything in nature: cloth, terrain, fire, water.
//      — Try this in your head: noise(0.1) ≈ noise(0.11) ≈ noise(0.12)
//        but random() gives completely different results each time.
//
//   2. The draw() loop without noLoop()
//      — In Days 1-2 we called noLoop() — draw() ran only ONCE.
//      — Today: no noLoop() → draw() runs ~60 times per second.
//      — We increase a variable t each frame → the noise shifts → animation.
//
//   3. map(value, fromLow, fromHigh, toLow, toHigh)
//      — noise() always returns 0 to 1.
//      — map() converts that to ANY range you need.
//      — Example: map(n, 0, 1, 50, 255) → brightness between 50 and 255.
//      — You use map() constantly in creative coding. Learn it well.
//
//   4. sin() for smooth oscillation
//      — sin(angle) returns a value that smoothly waves between -1 and +1.
//      — sin(frameCount * 0.02) creates a gentle pulse over time.
//      — Used here to make the threshold "breathe" — the pattern expands
//        and contracts slowly, like cloth moving in a breeze.
//
//   5. noiseSeed() — same as randomSeed() but for noise()
//      — Locks in a specific pattern you can reproduce.
//
// ================================================================

// ---------------------------------------------------------------
// ANIMATION STATE
// ---------------------------------------------------------------

let t = 0;           // time — increases each frame, drives the animation
let speed = 0.04;   // how fast the cloth pattern evolves
                     // try: 0.001 (glacial), 0.010 (fast), 0.030 (chaotic)
let noiseScale = 0.0099;// controls zoom level of the noise
                        // smaller = bigger blobs (zoomed in on the noise landscape)
                        // larger  = finer detail (zoomed out)
let paused = false;
let currentNoiseSeed;

const CELL = 5; // pixel size of each noise cell
                // smaller (try 3) = more detail, slower performance
                // larger  (try 24) = chunky geometric look

// ---------------------------------------------------------------
// CLOTH STYLES — 4 Adire traditions
//
//   bg        = the dye colour (the indigo background)
//   resist    = the wax/starch resist colour (what stays light)
//   threshold = where dye ends and resist begins (0.0 to 1.0)
//               higher threshold = less resist showing (more solid dye)
//               lower  threshold = more resist showing (lighter cloth)
// ---------------------------------------------------------------

const STYLES = [
  { name: 'Eleko Classic',  bg: '#0A1628', resist: '#D4C09A', threshold: 0.52 },
  { name: 'Oniko White',    bg: '#0D2137', resist: '#F2EEE0', threshold: 0.55 },
  { name: 'Batik Gold',     bg: '#160C00', resist: '#E8A020', threshold: 0.50 },
  { name: 'Volcanic Night', bg: '#160018', resist: '#FF7040', threshold: 0.51 },
];

let styleIdx = 0;

// ---------------------------------------------------------------
// SETUP
// ---------------------------------------------------------------

function setup() {
  createCanvas(800, 800);
  noStroke();
  currentNoiseSeed = 42;  // first load always looks good
  noiseSeed(currentNoiseSeed);

  // KEY DIFFERENCE FROM DAYS 1 & 2:
  // We do NOT call noLoop() here.
  // That means draw() will run continuously at ~60fps.
  // Every frame: t increases slightly → noise shifts → cloth animates.
}

// ---------------------------------------------------------------
// DRAW — runs ~60 times per second (the animation engine)
// ---------------------------------------------------------------

function draw() {
  if (!paused) {
    drawAdire();
    t += speed;   // advance time → next frame will sample noise at t+speed
  }
  showHUD();      // always draw the HUD, even when paused
}

// ================================================================
// THE CORE: PERLIN NOISE FIELD
//
// We step through the canvas in CELL-sized blocks.
// At each block, we sample noise(x, y, t) — three coordinates:
//   x * noiseScale  → position in the horizontal noise dimension
//   y * noiseScale  → position in the vertical noise dimension
//   t               → position in the TIME dimension
//
// Imagine noise as a 3D mountain range:
//   x and y are where you stand on the map.
//   t is a dimension you move through slowly — the hills shift.
//
// If the noise value at that point is ABOVE the threshold:
//   → fill with resist colour (the wax blocked the dye there)
// If BELOW the threshold:
//   → fill with dye colour (the indigo soaked in)
// ================================================================

function drawAdire() {
  let style = STYLES[styleIdx];

  // sin() gives a value that waves smoothly between -1 and +1.
  // Multiplying by 0.025 makes it a tiny ±2.5% pulse.
  // This makes the threshold "breathe" — the resist areas slowly
  // expand and contract, like cloth moving in a gentle breeze.
  let breathe = sin(t * 10) * 0.025;
  let threshold = style.threshold + breathe;

  for (let x = 0; x < width; x += CELL) {
    for (let y = 0; y < height; y += CELL) {

      // THE KEY LINE — sample Perlin noise at this position + time
      let n = noise(x * noiseScale, y * noiseScale, t);

      // n is always between 0 and 1.
      // Compare it to the threshold to decide: resist or dye?
      if (n > threshold) {
        fill(style.resist);
      } else {
        fill(style.bg);
      }

      rect(x, y, CELL, CELL);
    }
  }

for (let x = 0; x < width; x += CELL * 2) {
    for (let y = 0; y < height; y += CELL * 2) {
       let n2 = noise(x * noiseScale * 2.7, y * noiseScale * 2.7, t * 0.5);
      if (n2 > style.threshold + 0.15) {
         fill(style.resist + '75'); // semi-transparent
        rect(x, y, CELL * 2, CELL * 2);
      }
    }
  }

  drawClothStructure();
}

// ================================================================
// WOVEN CLOTH GRID OVERLAY
//
// Real adire is resist-dyed on WOVEN cloth.
// The loom grid is faintly visible beneath the dye pattern.
// These semi-transparent lines give the artwork that textile feel.
// ================================================================

function drawClothStructure() {
  let style = STYLES[styleIdx];
  let gridSize = 48; // size of each "woven panel" in pixels

  // Hex colour trick: appending a 2-digit hex to any colour string
  // sets its alpha. '20' ≈ 12% opacity. 'AA' ≈ 67% opacity.
  stroke(style.resist + '20');
  strokeWeight(0.8);

  for (let x = 0; x <= width; x += gridSize) {
    line(x, 0, x, height);
  }
  for (let y = 0; y <= height; y += gridSize) {
    line(0, y, width, y);
  }

  noStroke();
}

// ================================================================
// HUD (heads-up display)
// ================================================================

function showHUD() {
  let style = STYLES[styleIdx];
  fill(style.resist + 'BB');
  noStroke();
  textSize(11);
  textAlign(LEFT, BOTTOM);
  text(
    'ADIRE: ' + style.name +
    '   |   SPACE=pause  R=new seed  S=save  1-4=style  ↑↓=zoom',
    16, height - 14
  );

  if (paused) {
    textAlign(CENTER, TOP);
    textSize(14);
    fill(style.resist + 'CC');
    text('— PAUSED —', width / 2, 18);
    textAlign(LEFT, BOTTOM);
  }
}

// ================================================================
// KEYBOARD CONTROLS
// ================================================================

function keyPressed() {

  // Pause / unpause
  if (key === ' ') {
    paused = !paused;
    return false; // prevents browser scrolling on spacebar
  }

  // New noise seed → completely different cloth pattern
  if (key === 'r' || key === 'R') {
    currentNoiseSeed = floor(random(99999));
    noiseSeed(currentNoiseSeed);
    t = 0; // reset time so it feels like a fresh cloth
  }

  // Save the current frame as a PNG
  if (key === 's' || key === 'S') {
    saveCanvas('adire_' + STYLES[styleIdx].name.replace(/\s/g, '_') + '_seed' + currentNoiseSeed, 'png');
  }

  // Style switching
  if (key === '1') styleIdx = 0;
  if (key === '2') styleIdx = 1;
  if (key === '3') styleIdx = 2;
  if (key === '4') styleIdx = 3;

  // Zoom noise in/out with arrow keys
  // UP = zoom in = bigger, blobber shapes (smaller noiseScale)
  // DOWN = zoom out = finer, more complex shapes
  if (keyCode === UP_ARROW) {
    noiseScale = max(0.002, noiseScale * 0.8);
  }
  if (keyCode === DOWN_ARROW) {
    noiseScale = min(0.05, noiseScale * 1.25);
  }
}

// ================================================================
// ================================================================
// DAY 3 EXERCISES
// ================================================================
// ================================================================
//
// Work through these in order. Read the comment, make the change,
// open the browser, see what happens, then read the next one.
//
// ----------------------------------------------------------------
// EXERCISE 1 — Feel the difference between noise and random
//
// In drawAdire(), replace this line:
//   let n = noise(x * noiseScale, y * noiseScale, t);
// with:
//   let n = random();
//
// Run it. See the static, chaotic pixel storm.
// Now change it back to noise(). See the smooth flowing cloth.
//
// THAT is the fundamental lesson of today. Never forget it.
// ----------------------------------------------------------------
//
// EXERCISE 2 — Change CELL size
//
// At the top, change CELL from 8 to 3. Reload. Fine cloth texture.
// Change CELL to 24. Reload. Bold, chunky, almost geometric.
// Change CELL to 1. Reload. Now it's pixel art (but slow).
//
// Notice how the SAME noise produces completely different aesthetics
// depending on how you sample and display it.
// ----------------------------------------------------------------
//
// EXERCISE 3 — Replace hard threshold with a gradient (use map!)
//
// In drawAdire(), find the if/else block:
//   if (n > threshold) {
//     fill(style.resist);
//   } else {
//     fill(style.bg);
//   }
//
// Replace the ENTIRE if/else with this:
//   let brightness = map(n, 0, 1, 0, 255);
//   fill(brightness);
//
// Now you get a full greyscale gradient — no hard edge.
// To bring the colour back, use lerpColor():
//   let c = lerpColor(color(style.bg), color(style.resist), n);
//   fill(c);
//
// lerpColor(a, b, amount) blends between colour a and colour b.
// amount = 0 → fully a. amount = 1 → fully b. amount = 0.5 → halfway.
// ----------------------------------------------------------------
//
// EXERCISE 4 — Add your own style
//
// Add a 5th entry to the STYLES array (use colours you choose).
// Then add:   if (key === '5') styleIdx = 4;
// in keyPressed().
//
// Pick colours that feel like a piece of fabric you've seen.
// ----------------------------------------------------------------
//
// EXERCISE 5 — Double noise layers (challenge)
//
// Add a SECOND noise layer on top with a slightly different scale
// and opposite colour logic. In drawAdire(), after the main loop,
// add a second loop:
//
//   for (let x = 0; x < width; x += CELL * 2) {
//     for (let y = 0; y < height; y += CELL * 2) {
//       let n2 = noise(x * noiseScale * 2.7, y * noiseScale * 2.7, t * 0.5);
//       if (n2 > style.threshold + 0.15) {
//         fill(style.resist + '55'); // semi-transparent
//         rect(x, y, CELL * 2, CELL * 2);
//       }
//     }
//   }
//
// This adds a finer lace pattern on top of the main cloth.
// Two noise frequencies layered = much richer texture.
// This is called "fractal noise" or "octave layering" — used in
// virtually every professional generative artwork.
// ================================================================
