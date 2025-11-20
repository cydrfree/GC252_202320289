let preys = [];
let predators = [];

function setup() {
  let canvas = createCanvas(windowWidth * 0.9, windowHeight * 0.9);
  canvas.parent("canvas-container");

  for (let i = 0; i < 60; i++) {
    preys.push(new Vehicle(random(width), random(height), false, null));
  }

  let pinkSnakeOpts = {
    color: color(255, 155, 208),
    thickness: [30, 40, 35, 35, 35, 35, 35, 35, 35, 35, 30, 25, 20, 15, 10, 5],
    distConstraint: 12,
  };
  predators.push(new Vehicle(width * 0.3, height / 2, true, pinkSnakeOpts));

  let blueSnakeOpts = {
    color: color(135, 206, 235),
    thickness: [35, 50, 45, 45, 45, 45, 45, 45, 45, 45, 40, 35, 30, 25, 20, 10],
    distConstraint: 15,
  };
  predators.push(new Vehicle(width * 0.5, height / 2, true, blueSnakeOpts));

  let greenSnakeOpts = {
    color: color(152, 251, 152),
    thickness: [60, 80, 75, 75, 75, 75, 75, 75, 75, 75, 75, 75, 60, 45, 30, 15],
    distConstraint: 20,
  };
  predators.push(new Vehicle(width * 0.7, height / 2, true, greenSnakeOpts));
}
function draw() {
  let gradient = drawingContext.createLinearGradient(0, 0, 0, height);

  gradient.addColorStop(0, "rgba(0, 150, 255, 0.4)");

  gradient.addColorStop(1, "rgba(0, 10, 50, 0.7)");

  drawingContext.fillStyle = gradient;
  drawingContext.fillRect(0, 0, width, height);

  for (let predator of predators) {
    let target = predator.findClosest(preys);
    if (target) {
      predator.pursue(target);
    } else {
      predator.wander();
    }
    predator.update();
    predator.display();
  }

  for (let v of preys) {
    v.applyFlocking(preys);
    v.wander();

    for (let predator of predators) {
      v.evade(predator);
    }

    v.update();
    v.display();
  }
}

function windowResized() {
  resizeCanvas(windowWidth * 0.9, windowHeight * 0.9);
}
