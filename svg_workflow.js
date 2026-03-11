// ================================================================
// SVG WORKFLOW — Affinity Designer → p5.js
// ================================================================
// STEP-BY-STEP:
//
//   1. Draw your design in Affinity Designer
//   2. File → Export → SVG (flatten transforms ON)
//   3. Go to: demo.qunee.com/svg2canvas
//   4. Paste your SVG → copy the canvas code output
//   5. Paste it into the CONVERTED CODE section below
//   6. Use the TRANSLATION TABLE to convert it to p5.js
//
// ================================================================
// TRANSLATION TABLE
// Canvas API (what svg2canvas gives you) → p5.js equivalent
// ================================================================
//
//  ctx.save()                        →  push()
//  ctx.restore()                     →  pop()
//  ctx.translate(x, y)               →  translate(x, y)
//  ctx.rotate(angle)                 →  rotate(angle)       // already radians
//  ctx.scale(x, y)                   →  scale(x, y)
//
//  ctx.beginPath()                   →  beginShape()   (or omit — see below)
//  ctx.moveTo(x, y)                  →  (first vertex — just use vertex(x,y))
//  ctx.lineTo(x, y)                  →  vertex(x, y)
//  ctx.closePath()                   →  endShape(CLOSE)
//
//  ctx.bezierCurveTo(cx1,cy1,        →  bezierVertex(cx1,cy1,
//                    cx2,cy2, x,y)                    cx2,cy2, x,y)
//
//  ctx.quadraticCurveTo(cx,cy, x,y)  →  quadraticVertex(cx,cy, x,y)
//
//  ctx.arc(x,y, r, start,end)        →  arc(x,y, r*2,r*2, start,end)
//          ↑ NOTE: canvas arc uses radius, p5 uses diameter (r*2)
//
//  ctx.fillStyle = '#RRGGBB'         →  fill('#RRGGBB')
//  ctx.strokeStyle = '#RRGGBB'       →  stroke('#RRGGBB')
//  ctx.lineWidth = n                 →  strokeWeight(n)
//  ctx.globalAlpha = 0.5             →  (set alpha in fill/stroke colour)
//
//  ctx.fill()                        →  (p5 fills automatically — just set fill() before shape)
//  ctx.stroke()                      →  (p5 strokes automatically — just set stroke() before shape)
//  ctx.fillRect(x,y,w,h)             →  rect(x,y,w,h)
//  ctx.strokeRect(x,y,w,h)          →  rect(x,y,w,h)   (with noFill() + stroke())
//
//  ctx.font = '16px sans-serif'      →  textSize(16); textFont('sans-serif')
//  ctx.fillText('hello', x, y)       →  text('hello', x, y)
//
// ================================================================
// THE CRITICAL DIFFERENCE:
//
// Canvas API draws paths in a MANUAL way:
//   ctx.beginPath()
//   ctx.moveTo(100, 100)
//   ctx.lineTo(200, 100)
//   ctx.lineTo(150, 200)
//   ctx.closePath()
//   ctx.fill()
//
// p5.js equivalent:
//   fill(someColour)
//   beginShape()
//     vertex(100, 100)
//     vertex(200, 100)
//     vertex(150, 200)
//   endShape(CLOSE)
//
// For CURVES from svg2canvas, the pattern is:
//   fill(someColour)
//   beginShape()
//     vertex(startX, startY)          // moveTo → first vertex
//     bezierVertex(cx1,cy1, cx2,cy2, x,y)  // bezierCurveTo
//     bezierVertex(cx1,cy1, cx2,cy2, x,y)  // another curve segment
//   endShape(CLOSE)
//
// ================================================================
// SCALING YOUR DESIGN TO FIT THE CANVAS
//
// SVG files have their own coordinate system (e.g. 0–500 x 0–500).
// Your canvas is 800×800.
// To scale the design to fit, wrap it in push()/translate()/scale()/pop():
//
//   push()
//     let svgW = 500;   // original SVG width  (check the SVG file's viewBox)
//     let svgH = 500;   // original SVG height
//     let scaleX = width  / svgW;
//     let scaleY = height / svgH;
//     let s = min(scaleX, scaleY);      // uniform scale — no distortion
//     translate(width/2, height/2);     // centre on canvas
//     scale(s);
//     translate(-svgW/2, -svgH/2);      // offset so SVG centre = canvas centre
//     drawMyShape();                    // your converted shape function here
//   pop()
//
// ================================================================

