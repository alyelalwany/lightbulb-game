import { Game, GAME_STATE } from "./components/Game.js";
import { delegate } from "./utils/EventFunctions.js";
import "./view/MapSelectorPage.js";
import {
  getTileFromTable,
  handleLightHorizontally,
  handleLightVertically,
  render,
  removeLight,
  xyCoord,
  renderBoard,
  spreadLight,
} from "./view/BoardUI.js";
import {
  hasWon,
  startCounter,
  resetCounter,
  checkIfBulbsInCorrectPosition,
} from "./utils/HelperFunctions.js";
import { Tile, TILE_STATUS } from "./components/Tile.js";

//Elements
const boardDiv = document.querySelector("div#board");
const gameControlDiv = document.querySelector("div#game-controls");
const gameEndDiv = document.querySelector("div#game-end");
const restartGameButton = gameEndDiv.querySelector("button");
const checkSolutionButton = gameControlDiv.querySelector("#check-solution");
const loadMapButton = document.querySelector("#load-map");
const nameInputEl = document.querySelector("input[name=name]");
const selectMapEl = document.querySelector("select");
const gameDisplay = document.querySelector("#game-display");
const startGameButton = document.querySelector("select+button");

let mapName = "map2";

startGameButton.addEventListener("click", function (event) {
  console.log(nameInputEl);
  if (nameInputEl.value) {
    localStorage.setItem("current-player", nameInputEl.value);
    document.querySelector(
      "#name-display"
    ).innerHTML = `Player : ${nameInputEl.value} <br> Map : ${selectMapEl.value}`;
    gameDisplay.hidden = false;
    mapName = selectMapEl.value;
  }
});

//init
let game = new Game(mapName);

//TODO save game
function handleGameControl(event) {
  const targetElement = event.target;
  if (targetElement.id === "save") {
    localStorage.setItem("board", JSON.stringify(game.board));
  } else if (targetElement.id === "fetch") {
    let string = localStorage.getItem("board");
    console.log(string);
  }
}

delegate(gameControlDiv, "click", "button", handleGameControl);

window.addEventListener("DOMContentLoaded", function () {
  startCounter("span#time");
});

renderBoard(game.board, boardDiv);
// console.log(game.altBoard);

function handleTileClick(event) {
  const tile = event.target;
  let { x, y } = xyCoord(tile);
  // console.log(`${x} , ${y}`);
  // checkSolution(game.board, tile, boardDiv);

  if (
    tile.classList.contains("black")
    // ||tile.classList.contains("illuminated")
  ) {
    console.log(tile);
    return;
  } else if (tile.classList.contains("bulb")) {
    tile.innerHTML = "";
    console.log(tile);
    game.board[y][x].setHasBulb(false);
    isCorrectNumberOfBulbsAroundTile(game.board);
    removeLight(game.board, tile, boardDiv);
    correctLight(game.board, boardDiv);
    checkIfBulbsInCorrectPosition(game.board, boardDiv);
    renderBoard(game.board, boardDiv);
    if (hasWon(game)) {
      console.log("Won!");
      gameEndDiv.style.display = "flex";
    }
    return;
  }

  tile.innerHTML = "💡";
  game.board[y][x].setHasBulb(true);
  isCorrectNumberOfBulbsAroundTile(game.board);
  spreadLight(game.board, tile, boardDiv);
  checkIfBulbsInCorrectPosition(game.board, boardDiv);
  // checkSolution(game.board, tile, boardDiv);
  renderBoard(game.board, boardDiv);

  if (hasWon(game)) {
    console.log("Won!");
    gameEndDiv.style.display = "flex";
  }
}
delegate(boardDiv, "click", "td", handleTileClick);

restartGameButton.addEventListener("click", function (event) {
  game = new Game(mapName);
  // timer = new Timer();
  renderBoard(game.board, boardDiv);
  gameEndDiv.style.display = "none";
  resetCounter("span#time");
});
loadMapButton.addEventListener("click", function (event) {
  game.initBoardFromFile();
  console.log(game.altBoard);
  renderBoard(game.board, boardDiv);
});

let tile = Tile.createTile(0, 0, true, 1);
// console.log(tile);

checkSolutionButton.addEventListener("click", function (event) {
  checkIfBulbsInCorrectPosition();
  renderBoard(game.board, boardDiv);
});

function correctLight(board, boardDiv) {
  // board.map((row, y) =>
  //   row.map((cell, x) => {
  //     if (cell.getHasBulb()) {
  //       console.log(`Found one with bulb ${JSON.stringify(cell)}`);
  //       const tileWithBulb = getTileFromTable(y, x, boardDiv);
  //       spreadLight(board, tileWithBulb, boardDiv);
  //     }
  //   })
  // );

  for (let x = 0; x < board.length; x++) {
    for (let y = 0; y < board[x].length; y++) {
      if (board[x][y].getHasBulb()) {
        console.log(`Found one with bulb ${JSON.stringify(board[x][y])}`);
        const tileWithBulb = getTileFromTable(y, x, boardDiv);
        spreadLight(board, tileWithBulb, boardDiv);
      }
    }
  }
}

function isCorrectNumberOfBulbsAroundTile(board) {
  let blackTiles = [];
  game.board.map((row) => {
    row.map((cell) => {
      if (cell.getIsBlack()) {
        blackTiles.push(cell);
      }
    });
  });
  blackTiles = blackTiles.filter((cell) => cell.getNumber() !== -1);
  blackTiles.map((tile) => {
    tile.surroundingBulbs = 0;
    // tile.setHasWrongNumberOfBulbs(false);
    tile.setTileStatus(TILE_STATUS.NEUTRAL);
    countOfBulbsVertical(tile, game.board);
    countOfBulbsHorizontal(tile, game.board);
    console.log(tile.getCoords());
    console.log(tile.surroundingBulbs);
    if (tile.surroundingBulbs > tile.getNumber()) {
      tile.setTileStatus(TILE_STATUS.TOO_MANY_BULBS);
      // tile.setHasWrongNumberOfBulbs(true);
    } else if (tile.surroundingBulbs === tile.getNumber()) {
      tile.setTileStatus(TILE_STATUS.CORRECT_NUMBER_OF_BULBS);
    }
  });
}

function countOfBulbsVertical(tile, board) {
  let { x, y } = tile.getCoords();
  let rowAbove = y - 1;
  let rowBelow = y + 1;
  if (rowAbove > 0) {
    let tileAbove = game.board[rowAbove][x];
    if (tileAbove.getHasBulb()) {
      tile.surroundingBulbs++;
    }
  }
  if (rowBelow < board.length) {
    let tileBelow = game.board[rowBelow][x];
    if (tileBelow.getHasBulb()) {
      tile.surroundingBulbs++;
    }
  }
}
function countOfBulbsHorizontal(tile, board) {
  let { x, y } = tile.getCoords();
  let columnAbove = x - 1;
  let columnBelow = x + 1;
  if (columnAbove > 0) {
    let tileAbove = game.board[y][columnAbove];
    if (tileAbove.getHasBulb()) {
      tile.surroundingBulbs++;
    }
  }
  if (columnBelow < board.length) {
    let tileBelow = game.board[y][columnBelow];
    if (tileBelow.getHasBulb()) {
      tile.surroundingBulbs++;
    }
  }
}
