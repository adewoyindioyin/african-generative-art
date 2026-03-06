// p5.js sketch using canvas context (ctx) to draw SVG-like shapes
// The drawing is scaled and centered to fill the 400x400 canvas
// Background color is orange, shapes are drawn in original proportions

let canvas;
let ctx; 

function setup() {
  createCanvas(600, 600); // Set up canvas size
  ctx = drawingContext;   // Get canvas 2D context

  // Grainy background
  for (let i = 0; i < width * height * 5 / 100; i++) {
    stroke(0, 0, 0, 20); 
    let px = random(width);
    let py = random(height);
    point(px, py); 
  }
}



  
function draw() {
  background(251, 175, 87); // Set orange background

  // Grainy background
  for (let i = 0; i < width * height * 5 / 100; i++) {
    stroke(0, 0, 0, 10);
    let px = random(width);
    let py = random(height);
    point(px, py); 
  }

  // Scale and center the original drawing to fit the canvas
  ctx.save();
  // Calculate scale factors based on original shape bounds
  // Original drawing fits roughly in 416-500 x 83-166
  let scaleX = width / (500.019 - 416.686);
  let scaleY = height / (166.65 - 83.317);
  let scaleVal = Math.min(scaleX, scaleY) * 0.65; // add margin
  ctx.translate(width / 2, height / 2); // Center canvas
  ctx.scale(scaleVal, scaleVal);        // Scale drawing
  ctx.translate(-(416.686 + 500.019) / 2, -(83.317 + 166.65) / 2); // Center shapes

  drawA();
  ctx.restore();
}


// Draws the original SVG shapes using canvas context
function drawA(){
ctx.save();
ctx.strokeStyle = "rgba(0,0,0,0)";
ctx.miterLimit = 4;
ctx.font = "15px ''";
ctx.lineJoin = "round";
ctx.miterLimit = "2";
ctx.font = "   15px ''";

  // Draw orange rectangle (main background shape)
 // ctx.fillStyle = "rgb(251,175,87)";
  //ctx.beginPath();
  //ctx.moveTo(416.686, 83.317);
  //ctx.lineTo(500.019, 83.317);
  //ctx.lineTo(500.019, 166.65);
  //ctx.lineTo(416.686, 166.65);
  //ctx.closePath();
  //ctx.fill("nonzero");
  //ctx.stroke();

  // Draw teal blob shape
  ctx.fillStyle = "rgba(0, 194, 178, 0.86)";
  ctx.beginPath();
  ctx.moveTo(435.879, 103.292);
  ctx.bezierCurveTo(436.636, 112.928, 442.542, 123.37, 452.112, 126.463);
  ctx.bezierCurveTo(459.099, 128.72, 466.973, 127.002, 472.652, 122.231);
  ctx.bezierCurveTo(479.452, 116.52, 481.961, 106.579, 480.992, 97.769);
  ctx.bezierCurveTo(480.84, 96.384, 480.016, 95.289, 478.595, 95.247);
  ctx.bezierCurveTo(473.939, 95.111, 469.282, 95.025, 464.624, 94.992);
  ctx.bezierCurveTo(462.355, 94.976, 460.086, 94.973, 457.816, 94.982);
  ctx.bezierCurveTo(453.876, 94.997, 449.95, 95.31, 446.016, 95.48);
  ctx.bezierCurveTo(443.9, 95.572, 438.926, 94.651, 437.082, 95.889);
  ctx.bezierCurveTo(436.072, 96.566, 436.053, 98.228, 435.931, 99.319);
  ctx.bezierCurveTo(435.784, 100.636, 435.775, 101.971, 435.879, 103.292);
  ctx.closePath();
  ctx.fill("nonzero");
  //ctx.stroke();

  // Draw yellow blob shape
  ctx.fillStyle = "rgb(253,250,200)";
  ctx.beginPath();
  ctx.moveTo(438.617, 126.877);
  ctx.bezierCurveTo(438.726, 125.949, 438.827, 124.938, 439.536, 124.249);
  ctx.bezierCurveTo(440.28, 123.525, 441.622, 123.453, 442.594, 123.293);
  ctx.bezierCurveTo(443.65, 123.119, 444.666, 123.079, 445.731, 123.206);
  ctx.bezierCurveTo(446.381, 123.284, 447.051, 123.371, 447.585, 123.692);
  ctx.bezierCurveTo(451.506, 123.282, 455.898, 123.535, 457.968, 123.528);
  ctx.bezierCurveTo(459.952, 123.52, 461.936, 123.523, 463.92, 123.537);
  ctx.bezierCurveTo(467.992, 123.564, 472.064, 123.636, 476.134, 123.748);
  ctx.bezierCurveTo(477.377, 123.783, 478.097, 124.693, 478.23, 125.844);
  ctx.bezierCurveTo(479.077, 133.165, 476.884, 141.425, 470.939, 146.171);
  ctx.bezierCurveTo(465.973, 150.135, 459.089, 151.563, 452.981, 149.687);
  ctx.bezierCurveTo(446.051, 147.559, 440.569, 140.525, 438.973, 133.18);
  ctx.bezierCurveTo(438.513, 131.068, 438.376, 128.931, 438.617, 126.877);
  ctx.closePath();
  ctx.fill("nonzero");
  //ctx.stroke();
  //ctx.restore(); 
}