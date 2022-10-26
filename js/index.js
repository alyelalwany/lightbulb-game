import { Game, GAME_STATE } from "./components/Game.js";
import { delegate } from "./utils/EventFunctions.js";
import "./view/MapSelectorPage.js";
import {
  removeLight,
  xyCoord,
  renderBoard,
  spreadLight,
  isCorrectNumberOfBulbsAroundTile,
  correctLight,
} from "./view/BoardUI.js";
import {
  hasWon,
  startCounter,
  resetCounter,
  checkIfBulbsInCorrectPosition,
} from "./utils/HelperFunctions.js";

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

let mapName = "map1";
let game;
// game = new Game(mapName);
// renderBoard(game.board, boardDiv);

startGameButton.addEventListener("click", function (event) {
  resetCounter("span#time");
  console.log(nameInputEl);
  if (nameInputEl.value) {
    localStorage.setItem("current-player", nameInputEl.value);
    document.querySelector(
      "#name-display"
    ).innerHTML = `Player : ${nameInputEl.value} <br> Map : ${selectMapEl.value}`;
    gameDisplay.hidden = false;
    mapName = selectMapEl.value;
    game = new Game(mapName);
    startCounter("span#time");
    renderBoard(game.board, boardDiv);
  }
});

restartGameButton.addEventListener("click", function (event) {
  game = new Game(mapName);
  renderBoard(game.board, boardDiv);
  gameEndDiv.style.display = "none";
  resetCounter("span#time");
});

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

// loadMapButton.addEventListener("click", function (event) {
//   game.initBoardFromFile();
//   console.log(game.altBoard);
//   renderBoard(game.board, boardDiv);
// });

// checkSolutionButton.addEventListener("click", function (event) {
//   checkIfBulbsInCorrectPosition();
//   renderBoard(game.board, boardDiv);
// });
