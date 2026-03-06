let circles = [];
let totalCircles = 500;
let palette; 
let attempts = 0;

function setup() { 
  createCanvas(600, 600);  
  palette = shuffle(random(colorScheme).colors.concat());
  for (let j = 0; j < palette.length; j++) {
    palette[j] = color(palette[j]);
  }
  let d = width/2 * 0.8; 

  while (circles.length < totalCircles && attempts < 10000) {
    let theta = random(TWO_PI);
    let r = random(d);
    let newCircle = {
      c: shuffle(palette.concat()),
      theta: theta,
      r: r,
      ox: width/2,
      oy: height/2,
      x: width / 2 + cos(theta) * r,
      y: height / 2 + sin(theta) * r,
      d:  random(max(width, height) / 10),
      count: int(random(1, 5)),
    };

    let overlapping = false;
    for (let circle of circles) {
      let d = dist(newCircle.x, newCircle.y, circle.x, circle.y);
      if (d < newCircle.d / 2 + circle.d / 2) {
        overlapping = true;
        break;
      }
    }
    if (!overlapping) {
      circles.push(newCircle);
    } else {
      attempts++;
    }
  }
  circles.sort(function (a, b) {
    a.theta > b.theta;
  });
  circles.sort(function (a, b) {
    a.r > b.r;
  });
}

function draw() {
  background((90 / 100) * 255);

  // Draw black frame and outer margin
  let margin = 25; // Margin size
  fill(200);
  noStroke();
  rect(0, 0, width, margin); // Top margin
  rect(0, height - margin, width, margin); // Bottom margin
  rect(0, 0, margin, height); // Left margin
  rect(width - margin, 0, margin, height); // Right margin

  stroke(0, 0, 33);
  for (let obj of circles) {
    push();
    // translate(obj.x,obj.y);
    for (let i = 0; i < obj.count; i++) {
      let g = drawingContext.createLinearGradient(0, 0, obj.x, obj.y);
      g.addColorStop(0, obj.c[i % obj.c.length]);
      g.addColorStop(1, obj.c[(i + 1) % obj.c.length]);
      drawingContext.fillStyle = g;
      drawingContext.shadowColor = color(0, 0, 0, 33);
      drawingContext.shadowBlur = width / 50;
      let scl = constrain(map(i, 0, obj.count, 1, 0), 0, 1);
      let d2 = (obj.d / 2) * scl;

      beginShape();
      triangle(
        obj.ox,
        obj.oy,
        obj.x + cos(obj.theta + PI / 2) * d2,
        obj.y + sin(obj.theta + PI / 2) * d2,
        obj.x + cos(obj.theta - PI / 2) * d2,
        obj.y + sin(obj.theta - PI / 2) * d2
      );
      endShape(CLOSE);  
    }
    pop();
  }
  // noStroke();
  for (let obj of circles) {
    for (let i = 0; i < obj.count; i++) {
      let scl = constrain(map(i, 0, obj.count, 1, 0), 0, 1);
      let g = drawingContext.createRadialGradient(
        obj.x,
        obj.y,
        0,
        obj.x,
        obj.y, 
        abs(obj.d) * scl
      );
      g.addColorStop(0, obj.c[i % obj.c.length]);
      g.addColorStop(1, obj.c[(i + 1) % obj.c.length]);
      drawingContext.fillStyle = g;
      drawingContext.shadowColor = color(0, 0, 0, 33);
      drawingContext.shadowBlur = width / 50;
      circle(obj.x, obj.y, obj.d * scl);
    }
  }
  noLoop();
}

let colorScheme = [
  {
    name: "Benedictus",
    colors: ["#F27EA9", "#366CD9", "#5EADF2", "#636E73", "#F2E6D8"],
  },
  {
    name: "Cross",
    colors: ["#D962AF", "#58A6A6", "#8AA66F", "#F29F05", "#F26D6D"],
  },
  {
    name: "Demuth",
    colors: ["#222940", "#D98E04", "#F2A950", "#BF3E21", "#F2F2F2"],
  },
  {
    name: "Hiroshige",
    colors: ["#1B618C", "#55CCD9", "#F2BC57", "#F2DAAC", "#F24949"],
  },
  {
    name: "Hokusai",
    colors: ["#074A59", "#F2C166", "#F28241", "#F26B5E", "#F2F2F2"],
  },
  {
    name: "Hokusai Blue",
    colors: ["#023059", "#459DBF", "#87BF60", "#D9D16A", "#F2F2F2"],
  },
  {
    name: "Java",
    colors: ["#632973", "#02734A", "#F25C05", "#F29188", "#F2E0DF"],
  },
  {
    name: "Kandinsky",
    colors: ["#8D95A6", "#0A7360", "#F28705", "#D98825", "#F2F2F2"],
  },
  {
    name: "Monet",
    colors: ["#4146A6", "#063573", "#5EC8F2", "#8C4E03", "#D98A29"],
  },
  {
    name: "Nizami",
    colors: ["#034AA6", "#72B6F2", "#73BFB1", "#F2A30F", "#F26F63"],
  },
  {
    name: "Renoir",
    colors: ["#303E8C", "#F2AE2E", "#F28705", "#D91414", "#F2F2F2"],
  },
  {
    name: "VanGogh",
    colors: ["#424D8C", "#84A9BF", "#C1D9CE", "#F2B705", "#F25C05"],
  },
  {
    name: "Mono",
    colors: ["#D9D7D8", "#3B5159", "#5D848C", "#7CA2A6", "#262321"],
  },
  {
    name: "RiverSide",
    colors: ["#906FA6", "#025951", "#252625", "#D99191", "#F2F2F2"],
  },
];
