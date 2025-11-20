const canvasContainer = document.getElementById("canvas-container");
console.log(canvasContainer);

function setup() {
  const renderer = createCanvas(800, 600);
  renderer.parent(canvasContainer);
}

function draw() {
  background(0);
}
