function setup() {
  createCanvas(600, 600);
  angleMode(DEGREES); // 각도를 360도 기준으로 계산하게 해주는 코드 (라디안 단위말고 Degrees는 한바퀴를 숫자 360으로 계산)

  initial[0] = (hour() % 12) * 30 + minute() * 0.5;
  initial[1] = minute() * 6 + second() * 0.1;
  initial[2] = second() * 6;
}

const initial = [0, 0, 0];
const demoTime = [0, 0, 0];
const demoAngle = [0, 0, 0];

function draw() {
  demoAngle[2] = (initial[2] + millis() * 0.006) % 360;

  demoAngle[1] = (initial[1] + millis() * 0.0001) % 360;

  demoAngle[0] = (initial[0] + millis() * (30 / 3600000)) % 360;

  let hAngle = demoAngle[0];
  let mAngle = demoAngle[1];
  let sAngle = demoAngle[2];

  background(300);

  translate(width / 2, height / 2); //캔버스 가운데로오게
  rotate(-90); //12시방향부터 시작하도록보정

  //마스크효과
  // 분침 초침사이 마스크
  let diffMS = (mAngle - sAngle + 360) % 360;
  noStroke();
  fill(0); // 검은색으로 채우기

  if (diffMS < 180) {
    arc(0, 0, 340, 340, mAngle, sAngle + 180, PIE);
  } else {
    arc(0, 0, 340, 340, sAngle, mAngle + 180, PIE);
  }

  // 시침 초침사이 마스크
  let diffHS = (hAngle - sAngle + 360) % 360;
  fill(0);

  if (diffHS < 180) {
    arc(0, 0, 200, 200, hAngle, sAngle + 180, PIE);
  } else {
    arc(0, 0, 200, 200, sAngle, hAngle + 180, PIE);
  }

  noFill();
  stroke(0);

  //초
  push();
  rotate(sAngle);
  strokeWeight(3);
  arc(0, 0, 480, 480, 0, 180, PIE);
  noStroke();
  fill(214, 51, 17);
  // 반지름 + 25만큼띄우기
  ellipse(265, 0, 15, 15);
  pop();

  //분
  push();
  rotate(mAngle);
  strokeWeight(5); //
  arc(0, 0, 340, 340, 0, 180, PIE);
  noStroke();
  fill(0);
  //반지름 + 15만큼띄우기
  ellipse(185, 0, 8, 8);
  pop();

  //시
  push();
  rotate(hAngle);
  strokeWeight(8); //
  arc(0, 0, 200, 200, 0, 180, PIE);
  noStroke();
  fill(0);
  //반지름 + 15만큼띄우기
  ellipse(115, 0, 8, 8);
  pop();
}
