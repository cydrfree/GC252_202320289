class Vehicle {
  constructor(x, y, isPredator, options) {
    this.pos = createVector(x, y);
    this.vel = p5.Vector.random2D();
    this.acc = createVector(0, 0);
    this.isPredator = isPredator;

    if (this.isPredator) {
      this.maxSpeed = 4.5;
      this.maxForce = 0.2;
      this.color = options.color;
      this.thickness = options.thickness;
      this.distConstraint = options.distConstraint;

      this.spine = [];
      for (let i = 0; i < this.thickness.length; i++) {
        let x = this.pos.x;
        let y = this.pos.y + this.distConstraint * i;
        let ptOptions = { distConstraint: this.distConstraint };
        this.spine.push(new Point(x, y, this.thickness[i], ptOptions));
      }

      this.cwPoints = [];
      this.ccwPoints = [];
      this.headPoints = [];
    } else {
      this.maxSpeed = 4.0;
      this.maxForce = 0.1;
      this.r = 6;
      this.color = color(255, 239, 143);
      this.wanderTheta = random(TWO_PI);
    }
  }

  update() {
    this.vel.add(this.acc);
    this.vel.limit(this.maxSpeed);
    this.pos.add(this.vel);
    this.acc.mult(0);
    this.borders();

    if (this.isPredator) {
      this.spine[0].setPos(this.pos);

      let currentHeadDir = p5.Vector.fromAngle(this.spine[0].heading);

      let targetHeadDir = this.vel.copy();

      let smoothDir = p5.Vector.lerp(currentHeadDir, targetHeadDir, 0.1);

      this.spine[0].setHeading(smoothDir.heading());

      this.spine.forEach((point, idx) => {
        if (idx > 0) {
          point.constrainedBy(this.spine[idx - 1], true);
        }
      });

      this.spine.forEach((point, idx) => {
        this.cwPoints[idx] = point.getPointOnThickness(radians(90));
        this.ccwPoints[this.spine.length - 1 - idx] = point.getPointOnThickness(
          radians(-90)
        );
      });

      let head = this.spine[0];
      this.headPoints[0] = head.getPointOnThickness(radians(-60));
      this.headPoints[1] = head.getPointOnThickness(radians(-30));
      this.headPoints[2] = head.getPointOnThickness(radians(30));
      this.headPoints[3] = head.getPointOnThickness(radians(60));
    }
  }

  applyForce(force) {
    this.acc.add(force);
  }

  seek(target) {
    let desired = p5.Vector.sub(target, this.pos);
    desired.setMag(this.maxSpeed);
    let steer = p5.Vector.sub(desired, this.vel);
    steer.limit(this.maxForce);
    this.applyForce(steer);
  }

  flee(target) {
    let desired = p5.Vector.sub(target, this.pos);
    desired.setMag(this.maxSpeed);
    desired.mult(-1);
    let steer = p5.Vector.sub(desired, this.vel);
    steer.limit(this.maxForce);
    this.applyForce(steer);
  }

  pursue(vehicle) {
    let target = vehicle.pos.copy();
    let prediction = vehicle.vel.copy();
    let d = p5.Vector.dist(this.pos, vehicle.pos);
    let t = d / this.maxSpeed;
    prediction.mult(t);
    target.add(prediction);
    this.seek(target);
  }

  evade(vehicle) {
    let d = p5.Vector.dist(this.pos, vehicle.pos);
    let evadeRadius = this.isPredator ? 0 : 250;
    if (d < evadeRadius) {
      let target = vehicle.pos.copy();
      let prediction = vehicle.vel.copy();
      let t = d / this.maxSpeed;
      prediction.mult(t);
      target.add(prediction);
      this.flee(target);
    }
  }

  wander() {
    let wanderR = 25;
    let wanderD = 80;
    let change = 0.3;
    this.wanderTheta = (this.wanderTheta || 0) + random(-change, change);
    let circlePos = this.vel.copy();
    circlePos.setMag(wanderD);
    circlePos.add(this.pos);
    let h = this.vel.heading();
    let circleOffset = createVector(
      wanderR * cos(this.wanderTheta + h),
      wanderR * sin(this.wanderTheta + h)
    );
    let target = p5.Vector.add(circlePos, circleOffset);

    let speedFactor = this.isPredator ? 0.6 : 1.0;

    let desired = p5.Vector.sub(target, this.pos);
    desired.setMag(this.maxSpeed * speedFactor);
    let steer = p5.Vector.sub(desired, this.vel);
    steer.limit(this.maxForce);
    this.applyForce(steer);
  }

  applyFlocking(vehicles) {
    let sep = this.separate(vehicles);
    let ali = this.align(vehicles);
    let coh = this.cohesion(vehicles);
    sep.mult(2.5);
    ali.mult(1.0);
    coh.mult(1.0);
    this.applyForce(sep);
    this.applyForce(ali);
    this.applyForce(coh);
  }

  separate(vehicles) {
    let desiredSeparation = 20.0;
    let steer = createVector(0, 0);
    let count = 0;
    for (let other of vehicles) {
      let d = p5.Vector.dist(this.pos, other.pos);
      if (d > 0 && d < desiredSeparation) {
        let diff = p5.Vector.sub(this.pos, other.pos);
        diff.normalize();
        diff.div(d);
        steer.add(diff);
        count++;
      }
    }
    if (count > 0) {
      steer.div(count);
      if (steer.mag() > 0) {
        steer.setMag(this.maxSpeed);
        steer.sub(this.vel);
        steer.limit(this.maxForce);
      }
    }
    return steer;
  }

  align(vehicles) {
    let neighborDist = 50;
    let sum = createVector(0, 0);
    let count = 0;
    for (let other of vehicles) {
      let d = p5.Vector.dist(this.pos, other.pos);
      if (d > 0 && d < neighborDist) {
        sum.add(other.vel);
        count++;
      }
    }
    if (count > 0) {
      sum.div(count);
      sum.setMag(this.maxSpeed);
      let steer = p5.Vector.sub(sum, this.vel);
      steer.limit(this.maxForce);
      return steer;
    }
    return createVector(0, 0);
  }

  cohesion(vehicles) {
    let neighborDist = 50;
    let sum = createVector(0, 0);
    let count = 0;
    for (let other of vehicles) {
      let d = p5.Vector.dist(this.pos, other.pos);
      if (d > 0 && d < neighborDist) {
        sum.add(other.pos);
        count++;
      }
    }
    if (count > 0) {
      sum.div(count);
      return this.seekSteer(sum);
    }
    return createVector(0, 0);
  }

  seekSteer(target) {
    let desired = p5.Vector.sub(target, this.pos);
    desired.setMag(this.maxSpeed);
    let steer = p5.Vector.sub(desired, this.vel);
    steer.limit(this.maxForce);
    return steer;
  }

  findClosest(list) {
    let closest = null;
    let recordDist = Infinity;
    for (let v of list) {
      let d = p5.Vector.dist(this.pos, v.pos);
      if (d < recordDist && d < 400) {
        recordDist = d;
        closest = v;
      }
    }
    return closest;
  }

  borders() {
    let margin = 50;
    if (this.pos.x < -margin) this.pos.x = width + margin;
    if (this.pos.y < -margin) this.pos.y = height + margin;
    if (this.pos.x > width + margin) this.pos.x = -margin;
    if (this.pos.y > height + margin) this.pos.y = -margin;
  }

  display() {
    drawingContext.shadowBlur = 2;
    drawingContext.shadowColor = this.color;

    if (this.isPredator) {
      push();
      noStroke();
      fill(this.color);

      beginShape();
      this.cwPoints.forEach((point) => curveVertex(point.x, point.y));
      this.ccwPoints.forEach((point) => curveVertex(point.x, point.y));
      this.headPoints.forEach((point) => curveVertex(point.x, point.y));
      endShape(CLOSE);

      let head = this.spine[0];
      translate(head.pos.x, head.pos.y);
      rotate(head.heading);
      fill("#ffffff");
      let eyeSize = this.thickness[0] * 0.2;
      circle(0, this.thickness[0] * 0.25, eyeSize);
      circle(0, -this.thickness[0] * 0.25, eyeSize);
      pop();
    } else {
      let theta = this.vel.heading() + PI / 2;
      push();
      translate(this.pos.x, this.pos.y);
      rotate(theta);
      noStroke();
      fill(this.color);
      ellipse(0, 0, this.r, this.r * 2);
      pop();
    }
    drawingContext.shadowBlur = 0;
  }
}
