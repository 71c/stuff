var multiply = 0;
var extraColorValue = 127;
var extraColorPlace = 3;
var xPlace = 1;
var firstPlace = 0;
var secondPlace = 0;
var speed = 0.0003;
var started = true;
var r = 0;
var xKeyFast = false;

var halfWidth;
var halfHeight;
var mappedVolume = 0;

var acceleration = 0.000005;

var currentVolume = 0;

var song;

var amp;


function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
  background(0);
  noStroke();
  smooth();

  halfWidth = width / 2;
  halfHeight = height / 2;

  var input = document.querySelector("input");
  // https://stackoverflow.com/a/28619927/9911203
  input.onchange = function(e) {
    var songUrl = URL.createObjectURL(this.files[0]);
    song = loadSound(songUrl, loaded);
  };

  amp = new p5.Amplitude();
}

function loaded() {
  started = true;
  song.play();
}

function spiral(r) {
  var multiplyI;
  var rCosMultiplyIPlusWidthOn2;
  var rSinMultiplyIPlusHeightOn2;
  var weight;
  background(0);

  for (var i = 0; i < width; i++) {
    r++;
    multiplyI = multiply * i;
    rCosMultiplyIPlusWidthOn2 = r * cos(multiplyI) + halfWidth;
    rSinMultiplyIPlusHeightOn2 = r * sin(multiplyI) + halfHeight;

    if (xPlace == 1) {
      firstPlace = 255 * rCosMultiplyIPlusWidthOn2 / width;
      secondPlace = 255 * rSinMultiplyIPlusHeightOn2 / height;
    }
    else {
      firstPlace = 255 * rSinMultiplyIPlusHeightOn2 / height;
      secondPlace = 255 * rCosMultiplyIPlusWidthOn2 / width;
    }

    if (extraColorPlace == 1)
      fill(extraColorValue, firstPlace, secondPlace);
    else if (extraColorPlace == 2)
      fill(firstPlace, extraColorValue, secondPlace);
    else if (extraColorPlace == 3)
      fill(firstPlace, secondPlace, extraColorValue);
    weight = pow(i * i * (currentVolume + 0.125) * 16, 0.25); // THISTHIS <---- IS THE ONE USED CURRENTLY.


    ellipse(rCosMultiplyIPlusWidthOn2, rSinMultiplyIPlusHeightOn2, weight, weight);
  }
}

function draw() {
  spiral(r);
  if (started) {
    multiply += speed;
  }
  currentVolume = amp.getLevel();
  if (keyIsPressed) {
    if (keyCode == LEFT_ARROW)
      multiply -= speed * 2;
    if (keyCode == RIGHT_ARROW)
      multiply += speed;
    if (keyCode == DOWN_ARROW)
      speed -= acceleration;
    if (keyCode == UP_ARROW)
      speed += acceleration;
    if (key == '[')
      multiply -= 0.125;
    if (key == ']')
      multiply += 0.125;
    if (key == ',' || key == '<')
      extraColorValue -= 1;
    if (key == '.' || key == '>')
      extraColorValue += 1;
    if (key == '1')
      extraColorPlace = 1;
    if (key == '2')
      extraColorPlace = 2;
    if (key == '3')
      extraColorPlace = 3;
    if (key == 'x' && xKeyFast)
      xPlace = xPlace == 1 ? 2 : 1;
    if (key == '-')
      r--;
    if (key == '=' || key == '+')
      r++;
    if (key == 'r')
      multiply = 0;
  }
  println(frameRate());
}

function keyPressed() {
  if (key == 'x' && !xKeyFast) {
    xPlace = xPlace == 1 ? 2 : 1;
  }
  if (key == ' ') {
    started = !started;
    if (song && song.isLoaded()) {
      if (!started)
        song.pause();
      else
        song.play();
    }
  }
  if (key == 'c') {
    xKeyFast = !xKeyFast;
  }
}
