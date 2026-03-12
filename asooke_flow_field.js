// ================================================================
// DAY 4: ASO-OKE FLOW FIELD
// ================================================================
// Aso-Oke (ah-SHOW-okay) is Yoruba prestige cloth — hand-woven
// with bold stripes of colour, worn at weddings, funerals,
// naming ceremonies. The threads always run in parallel flows.
//
// Today we simulate those threads as PARTICLES flowing across the
// canvas, directed by a Perlin noise vector field.
// Each particle is its own object with its own position, velocity,
// colour, and lifespan — managed by a JavaScript CLASS.
//
// CONTROLS:
//   SPACE     = pause / unpause
//   R         = new noise seed → new flow pattern
//   S         = save PNG
//   1-5       = switch palettes
//   ↑ / ↓     = more / fewer particles
//   Click     = burst of new particles at mouse position
// ================================================================
//
// WHAT YOU LEARN TODAY:
//
//   1. class
//      — A blueprint for making many objects of the same type.
//      — Every Particle is an instance of the Particle class.
//      — It has a constructor (sets up starting values),
//        an update() method (moves it), and a draw() method.
//      — Mental model: a class is a cookie cutter; each particle
//        is a cookie. Same shape, different position/colour.
//
//   2. Arrays of objects
//      — let particles = [] stores ALL the particles.
//      — for...of loops let you update/draw each one cleanly.
//      — splice() removes particles that have died (run out of life).
//
//   3. Velocity + position (basic physics)
//      — Every particle has a position (x, y) and a velocity (vx, vy).
//      — Each frame: position += velocity → the particle moves.
//      — This is the foundation of ALL animation in games and art.
//
//   4. Noise as a direction field
//      — noise(x, y) returns a number 0–1.
//      — map(noise(x,y), 0, 1, 0, TWO_PI) → an ANGLE.
//      — cos(angle) and sin(angle) convert that angle into movement.
//      — Result: every point in space has a "wind direction"
//        and particles flow along those invisible currents.
//
//   5. Alpha background trails
//      — Instead of clearing the canvas fully each frame, we draw
//        a semi-transparent rectangle over everything.
//      — Old marks fade slowly rather than vanishing instantly.
//      — This is how you create flowing, ghostly trails.
//
// ================================================================

// ---------------------------------------------------------------
// PALETTES — Aso-Oke is famous for bold saturated colour
// ---------------------------------------------------------------

const PALETTES = [
  // bg = cloth background, colours = thread colours for particles
  {
    name: 'Ìlá (Magenta)',
    bg: [10, 5, 20],
    colours: ['#E040FB', '#F5A204', '#FF6B6B', '#E8D5A3', '#B388FF'],
  },
  {
    name: 'Ọjọ́ Ìdúpẹ́ (Thanksgiving)',
    bg: [5, 18, 10],
    colours: ['#F5A204', '#FFD700', '#FFFFFF', '#FFF176', '#FF8F00'],
  },
  {
    name: 'Ìsálẹ̀ Òkun (Deep Sea)',
    bg: [5, 10, 28],
    colours: ['#40C4FF', '#00E5FF', '#E8D5A3', '#80D8FF', '#B2EBF2'],
  },
  {
    name: 'Ẹjẹ (Crimson)',
    bg: [20, 5, 5],
    colours: ['#FF1744', '#FF8A80', '#FFD740', '#FF6D00', '#FFCCBC'],
  },
  {
    name: 'Igbó (Forest)',
    bg: [5, 15, 5],
    colours: ['#69F0AE', '#F5A204', '#CCFF90', '#B9F6CA', '#FFD180'],
  },
];

let paletteIdx = 0;

// ---------------------------------------------------------------
// GLOBAL STATE
// ---------------------------------------------------------------

let particles = [];      // all live particles
let targetCount = 1200;  // how many particles to keep alive
let noiseScale = 0.003;  // zoom of the noise direction field
let noiseStrength = 0.4; // how strongly the field turns particles
let currentSeed = 0;
let paused = false;
let t = 0;               // time dimension for animated flow

// ---------------------------------------------------------------
// THE PARTICLE CLASS
// ---------------------------------------------------------------

class Particle {

  // constructor() runs once when you do: new Particle()
  // Think of it as the "birth" of the particle.
  constructor(x, y) {
    // If x,y are given, start there — otherwise start anywhere on canvas
    this.x  = x  ?? random(width);
    this.y  = y  ?? random(height);
    this.vx = 0;  // velocity — starts still
    this.vy = 0;

    // Each particle picks a random colour from the current palette
    let cols = PALETTES[paletteIdx].colours;
    this.col = cols[floor(random(cols.length))];

    this.size    = random(0.8, 2.5);   // thread thickness
    this.life    = random(80, 220);    // frames until it dies & respawns
    this.maxLife = this.life;
    this.speed   = random(1.2, 3.0);   // how fast it moves along the field
  }

