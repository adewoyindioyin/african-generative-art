// Glow effect sketch using additive blending and layered strokes.

function setup() {
  // 1) Initialize drawing surface and color space.
  createCanvas(600, 600);
  // HSB gives direct control over brightness and alpha, useful for light effects.
  colorMode(HSB, 360, 100, 100, 100);
  // Start from a dark background so emitted light appears bright.
  background(0, 0, 10);
  // Additive blending makes overlapping strokes accumulate brightness like real glow.
  blendMode(ADD);

  // 2) Build a grainy/noisy background by scattering many faint points.
  // The point count is a percentage of total pixels to keep density proportional to canvas size.
  for (let i = 0; i < width * height * 5 / 100; i++) {
    // Low-alpha points create subtle texture without overpowering the glow.
    stroke(0, 0, 100, 10);
    let px = random(width);
    let py = random(height);
    point(px, py);
  } 

  // 3) Define one main circle centered on the canvas.
  let x = width / 2;
  let y = height / 2;
  let d = width / 2 * 0.85;

  // 4) Draw multiple concentric outlines with varying thickness/alpha.
  // Thick + faint outer passes and repeated overlaps simulate a soft halo.
  let line_count = 10;
  for (let i = 0; i < line_count; i++) {
    // Increase alpha gradually across passes to control luminance buildup.
    let t = i / line_count * 5;
    stroke(0, 0, 100, t);
    // Decrease stroke width each pass for a tapered glow profile.
    strokeWeight((line_count - i) * 5);
    noFill();
    ellipse(x, y, d, d);
  }

  // 5) Final crisp outline defines the bright core edge of the glowing shape.
  stroke(0, 0, 100);
  noFill();
  ellipse(x, y, d, d);
}