
var song;

document.addEventListener('DOMContentLoaded', () => {
  var input = document.querySelector("input");
  // // https://stackoverflow.com/a/28619927/9911203
  // input.onchange = function(e){
  //   var sound = document.getElementById('sound');
  //   sound.src = URL.createObjectURL(this.files[0]);
  //   // not really needed in this exact case, but since it is really important in other cases,
  //   // don't forget to revoke the blobURI when you don't need it
  //   sound.onend = function(e) {
  //     URL.revokeObjectURL(this.src);
  //   };
  // };

  // https://stackoverflow.com/a/28619927/9911203
  input.onchange = function(e){
    var songUrl = URL.createObjectURL(this.files[0]);
    song = loadSound(songUrl, function() {
      song.play();
    });
  };
});


// function preload() {
//   soundFormats('mp3', 'ogg');
//   mySound = loadSound('assets/doorbell.mp3');
// }

// function setup() {
//   mySound.setVolume(0.1);
//   mySound.play();
// }



// var x = document.getElementById("myFile").value;
// console.log(x)