  // update() runs every frame — this is where the particle MOVES
  update() {
    // ── STEP 1: Ask the noise field: what direction should I go?
    //
    // noise() gives a value 0–1 at this position+time.
    // We map that 0–1 range to 0–TWO_PI (a full circle of angles).
    // Multiplying by 4 adds extra spiralling character.
    let angle = map(
      noise(this.x * noiseScale, this.y * noiseScale, t),
      0, 1,
      0, TWO_PI * 4
    );

    // ── STEP 2: Convert angle to velocity components
    //
    // cos(angle) = the horizontal component of that direction (-1 to 1)
    // sin(angle) = the vertical component of that direction  (-1 to 1)
    // Multiplying by speed makes it faster or slower.
    this.vx += cos(angle) * noiseStrength;
    this.vy += sin(angle) * noiseStrength;

    // Clamp velocity so particles don't go infinitely fast
    let spd = dist(0, 0, this.vx, this.vy);
    if (spd > this.speed) {
      this.vx = (this.vx / spd) * this.speed;
      this.vy = (this.vy / spd) * this.speed;
    }

    // ── STEP 3: Move — add velocity to position
    this.x += this.vx;
    this.y += this.vy;

    // ── STEP 4: Age the particle
    this.life--;
  }

  // draw() paints one dot/segment for this particle
  draw() {
    // Fade in/out based on remaining life
    // map life to alpha: full life = fully opaque, near death = transparent
    let alpha = map(this.life, 0, this.maxLife, 0, 200);

    // Parse hex colour and add computed alpha
    // colorMode is RGB by default so we can just set fill
    let c = color(this.col);
    c.setAlpha(alpha);
    noStroke();
    fill(c);

    let d = dist(this.x, this.y, mouseX, mouseY);
let s = map(d, 0, 200, this.size * 6, this.size);
s = max(s, this.size); 
stroke(c);
strokeWeight(this.size);
noFill();
line(this.x, this.y,
     this.x - this.vx * 4,
     this.y - this.vy * 4);
noStroke(); 
  //ellipse(this.x, this.y, this.size, this.size);
  }

  // isDead() returns true when this particle has used up its life
  // OR wandered off the canvas
  isDead() {
    return this.life <= 0 ||
           this.x < -10 || this.x > width  + 10 ||
           this.y < -10 || this.y > height + 10;
  }
}

// ---------------------------------------------------------------
// SETUP
// ---------------------------------------------------------------

function setup() {
  createCanvas(1080, 1080);
  noiseSeed(currentSeed);
  spawnParticles(targetCount);
  frameRate(60);
}

// ---------------------------------------------------------------
// DRAW — runs ~60fps
// ---------------------------------------------------------------

function draw() {
  // ── TRAIL EFFECT ─────────────────────────────────────────────
  // Draw a semi-transparent background rectangle instead of
  // clearing the canvas fully. Old marks fade but don't vanish.
  //
  // Try changing 18 to:
  //   5  → very long ghostly trails
  //   40 → short sharp trails
  //   255 → no trails at all (fully clears each frame)
  let bg = PALETTES[paletteIdx].bg;
  fill(bg[0], bg[1], bg[2], 40);
  noStroke();
  rect(0, 0, width, height);

  if (!paused) {
    // ── UPDATE + DRAW each particle ────────────────────────────
    for (let i = particles.length - 1; i >= 0; i--) {
      let p = particles[i];
      p.update();
      p.draw();

      // Remove dead particles (iterate backwards so splice is safe)
      if (p.isDead()) {
        particles.splice(i, 1);
      }
    }

    // ── REFILL pool to targetCount ──────────────────────────────
    // When particles die, spawn new ones to keep the count up
    let deficit = targetCount - particles.length;
    if (deficit > 0) spawnParticles(min(deficit, 30)); // max 30/frame

    t += 0.003; // advance time → the flow field slowly shifts
  }

  showHUD();
}

// ---------------------------------------------------------------
// HELPERS
// ---------------------------------------------------------------

function spawnParticles(n) {
  for (let i = 0; i < n; i++) {
    particles.push(new Particle());
  }
}

// ---------------------------------------------------------------
// HUD
// ---------------------------------------------------------------

