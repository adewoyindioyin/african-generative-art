let grfx;
let shapes = [];
let minSize = 50; 
let ctxt;   
 
function setup() {
	createCanvas(600, 600); 
	rectMode(CENTER); 
	imageMode(CENTER);
	ctxt = drawingContext;
	let margin = width * 0.12;
	divideRect(margin, margin, width - (margin * 2), height - (margin * 2));

	grfx = createGraphics(width, height);
	grfx.rectMode(CENTER);
	grfx.noStroke(0);
	let padding = 8; 
	for (let i of shapes) {
		let opt = int(random(2));
		let circleSize = (min(i.w, i.h) - padding) * 0.75;
		let rectCorner = min(i.w, i.h) * 0.25;
		grfx.push();
		grfx.translate(i.x, i.y);
		if (opt == 0) {
			grfx.noStroke();
			grfx.fill(255);
			grfx.rect(0, 0, i.w - padding, i.h - padding, random([0, rectCorner]), random([0, rectCorner]), random([0, rectCorner]), random([0, rectCorner]));
			grfx.erase();
			grfx.circle(0, 0, circleSize);
			grfx.noErase();
		}             

		else if (opt == 1) {
			grfx.noStroke();
			grfx.fill(255);
			grfx.circle(0, 0, circleSize);
		}
		grfx.pop();
	}
	background(0);

	ctxt.shadowBlur = 5
	ctxt.shadowColor = '#00ffffd0'
	ctxt.shadowOffsetX = 8;
	noStroke();
	fill(255);
	rect(width/2, height/2, width - margin, height - margin);
	ctxt.shadowColor = '#ff0000d0'
	ctxt.shadowOffsetX = -8;
	rect(width/2, height/2, width - margin, height - margin); 

	ctxt.shadowBlur = 5
	ctxt.shadowColor = '#00ffffd0' 
	ctxt.shadowOffsetX = 8;
	image(grfx, (width / 2), (height / 2));
	ctxt.shadowColor = '#ff0000d0'
	ctxt.shadowOffsetX = -8;
	tint(0);
	image(grfx, (width / 2), (height / 2));

}          

function draw() {
   }

function divideRect(x, y, w, h) {     
	let p = map(max(w, h), 0, width * 0.75, 0.5, 1);
	if (w > minSize && h > minSize && random() < p) {
		if (w >= h) {
			let rndw = random(0.2, 0.8) * w;
			divideRect(x, y, rndw, h);
			divideRect(x + rndw, y, w - rndw, h);
		}
		if (w < h) {
			let rndh = random(0.2, 0.8) * h;
			divideRect(x, y, w, rndh);
			divideRect(x, y + rndh, w, h - rndh);
		}
	} else { 
		shapes.push({ x: x + w / 2, y: y + h / 2, w: w, h: h });
	}
}        