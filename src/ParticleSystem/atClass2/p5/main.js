const palette = ["#59AC77", "#3A6F43", "#FDAAAA", "#FFD5D5"]; // 어레이로 만들면 [] 하나하나 적을일 없이 편해진다. / 하나의 이름에 여러개의 값을 순서대로 넣는 기능. 어레이를 사용할때는, 같은 형식의 데이터를 넣어 사용해야 한다. (예외도 있긴 함.)

let ps = [];

function setup() {
  createCanvas(500, 400);

  for (let n = 0; n < 2000; n++) {
    ps.push(new Particle(0.5 * width, 0.5 * height, 30, random(1, 5), 20));
  }
}

function draw() {
  background(127);
  // for (let idx = 0; idx < ps.length; idx++); {
  //const aParticle = ps[idx];
  //aParticle.drawRect();
  //}
  //for (const Particle of ps) {
  //aParticle.draRect();

  ps.forEach((aParticle, idx) => {
    aParticle.applyGravity(0.01);
    aParticle.update();
    aParticle.drawRect();
  });
}