function showHUD() {
  fill(255, 255, 255, 80);
  noStroke();
  textSize(11);
  textAlign(LEFT, BOTTOM);
  text(
    'ASO-OKE: ' + PALETTES[paletteIdx].name +
    '   |   ' + particles.length + ' threads' +
    '   |   SPACE=pause  R=new  S=save  1-5=palette  ↑↓=threads  Click=burst',
    14, height - 12
  );
  if (paused) {
    textAlign(CENTER, CENTER);
    textSize(16);
    fill(255, 255, 255, 140);
    text('— PAUSED —', width / 2, 20);
    textAlign(LEFT, BOTTOM);
  }
}

// ---------------------------------------------------------------
// INPUT
// ---------------------------------------------------------------

function mousePressed() {
  // Burst of 80 particles at the click position
  for (let i = 0; i < 80; i++) {
    particles.push(new Particle(
      mouseX + random(-20, 20),
      mouseY + random(-20, 20)
    ));
  }
}

function keyPressed() {
  if (key === ' ') { paused = !paused; return false; }

  if (key === 'r' || key === 'R') {
    currentSeed = floor(random(99999));
    noiseSeed(currentSeed);
    t = 0;
    // Clear and respawn
    particles = [];
    // Also clear the canvas properly on reset
    let bg = PALETTES[paletteIdx].bg;
    background(bg[0], bg[1], bg[2]);
    spawnParticles(targetCount);
  }

  if (key === 's' || key === 'S') {
    saveCanvas('asooke_' + PALETTES[paletteIdx].name.replace(/\s/g, '_'), 'png');
  }

  if (key === '1') switchPalette(0);
  if (key === '2') switchPalette(1);
  if (key === '3') switchPalette(2);
  if (key === '4') switchPalette(3);
  if (key === '5') switchPalette(4);

  // More / fewer threads
  if (keyCode === UP_ARROW)   { targetCount = min(targetCount + 200, 4000); }
  if (keyCode === DOWN_ARROW) { targetCount = max(targetCount - 200, 100);  }
}

function switchPalette(idx) {
  paletteIdx = idx;
  // Reassign colours to all existing particles
  let cols = PALETTES[paletteIdx].colours;
  for (let p of particles) {
    p.col = cols[floor(random(cols.length))];
  }
  // Clear trails by repainting background
  let bg = PALETTES[paletteIdx].bg;
  background(bg[0], bg[1], bg[2]);
}

// ================================================================
// ================================================================
// DAY 4 EXERCISES
// ================================================================
// ================================================================
//
// EXERCISE 1 — Understand what a class IS
//
// In the browser console (F12 → Console), type:
//   particles[0]
// Press Enter. You will see ONE Particle object with all its
// properties: x, y, vx, vy, col, size, life, etc.
//
// Now type:
//   particles.length
// See how many particles are active right now.
//
// Now type:
//   new Particle(400, 400)
// You just created a one-off Particle in the console.
// GOAL: See that a class is a live, inspectable object.
// ----------------------------------------------------------------
//
// EXERCISE 2 — Change the trail length
//
// In draw(), find this line:
//   fill(bg[0], bg[1], bg[2], 18);
//
// Change 18 to 5. Reload → very long ghostly trails.
// Change 18 to 60. Reload → short sharp strokes.
// Change 18 to 255. Reload → no trails (fresh each frame).
//
// GOAL: Understand how alpha creates the trail illusion.
// ----------------------------------------------------------------
//
// EXERCISE 3 — Make particles bigger near the mouse
//
// Inside the Particle draw() method, replace:
//   ellipse(this.x, this.y, this.size, this.size);
// with:
//   let d = dist(this.x, this.y, mouseX, mouseY);
//   let s = map(d, 0, 200, this.size * 6, this.size);
//   s = max(s, this.size);
//   ellipse(this.x, this.y, s, s);
//
// Now move your mouse over the canvas. Threads swell near the cursor.
// GOAL: Use dist() and map() together for spatial effects.
// ----------------------------------------------------------------
//
// EXERCISE 4 — Add a 6th palette (your own)
//
// Add a new entry to the PALETTES array.
// Pick colours that remind you of a specific moment or place.
// Add:  if (key === '6') switchPalette(5);
// GOAL: Express yourself through colour.
// ----------------------------------------------------------------
//
// EXERCISE 5 — Change particle shape (challenge)
//
// In Particle's draw() method, replace the ellipse with a line
// segment — draw from the current position BACK along the velocity:
//
//   stroke(c);
//   strokeWeight(this.size);
//   noFill();
//   line(this.x, this.y,
//        this.x - this.vx * 4,
//        this.y - this.vy * 4);
//   noStroke();
//
// Each particle becomes a tiny stroke — like actual woven threads.
// GOAL: Same data (position + velocity), completely different look.
// ================================================================
