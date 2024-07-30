let d1 = document.getElementById("d1");
let d2 = document.getElementById("d2");
let d4 = document.getElementById("d4");
let d3 = document.getElementById("d3");
let start = document.getElementById("startButton");
let bStop = document.getElementById("stopButton");
let isStarted = false;
let arr = ["red", "green", "yellow", "blue"];
let curColour = ["red", "green", "yellow", "blue"];
function swapColor() {
  curColour[1] = arr[0];
  curColour[2] = arr[1];
  curColour[3] = arr[2];
  curColour[0] = arr[3];
  d2.style.backgroundColor = arr[0]; // red
  d4.style.backgroundColor = arr[1]; // green
  d3.style.backgroundColor = arr[2]; // yellow
  d1.style.backgroundColor = arr[3]; // blue
  arr[0] = curColour[0];
  arr[1] = curColour[1];
  arr[2] = curColour[2];
  arr[3] = curColour[3];
}

function startFunc() {
  document.getElementById("stopButton").style.display = "block";
  document.getElementById("startButton").style.display = "none";
  start = setInterval(swapColor, 2000);
}
function stopFunc() {
  document.getElementById("stopButton").style.display = "none";
  document.getElementById("startButton").style.display = "block";
  clearInterval(start);
}
