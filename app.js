var multiply = 0;
var extraColorValue = 127;
var extraColorPlace = 3;
var xPlace = 1;
var firstPlace = 0;
var secondPlace = 0;
var speed = 0.0003;
var acceleration = 0.000005;
var started = true;
var r = 0;
var xKeyFast = false;

var halfWidth;
var halfHeight;
var halfDiagDist;

var currentVolume = 0;

var song;
var songA;
var songB;
var amp;

var keysPressed = {};

var volumesList = [];
var MAX_VOLUME_LENGTH = 250;


var padding = 15;



function setup() {
  createCanvas(windowWidth, windowHeight);
  background(0);
  noStroke();
  smooth();

  halfWidth = width / 2;
  halfHeight = height / 2;
  halfDiagDist = sqrt(sq(halfWidth) + sq(halfHeight));

  var input = document.querySelector("input");
  // https://stackoverflow.com/a/28619927/9911203
  input.onchange = function(e) {
    var songUrl = URL.createObjectURL(this.files[0]);
    if (!songB || songA && songA.isPlaying()) {
      songB = loadSound(songUrl, loaded);
      song = songB;
    }
    else if (songB.isPlaying()) {
      songA = loadSound(songUrl, loaded);
      song = songA;
    }
  };

  amp = new p5.Amplitude();
}

function loaded() {
  started = true;
  if (!songB.isPlaying()) {
    if (songA)
      songA.stop();
    songB.play();
  }
  else {
    songB.stop();
    songA.play();
  }
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
    if (rCosMultiplyIPlusWidthOn2 < -padding || rCosMultiplyIPlusWidthOn2 > width + padding || rSinMultiplyIPlusHeightOn2 < -padding || rSinMultiplyIPlusHeightOn2 > height + padding) {
      continue;
    }

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
    weight = pow(i * i * (currentVolume + 0.125) * 16, 0.25);

    ellipse(rCosMultiplyIPlusWidthOn2, rSinMultiplyIPlusHeightOn2, weight, weight);
  }
}

function draw() {
  spiral(r);
  if (started) {
    multiply += speed;
  }
  currentVolume = amp.getLevel();
  volumesList.push(currentVolume);
  if (volumesList.length > MAX_VOLUME_LENGTH) {
    volumesList.shift();
  }
  currentVolume = map(currentVolume, min(volumesList), max(volumesList), 0, 1);
  if (isNaN(currentVolume))
    currentVolume = 0;
  if (keyIsPressed) {
    if (keysPressed['ArrowLeft'])
      multiply -= speed * 2;
    if (keysPressed['ArrowRight'])
      multiply += speed;
    if (keysPressed['ArrowDown'])
      speed -= acceleration;
    if (keysPressed['ArrowUp'])
      speed += acceleration;
    if (keysPressed['['])
      multiply -= 0.125;
    if (keysPressed[']'])
      multiply += 0.125;
    if (keysPressed[',']) {
      extraColorValue -= 1;
      if (extraColorValue < 0)
        extraColorValue = 0;
    }
    if (keysPressed['.']) {
      extraColorValue += 1;
      if (extraColorValue > 255)
        extraColorValue = 255;
    }
    if (keysPressed['1'])
      extraColorPlace = 1;
    if (keysPressed['2'])
      extraColorPlace = 2;
    if (keysPressed['3'])
      extraColorPlace = 3;
    if (keysPressed['x'] && xKeyFast)
      xPlace = xPlace == 1 ? 2 : 1;
    if (keysPressed['-'])
      r--;
    if (keysPressed['='])
      r++;
    if (keysPressed['r'])
      multiply = 0;
  }
}

function keyPressed() {
  if (key == 'x' && !xKeyFast) {
    xPlace = xPlace == 1 ? 2 : 1;
  }
  if (key == ' ') {
    started = !started;
    if (!started)
      song.pause();
    else
      song.play();
  }
  if (key == 'c') {
    xKeyFast = !xKeyFast;
  }
  keysPressed[key] = true;
}

function keyReleased() {
  keysPressed[key] = false;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  halfWidth = width / 2;
  halfHeight = height / 2;
  halfDiagDist = sqrt(sq(halfWidth) + sq(halfHeight));
}
