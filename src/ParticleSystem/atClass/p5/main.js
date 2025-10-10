const palette = ["#59AC77", "#3A6F43", "#FDAAAA", "#FFD5D5"]; // 어레이로 만들면 [] 하나하나 적을일 없이 편해진다. / 하나의 이름에 여러개의 값을 순서대로 넣는 기능. 어레이를 사용할때는, 같은 형식의 데이터를 넣어 사용해야 한다. (예외도 있긴 함.)
let x, y; // let은 값이 계속 바뀔일이 있다. const는 코드가 작동 중 바뀔일이 없음.
let w, h;
let angle;
let colour; //color 라는 p5.js 함수랑 충돌할수있어서 colour사용
const area = 10; //무조건 10이라는 사각형을 만들고싶다는 변수 (가로세로가 어쨋든 10이라는 숫자안에서만들어짐)

function setup() {
  //셋업은 코드 실행시 딱 1번만 실행된다
  createCanvas(500, 400);
}

function drawRect() {
  // 4각형은 x,y 2개 (위치값,어디에 그릴지!), + 길이에 대한 값 2개(크기가 어느정도일지) = 총 4개의 데이터가 필요하다.
  fill(colour);
  noStroke();
  push();
  translate(x, y); //위치값.
  rotate(radians(angle)); //각도값.
  rect(-0.5 * w, -0.5 * h, w, h); //크기값./수학에서 0,0 은 왼쪽밑이지만 대부분의 소프트웨어에서 0,0은 왼쪽위이고, y는 아래로갈수록 숫자가 커짐. 위로 갈수록 작아지는 시스템.
  pop();
}

function draw() {
  randomSeed(0);
  background(127); // 4각형은 x,y 2개 (위치값,어디에 그릴지!), + 길이에 대한 값 2개(크기가 어느정도일지) = 총 4개의 데이터가 필요하다.
  for (let n = 0; n < 1000; n++) {
    x = random(width); // drawRect가 실행되기 전에 데이터가 필요
    y = random(height);
    w = random(10, area); // area보다는 작은 범위에서 작은 4각형이 랜덤으로 나오게한다. area들어가기 전에 최솟값을 줘서 0을 방지한다.
    h = area / w; //다양한 면적인데 10만을 가지고 가로세로 나눠지는 랜덤사각형이 나오는것.
    angle = random(360); //360을 넣어놔도 위에 radians에서 알아서 처리해주니까 괜찮다.
    //colour = pallete[random(palette.length)]; // []어레이 안에 숫자를 넣어서 사용할 수 있다. const pallete 안의(length) 정보들을 가져온다.
    let paletteIdx = floor(random(palette.length)); // floor 을 사용 소수들을 내림처리해서 정수화, 5는 안나오게함.
    colour = palette[paletteIdx]; //Idx 사용해서 가독성 높힌버전.근데 예를들어 데이터가 5까지 있으면, 4.999999까지만 나타낸다... 실제로는 0부터 4까지만 나온다. 0,1,2,3,4. 정수화 시켜야하고, 5는 안 나오도록 해야한다.
    drawRect();
  }
}
