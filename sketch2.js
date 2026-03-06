// Declare variables in the global scope to ensure accessibility
let colors = ["#555233", "#DF921D", "#878937", "#CFC52A", "#DC2A41"];
let cells, offset, margin, w, h;
const FRAME_THICKNESS = 24;
const SHADOW_DEPTH = 28;
const FRAME_CONTENT_MARGIN = 24;

function setup() {
  createCanvas(600, 600);
  colorMode(HSB, 360, 100, 100, 100);
  angleMode(DEGREES);
  background(0, 0, 90); 

  // Grainy background
  for (let i = 0; i < width * height * 5 / 100; i++) {
    stroke(0, 0, 0, 10);
    let px = random(width);
    let py = random(height);
    point(px, py);
  }

  // Initialize grid variables
  cells = int(random(3, 12));
  offset = FRAME_THICKNESS + SHADOW_DEPTH + FRAME_CONTENT_MARGIN;
  margin = offset / 5;
  w = (width - offset * 2 - margin * (cells - 1)) / cells;
  h = (height - offset * 2 - margin * (cells - 1)) / cells;

  frameRate(1);
}

function draw() {
  background(0, 0, 90);

  // Grainy background
  for (let i = 0; i < width * height * 5 / 100; i++) {
    stroke(0, 0, 0, 10);
    let px = random(width);
    let py = random(height);
    point(px, py);
  }

  // Recalculate grid variables for each frame
  cells = int(random(3, 12));
  offset = FRAME_THICKNESS + SHADOW_DEPTH + FRAME_CONTENT_MARGIN;
  margin = offset / 5;
  w = (width - offset * 2 - margin * (cells - 1)) / cells;
  h = (height - offset * 2 - margin * (cells - 1)) / cells;

  // Draw grid of shapes
  for (let j = 0; j < cells; j++) {
    for (let i = 0; i < cells; i++) {
      let x = offset + i * (w + margin);
      let y = offset + j * (h + margin);
      let cx = x + w / 2;
      let cy = y + h / 2;
      let d = w;
      let rotate_num = int(random(4)) * 90; // Random rotation in multiples of 90 degrees
      let shape_num = int(random(4));

      let c = random(colors);

      push(); 
      translate(cx, cy);
      rotate(rotate_num);
      if (random(100) > 50) {
        noStroke();
        fill(c);
      } else {
        noFill();
        stroke(c);
      }
      if (shape_num == 0) {
        triangle(-d / 2, -d / 2, d / 2, -d / 2, -d / 2, d / 2);
      } else if (shape_num == 1) {
        rectMode(CENTER);
        rect(0, 0, d, d);
      } else if (shape_num == 2) {
        ellipse(0, 0, d, d);
      } else if (shape_num == 3) {
        arc(-d / 2, -d / 2, d * 2, d * 2, 0, 90);
      }
      pop();
    }
  }

  drawFrameAndInnerShadow();
}

function drawFrameAndInnerShadow() {
  push();
  rectMode(CORNER);
  noFill();

  // Black frame
  stroke(220, 0, 0);
  strokeWeight(FRAME_THICKNESS);
  rect(
    FRAME_THICKNESS / 2,
    FRAME_THICKNESS / 2,
    width - FRAME_THICKNESS,
    height - FRAME_THICKNESS
  );

  // Dark inner-edge shadows
  strokeWeight(1);
  for (let i = 0; i < SHADOW_DEPTH; i++) {
    let a = map(i, 0, SHADOW_DEPTH - 1, 35, 0);
    stroke(0, 0, 0, a);
    let inset = FRAME_THICKNESS + i;
    rect(inset + 0.5, inset + 0.5, width - inset * 2 - 1, height - inset * 2 - 1);
  }

  pop();
}