// ================================================================
// LIVE EXAMPLE
// This is a Yoruba Ọjà (sash/wrapper) geometric block —
// drawn as you would trace it from an SVG in Affinity.
// Replace drawMyShape() with your own converted paths.
// ================================================================

function setup() {
  createCanvas(800, 800);
  noLoop();
}

function draw() {
  background('#fee9e2');

  // Scale and centre the SVG coordinate space
  push();
    let svgW = 3125;
    let svgH = 2083;
    let s = min(width / svgW, height / svgH) * 0.85;
    translate(width / 2, height / 2);
    scale(s);
    translate(-svgW / 2, -svgH / 2);

    drawMyShape();
  pop();
}

// ================================================================
// drawMyShape() — paste your converted svg2canvas code here.
//
// This example shows a kente-style block — the same kind of shape
// you would get after converting an Affinity path to canvas code
// and then translating to p5.js using the table above.
// ================================================================

function drawMyShape() {
  // Translated from: 7973934-2.svg (via svg2canvas)
  // SVG coordinate space: 3125 × 2083
  // Stroke was rgba(0,0,0,0) throughout — suppress it once here
  noStroke();

  // ── 1. Vertical pole ──────────────────────────────────────────
  fill('#363d60');
  rect(2983.442, 1694.717, 30.392, 247.333);

  // ── 3. Bottom half-bullseye ────────────────────────────────────
  // ctx.clip() has no p5.js equivalent — use the raw 2D context.
  // This clips the circle so only the bottom semicircle shows.
  drawingContext.save();
  drawingContext.beginPath();
  drawingContext.rect(2857.342, 1883.196, 279.487, 123.663);
  drawingContext.clip();

  fill('#363d60');            // outer ring — dark navy
  beginShape();
    vertex(3005.013, 2006.692);
    bezierVertex(3073.221, 2003.171, 3125.659, 1945.025, 3122.138, 1876.817);
    bezierVertex(3118.617, 1808.613, 3060.467, 1756.175, 2992.263, 1759.696);
    bezierVertex(2924.055, 1763.217, 2871.617, 1821.363, 2875.138, 1889.571);
    bezierVertex(2878.659, 1957.775, 2936.809, 2010.213, 3005.013, 2006.692);
  endShape(CLOSE);

  fill('#668b75');            // ring 2 — green
  beginShape();
    vertex(3003.663, 1980.496);
    bezierVertex(3057.4,   1977.721, 3098.717, 1931.909, 3095.942, 1878.171);
    bezierVertex(3093.167, 1824.433, 3047.354, 1783.117, 2993.617, 1785.892);
    bezierVertex(2939.875, 1788.667, 2898.559, 1834.48,  2901.334, 1888.217);
    bezierVertex(2904.109, 1941.954, 2949.926, 1983.271, 3003.663, 1980.496);
  endShape(CLOSE);

  fill('#faa862');            // ring 3 — orange
  beginShape();
    vertex(3002.021, 1948.688);
    bezierVertex(3038.192, 1946.817, 3065.996, 1915.984, 3064.129, 1879.813);
    bezierVertex(3062.262, 1843.642, 3031.429, 1815.838, 2995.258, 1817.701);
    bezierVertex(2959.083, 1819.572, 2931.279, 1850.405, 2933.15,  1886.576);
    bezierVertex(2935.013, 1922.747, 2965.85,  1950.555, 3002.021, 1948.689);
  endShape(CLOSE);

  fill('#fee9e2');            // ring 4 — peach centre
  beginShape();
    vertex(3000.521, 1919.667);
    bezierVertex(3020.667, 1918.629, 3036.154, 1901.454, 3035.113, 1881.313);
    bezierVertex(3034.075, 1861.167, 3016.901, 1845.68,  2996.755, 1846.721);
    bezierVertex(2976.613, 1847.759, 2961.122, 1864.933, 2962.163, 1885.075);
    bezierVertex(2963.205, 1905.221, 2980.375, 1920.708, 3000.521, 1919.667);
  endShape(CLOSE);

  drawingContext.restore();

  // ── 4. Top half-bullseye ──────────────────────────────────────
  // Clips the circle so only the top semicircle shows.
  drawingContext.save();
  drawingContext.beginPath();
  drawingContext.rect(2862.121, 1631.671, 279.483, 123.663);
  drawingContext.clip();

  fill('#d7623e');            // outer ring — red
  beginShape();
    vertex(2992.387, 1631.837);
    bezierVertex(2924.179, 1635.358, 2871.741, 1693.508, 2875.262, 1761.712);
    bezierVertex(2878.787, 1829.916, 2936.933, 1882.354, 3005.137, 1878.833);
    bezierVertex(3073.346, 1875.312, 3125.779, 1817.162, 3122.258, 1748.958);
    bezierVertex(3118.737, 1680.754, 3060.591, 1628.316, 2992.387, 1631.837);
  endShape(CLOSE);

  fill('#f37650');            // ring 2 — light orange
  beginShape();
    vertex(2993.738, 1658.033);
    bezierVertex(2940,     1660.808, 2898.688, 1706.625, 2901.463, 1760.358);
    bezierVertex(2904.238, 1814.096, 2950.046, 1855.412, 3003.784, 1852.637);
    bezierVertex(3057.526, 1849.862, 3098.838, 1804.05,  3096.063, 1750.312);
    bezierVertex(3093.292, 1696.575, 3047.475, 1655.258, 2993.738, 1658.033);
  endShape(CLOSE);

  fill('#faa862');            // ring 3 — orange
  beginShape();
    vertex(2995.379, 1689.842);
    bezierVertex(2959.212, 1691.713, 2931.404, 1722.55,  2933.271, 1758.717);
    bezierVertex(2935.138, 1794.888, 2965.971, 1822.696, 3002.142, 1820.825);
    bezierVertex(3038.313, 1818.958, 3066.121, 1788.125, 3064.25,  1751.954);
    bezierVertex(3062.388, 1715.783, 3031.55,  1687.975, 2995.379, 1689.841);
  endShape(CLOSE);

  fill('#fee9e2');            // ring 4 — peach centre
  beginShape();
    vertex(2996.875, 1718.858);
    bezierVertex(2976.733, 1719.9,   2961.25,  1737.075, 2962.287, 1757.216);
    bezierVertex(2963.329, 1777.366, 2980.504, 1792.849, 3000.646, 1791.812);
    bezierVertex(3020.788, 1790.77,  3036.279, 1773.595, 3035.233, 1753.454);
    bezierVertex(3034.195, 1733.308, 3017.025, 1717.821, 2996.875, 1718.858);
  endShape(CLOSE);

  drawingContext.restore();

  // ── 5. Thin orange connector bar ──────────────────────────────
  fill('#faa862');
  rect(2982.633, 1882.55, 28.909, 1.233);

  // ── 6. Dark navy horizontal band ──────────────────────────────
  fill('#363d60');
  rect(2874.971, 1853.492, 247.334, 30.396);

  // ── 7. Red horizontal band ────────────────────────────────────
  fill('#d7623e');
  rect(2874.971, 1754.979, 247.334, 30.392);
}

function keyPressed() {
  if (key === 's' || key === 'S') {
    saveCanvas('svg_workflow_test', 'png');
  }
}
