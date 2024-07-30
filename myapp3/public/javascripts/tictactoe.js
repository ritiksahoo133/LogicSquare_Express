let currPlayer = "x";
let arr = [null, null, null, null, null, null, null, null, null];
let isGameOver = false;
let result = document.getElementById("result");

function funClick(element) {
  if (isGameOver) return;
  let id = Number(element.id);

  if (arr[id] != null) return;
  console.log(id);

  arr[id] = currPlayer;
  element.innerHTML = currPlayer;
  console.log(currPlayer);

  checkWinner();

  if (currPlayer == "x") {
    currPlayer = "o";
  } else {
    currPlayer = "x";
  }
}
function checkWinner() {
  if (
    (arr[0] != null && arr[0] === arr[1] && arr[1] === arr[2]) ||
    (arr[3] != null && arr[3] === arr[4] && arr[4] === arr[5]) ||
    (arr[6] != null && arr[6] === arr[7] && arr[7] === arr[8]) ||
    (arr[0] != null && arr[0] === arr[3] && arr[3] === arr[6]) ||
    (arr[1] != null && arr[1] === arr[4] && arr[4] === arr[7]) ||
    (arr[2] != null && arr[2] === arr[5] && arr[5] === arr[8]) ||
    (arr[0] != null && arr[0] === arr[4] && arr[4] === arr[8]) ||
    (arr[2] != null && arr[2] === arr[4] && arr[4] === arr[6])
  ) {
    console.log(currPlayer + " win ");
    isGameOver = true;
    return isGameOver;
  }
  if (!arr.includes(null)) {
    console.log("Draw");
    return;
  }
}
