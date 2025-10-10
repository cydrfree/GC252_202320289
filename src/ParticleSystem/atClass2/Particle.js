class Particle {
  pos;
  y;
  w;
  h;
  angle;
  colour;
  area = 20;
  constructor(posX, posY, velAngleRange, speed, area, minSize = 4) {
    this.pos = createVector(posX, posY);
    const randomAngle = random(-0.5 * velAngleRange, 0.5 * velAngleRange);
    this.vel = createVector(speed, 0);
    this.vel.rotate(radians(randomAngle));
    this.h = area / this.w;
    this.angle = random(360);
    const paletteIdx = floor(random(palette.length));
    this.colour = palette[paletteIdx];
  }

  applyGravity(g) {
    this.acc.add(g);
  }

  update() {
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.set(0, 0);
  }

  drawRect() {
    fill(this.colour);
    noStroke();
    push();
    translate(this.pos.x, this.pos.y); //위치값.
    rotate(radians(this.angle)); //각도값.
    rect(-0.5 * this.w, -0.5 * this.h, this.w, this.h);
    pop();
  }
}
