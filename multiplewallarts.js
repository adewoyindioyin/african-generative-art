let w, h, w_offset, h_offset, margin;
let frame = 3;
let frames = [];
let shadowGraphicsBack;
let shadowGraphicsFront;
let window_num;
function setup() {
  createCanvas(windowWidth, windowHeight);
  window_num = 5;

  colorMode(HSB, 360, 100, 100, 100);

  init();
}

function init() {
  if (width > height) {
    frame = 5;
  } else {
    frame = 4;
  }
  shuffle(colorScheme, true);
  shadowGraphicsBack = createGraphics(width, height);
  shadowGraphicsFront = createShadowGraphics(width, height);

  w_offset = min(width, height) / 8;
  h_offset = min(width, height) / 4;
  margin = w_offset / 5;
  w = (width - w_offset * 2 - margin * (frame - 1)) / frame;
  h = height - h_offset * 2;
  frames = [];
  for (let i = 0; i < frame; i++) {
    let x = w_offset + i * (w + margin);
    let y = h_offset;
    let f = new Frame(x, y, w, h, 20, colorScheme[i].colors);
    frames.push(f);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  shadowGraphicsFront.remove();
  shadowGraphicsBack.remove();
  init();
}

function createShadowGraphics(w, h) {
  let g = createGraphics(w, h);

  let window_w = w / 2;
  let window_h = h;
  let window_margin = min(window_w, window_h) / 12;
  let gradient = g.drawingContext.createLinearGradient(0,0,w,h);
  gradient.addColorStop(0,color(0,0));
  gradient.addColorStop(1,color(0,50));
  g.drawingContext.fillStyle = gradient;
  g.rect(0,0,width,height);
  let shadowPoint = createVector(
    -((g.random() * g.width) / 2),
    -(g.random() * g.height) / 2
  );
  g.push();
  g.translate(shadowPoint.x, shadowPoint.y);
  g.shearY(PI / 8);
  // g.shearX(PI / 89);
  for (let j = 0; j < 1; j++) {
    for (let i = 0; i < window_num; i++) {
      let x = i * (window_w + window_margin);
      let y = j * (window_h + window_margin);
      g.erase();
      g.rect(x, y, window_w, window_h);
      g.noErase();
    }
  }
  return g;
}

function draw() {
  blendMode(BLEND);
  background(0, 0, 90);
  shadowGraphicsBack.clear();
  for (let f of frames) {
    f.drawLongShadow(false);
    f.drawLongShadow(true);
  }
  image(shadowGraphicsBack, 0, 0);
  for (let f of frames) {
    randomSeed(f.rs);
    noiseSeed(f.rs);
    // rect(f.x,f.y,f.w,f.h);
    f.drawBlocks();
  }

  blendMode(MULTIPLY);
  push();
  drawingContext.filter = "blur(15px)";
  image(
    shadowGraphicsFront,
    -30,
    -30,
    shadowGraphicsFront.width + 60,
    shadowGraphicsFront.height + 60
  );
  pop();
}

class Frame {
  constructor(x, y, w, h, block_num, colors) {
    this.rs = random(10000);
    // print(x,y,w,h,block_num)
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.block_size = w / block_num;
    this.matte_block_num = 3;
    this.offset_w = 0;
    this.block_num_w = int((w - this.offset_w * 2) / this.block_size);
    this.offset_h = this.offset_w;
    this.block_num_h = int((h - this.offset_h * 2) / this.block_size);
    this.rs = w * h;
    this.window_num = int(random(2, 5));
    this.palette = shuffle(colors.concat());
    this.nx = random(width);
    this.ny = random(height);
    this.ns = int(random(100, 1500));
    this.shape_arr = shuffle([0, 1, 2, 3, 4,5]);
  }

  drawLongShadow(bool = true, theta = PI / 4) {
    let y = this.y + this.block_size * this.block_num_h;
    let p1 = createVector(this.x + this.w - 1, this.y + 1);
    let p2 = createVector(this.x + this.w - 1, y + 1);
    let p3 = createVector(this.x - 1, y + 1);
    let g = shadowGraphicsBack.drawingContext.createLinearGradient(
      0,0,
      width,
      height
    );
    g.addColorStop(0, color(0, 0, 0, 30));
    g.addColorStop(1, color(0, 0, 0, 0));

    let p = [p1, p2, p3];
    shadowGraphicsBack.push();
    if (bool == false) {
      shadowGraphicsBack.erase(255,0);
    } else {
      shadowGraphicsBack.noErase();
      shadowGraphicsBack.drawingContext.fillStyle = g;
      shadowGraphicsBack.noStroke();
      shadowGraphicsBack.blendMode(MULTIPLY);
    }
    shadowGraphicsBack.beginShape();
    shadowGraphicsBack.vertex(p[0].x, p[0].y);
    shadowGraphicsBack.vertex(p[1].x, p[1].y);
    shadowGraphicsBack.vertex(p[2].x, p[2].y);
    p[0].add(p5.Vector.fromAngle(theta).mult(max(this.w, this.h) * 2));
    p[1].add(p5.Vector.fromAngle(theta).mult(max(this.w, this.h) * 2));
    p[2].add(p5.Vector.fromAngle(theta).mult(max(this.w, this.h) * 2));
    shadowGraphicsBack.vertex(p[2].x, p[2].y);
    shadowGraphicsBack.vertex(p[1].x, p[1].y);
    shadowGraphicsBack.vertex(p[0].x, p[0].y);
    shadowGraphicsBack.endShape();
    shadowGraphicsBack.pop();
    shadowGraphicsBack.blendMode(BLEND);
  }

  drawBlock(block_pos, x, y, block_size) {
    push();
    switch (block_pos) {
      case "CORNER":
        noStroke();
        fill(0, 0, 20);
        rect(x - 1, y - 1, block_size + 2);
        break;
      case "BORDER":
        noStroke();
        fill(0, 0, 20);
        rect(x - 1, y - 1, block_size + 2);
        break;
      case "MATTE":
        noStroke();
        fill(0, 0, 100);
        rect(x - 1, y - 1, block_size + 2);
        break;
      case "NORMAL":
        noStroke();
        let n = int(
          noise(
            this.x + this.nx + this.w / 2 + (x / this.w) * 5,
            this.y + this.ny + this.h / 2 + (y / this.h) * 5,
            frameCount / this.ns
          ) *
            this.palette.length *
            3
        );
        let n2 = int(
          shadowGraphicsBack.noise(
            this.x + this.nx + this.w / 2 + (x / this.w) * 5,
            this.y + this.ny + this.h / 2 + (y / this.h) * 5,
            frameCount / this.ns
          ) * 4
        );

        push();
        translate(x + block_size / 2, y + block_size / 2);
        rotate(int(random(4)) * TWO_PI / 4);
        // fill(0);
        // rectMode(CENTER);
        // rect(0,0,block_size,block_size);
        fill(this.palette[n % this.palette.length]);
        noStroke();
        switch (n2) {
          case this.shape_arr[0]:
            arc(
              -block_size / 2,
              -block_size / 2,
              block_size * 2,
              block_size * 2,
              0,
              PI / 2
            );
            break;
          case this.shape_arr[1]:
            triangle(
              -block_size / 2,
              -block_size / 2,
              +block_size / 2,
              -block_size / 2,
              -block_size / 2,
              +block_size / 2
            );
            break;
          case this.shape_arr[2]:
            rectMode(CENTER);
            rect(0, 0, block_size / 2, block_size / 2);
            break;
          case this.shape_arr[3]:
            circle(0, 0, block_size / 2);
            break;
          case this.shape_arr[4]:
            arc(0, -block_size / 2, block_size, block_size, 0, PI);
            fill(this.palette[(n + 1) % this.palette.length]);
            arc(0, +block_size / 2, block_size, block_size, PI, TWO_PI);
            break;
          case this.shape_arr[5]:
            arc(-block_size/2, -block_size / 2, block_size*sqrt(2), block_size*sqrt(2), 0, PI/2);
            fill(this.palette[(n + 1) % this.palette.length]);
            arc(+block_size/2, +block_size / 2, block_size*sqrt(2), block_size*sqrt(2), PI, PI/2+PI);
            break;
        }
        pop();
        break;
    }
    pop();
  }

  drawBlocks() {
    push();
    translate(this.x, this.y);
    fill(0, 0, 90);
    rect(
      0,
      0,
      this.block_num_w * this.block_size,
      this.block_num_h * this.block_size
    );
    for (let j = 0; j < this.block_num_h; j++) {
      for (let i = 0; i < this.block_num_w; i++) {
        let x = this.offset_w + i * this.block_size;
        let y = this.offset_h + j * this.block_size;
        let block_pos = this.getBlockPosition(i, j);
        this.drawBlock(block_pos, x, y, this.block_size);
      }
    }
    pop();
  }

  getBlockPosition(i, j) {
    if (
      (i == 0 && j == 0) ||
      (i == 0 && j == this.block_num_h - 1) ||
      (i == this.block_num_w - 1 && j == this.block_num_h - 1) ||
      (i == this.block_num_w - 1 && j == 0)
    ) {
      return "CORNER";
    } else if (
      i == 0 ||
      j == this.block_num_h - 1 ||
      i == this.block_num_w - 1 ||
      j == 0
    ) {
      return "BORDER";
    } else if (
      i < this.matte_block_num ||
      j > this.block_num_h - 1 - this.matte_block_num ||
      i > this.block_num_w - 1 - this.matte_block_num ||
      j < this.matte_block_num
    ) {
      return "MATTE";
    } else {
      return "NORMAL";
    }
  }

  draw() {
    this.drawBlocks();
  }
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
