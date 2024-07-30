const redLight = document.getElementById("redCircle");
const yellowLight = document.getElementById("yellowCircle");
const greenLight = document.getElementById("greenCircle");
const startButton = document.querySelector(".button");
const timer = document.getElementById("#timer");

function startFunc() {
  document.getElementById("b1").disabled = true;
  redLight.style.backgroundColor = "red";
  yellowLight.style.backgroundColor = "rgb(141, 141, 54)";
  // console.log("red");
  checkTimer(12);
  console.log("checkTimer");

  setTimeout(function greenFunc() {
    redLight.style.backgroundColor = "rgb(93, 24, 24)";
    greenLight.style.backgroundColor = "rgb(197 229 66)";
    console.log("green");
    // checkTimer(5)
    setTimeout(yellowFunc, 5000);
  }, 12000);

  function yellowFunc() {
    greenLight.style.backgroundColor = "rgb(50, 72, 38)";
    yellowLight.style.backgroundColor = "yellow";
    console.log("yellow");
    // checkTimer(3)
    setTimeout(startFunc, 2000);
  }
}
function checkTimer(count) {
  const t = setInterval(() => {
    count = count - 1;
    if (count >= 0 && count < 10) {
      document.getElementById("timer").innerText = "0" + count;
      redLight.innerText = "0" + count;
    }
    if (count >= 10) {
      document.getElementById("timer").innerText = count;
      redLight.innerText = count;
    }

    if (count < 0) {
      clearInterval(t);
    }
  }, 1000);
}
