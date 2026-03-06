// Template
function setup() {
  // Set canvas size
  createCanvas(750, 750);
  // Set color mode (HSB recommended)
  colorMode(HSB, 360, 100, 100, 100);
  // Set angle mode from radians to degrees
  angleMode(DEGREES);
  // Set background color
  background(0, 0, 95);

line(0,height/2,  width,height/2);

strokeWeight(10)
stroke('red')
  point(width/2, height/2)
 ellipseMode(CORNER);

 strokeWeight(1);
 stroke('black') 
 noFill(); 
const size = width * 0.3;
ellipse(width/2, height/2, size, size);
} 

