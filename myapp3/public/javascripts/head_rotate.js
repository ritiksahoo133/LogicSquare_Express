img1 = document.getElementById("image1");
isRunning = true;
function stopFunc(ele) {
  if (isRunning === true) {
    img1.style.webkitAnimationPlayState = "paused";
    document.getElementById("b1").innerHTML = "START";
    isRunning = false;
  } else {
    img1.style.webkitAnimationPlayState = "running";
    document.getElementById("b1").innerHTML = "STOP";
    isRunning = true;
  }
}
