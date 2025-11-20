class Point {
  constructor(x, y, thickness, options) {
    this.pos = createVector(x, y);
    this.thickness = thickness;
    this.distConstraint = options.distConstraint || 30;
    this.heading = 0;
  }

  setPos(pos) {
    this.pos.set(pos);
  }

  setHeading(heading) {
    this.heading = heading;
  }

  constrainedBy(other, isStrong = false) {
    const toMe = p5.Vector.sub(this.pos, other.pos);

    if (isStrong || toMe.mag() > other.distConstraint) {
      toMe.setMag(other.distConstraint);
      const newPos = p5.Vector.add(toMe, other.pos);
      this.pos.set(newPos);

      this.setHeading(toMe.mult(-1).heading());
    }
  }

  getPointOnThickness(angle) {
    const pointPos = p5.Vector.fromAngle(this.heading + angle);
    pointPos.setMag(0.5 * this.thickness);
    pointPos.add(this.pos);
    return pointPos;
  }
}
