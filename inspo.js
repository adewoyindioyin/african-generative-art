// Placing shapes in a grid (3 – adding inner margins in each cell)
let colors = ["#d6a2ad", "#c3b59f", "#a0af84", "#668f80", "#4a6670"];
let colorIndex = 0; // To cycle through the palette
let cells = 8;             // number of cells in rows/columns
let offset, margin, w, h;

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

  offset = width / 10;   // outer margin
  margin = offset / 5;   // inner margin between cells
  w = (width - offset * 2 - margin * (cells - 1)) / cells;  // cell width
  h = (height - offset * 2 - margin * (cells - 1)) / cells; // cell height

  frameRate(0.7); // Set a moderate speed for motion
}

function draw() {
  background(0, 0, 90);

  // Redraw the grainy background
  for (let i = 0; i < width * height * 5 / 100; i++) {
    stroke(0, 0, 0, 10);
    let px = random(width);
    let py = random(height);
    point(px, py);
  }

  // Nested loops to draw shapes in each cell
  for (let j = 0; j < cells; j++) {
    for (let i = 0; i < cells; i++) { 
      let x = offset + i * (w + margin);
      let y = offset + j * (h + margin);
      let cx = x + w / 2; // center X of cell
      let cy = y + h / 2; // center Y of cell
      let d = w;          // size of shape
      let rotate_num = int(random(4)) * 90; // 0, 90, 180, 270 degrees
      let shape_num = int(random(4));       // pick shape type

      // Pick the next color in the palette
      let color = colors[colorIndex];
      colorIndex = (colorIndex + 1) % colors.length; // Cycle through the palette

      push();
      translate(cx, cy);
      rotate(rotate_num);
      noStroke();
      fill(color);

      if (shape_num == 0) {
        triangle(-d/2, -d/2, d/2, -d/2, -d/2, d/2);
      } else if (shape_num == 1) {
        rectMode(CENTER);
        rect(0, 0, d, d);
      } else if (shape_num == 2) {
        ellipse(0, 0, d, d);
      } else if (shape_num == 3) {
        arc(-d/2, -d/2, d*2, d*2, 0, 90);
      }

      pop();
    }
  }
}
