const elem = document.querySelector("#matter-box");
console.log(elem);

// module aliases 모듈들을 불러오는 파트이다. var를 let, const로 바꿔도 문제없이 작동한다.
// var Engine = Matter.Engine,
//   Render = Matter.Render,
//   Runner = Matter.Runner,
//   Bodies = Matter.Bodies,
//   Composite = Matter.Composite;
const { Engine, Render, Runner, Bodies, Composite } = Matter;

// create an engine
const engine = Engine.create();

// create a renderer
const render = Render.create({
  element: elem,
  engine: engine,
});

// create two boxes and a ground
const boxA = Bodies.rectangle(400, 200, 80, 80);
const boxB = Bodies.rectangle(450, 50, 80, 80);
const ground = Bodies.rectangle(400, 610, 810, 60, { isStatic: true });

// add all of the bodies to the world 위에 만들어놨던 bodies를 월드안에 불러온것이다.
Composite.add(engine.world, [boxA, boxB, ground]);

// run the renderer
Render.run(render);

// create runner 이부분이 없으면 시간이 흐르지 않는다..더월드!!!!!!!!
var runner = Runner.create();

// run the engine
Runner.run(runner, engine);
