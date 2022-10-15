import { Game } from "./components/Game.js";
import { delegate } from "./utils/EventFunctions.js";
import "./view/MapSelectorPage.js";
import { render, renderBoard } from "./view/BoardUI.js";
import { xyCoord, hasWon } from "./utils/MathFunctions.js";

let game = new Game(7, 7);

const showGameButton = document.querySelector("button#showgame");
const boardDiv = document.querySelector("div#board");

showGameButton.addEventListener("click", function (event) {
  boardDiv.style.display === "table"
    ? (boardDiv.style.display = "none")
    : "table";
});

renderBoard(game.board, boardDiv);
// console.log(game.board);

function putBulbOnTile(event) {
  const tile = event.target;
  let { x, y } = xyCoord(tile);
  //   console.log(`${x} , ${y}`);
  if (
    tile.classList.contains("black") ||
    tile.classList.contains("illuminated")
  ) {
    return;
  } else if (tile.classList.contains("bulb")) {
    tile.classList.toggle("bulb");
    tile.innerHTML = "";
    game.board[y][x].setHasBulb(false);
    game.board[y][x].setIsIlluminated(false);
    renderBoard(game.board, boardDiv);
    return;
  }
  //   tile.classList.toggle("bulb");
  tile.innerHTML = "💡";
  game.board[y][x].setHasBulb(true);
  game.board[y][x].setIsIlluminated(true);
  spreadLight(game.board, tile);
  //   console.log(game.board[y][x]);
  renderBoard(game.board, boardDiv);
}
delegate(boardDiv, "click", "td", putBulbOnTile);

function spreadLight(board, currentTile) {
  let { x, y } = xyCoord(currentTile);
  console.log(`${x} , ${y}`);
  spreadLightVertically(board, currentTile);
  spreadLightHorizontally(board, currentTile);
}

function spreadLightVertically(board, currentTile) {
  let { x, y } = xyCoord(currentTile);
  let currentRow = y + 1;
  while (currentRow < board.length) {
    let tile = board[currentRow][x];
    // console.log(tile);
    if (!tile.getIsBlack()) {
      tile.setIsIlluminated(true);
      //   renderBoard(game.board, boardDiv);
    } else {
      return;
    }
    currentRow++;
  }

  console.log(`Before going up : (${x},${currentRow}) `);
  currentRow = y - 1;
  while (currentRow >= 0) {
    let tile = board[currentRow][x];

    // console.log(tile);
    if (!tile.getIsBlack()) {
      tile.setIsIlluminated(true);
      //   renderBoard(game.board, boardDiv);
    } else {
      return;
    }
    console.log(
      `current tile : (${x},${currentRow}) illuminated : ${tile.getIsIlluminated()}`
    );
    currentRow--;
  }
}
function spreadLightHorizontally(board, currentTile) {
  let { x, y } = xyCoord(currentTile);
  let currentColumn = x + 1;
  while (currentColumn < board.length) {
    let tile = board[y][currentColumn];
    // console.log(tile);
    if (!tile.getIsBlack()) {
      tile.setIsIlluminated(true);
      //   renderBoard(game.board, boardDiv);
    } else {
      return;
    }
    currentColumn++;
  }
  currentColumn = x - 1;
  console.log(`Before going left : (${currentColumn},${y})`);
  while (currentColumn >= 0) {
    let tile = board[y][currentColumn];

    // console.log(tile);
    if (!tile.getIsBlack()) {
      tile.setIsIlluminated(true);
      //   renderBoard(game.board, boardDiv);
    } else {
      return;
    }
    console.log(
      `current tile : (${currentColumn},${y}) illuminated : ${tile.getIsIlluminated()}`
    );
    currentColumn--;
  }
}

function removeLightHorizontally(params) {}
function removeLightVertically(params) {}
