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
  isNumberedTilesHaveCorrectNumberOfBulbs,
  stopCounter,
} from "./utils/HelperFunctions.js";
import { renderLeaderboard, updateData } from "./view/Leaderboard.js";

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
const testerButton = document.querySelector("button#tester");
const leaderboard = document.querySelector("div#leaderboard");

let mapName = "map1";
let game;
let timeElSelector = "span#time";
let playersData = updateData();
// game = new Game(mapName);
// renderBoard(game.board, boardDiv);
renderLeaderboard(playersData, leaderboard);
startGameButton.addEventListener("click", function (event) {
  resetCounter(timeElSelector);
  console.log(nameInputEl);
  if (!nameInputEl.checkValidity()) {
    nameInputEl.reportValidity();
    nameInputEl.setCustomValidity(
      "Name must conform with pattern [A-Za-z0-9]+"
    );
  } else {
    localStorage.setItem("current-player", nameInputEl.value);
    document.querySelector(
      "#name-display"
    ).innerHTML = `Player : ${nameInputEl.value} <br> Map : ${selectMapEl.value}`;
    gameDisplay.hidden = false;
    mapName = selectMapEl.value;
    game = new Game(mapName);
    startCounter(timeElSelector);
    renderBoard(game.board, boardDiv);
    gameEndDiv.style.display = "none";
  }
});

restartGameButton.addEventListener("click", function (event) {
  game = new Game(mapName);
  renderBoard(game.board, boardDiv);
  resetCounter(timeElSelector);
  gameEndDiv.style.display = "none";
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

  if (tile.classList.contains("black")) {
    console.log(tile);
    return;
  } else if (tile.classList.contains("bulb")) {
    tile.innerHTML = "";
    game.board[y][x].setHasBulb(false);
    isCorrectNumberOfBulbsAroundTile(game.board);
    removeLight(game.board, tile, boardDiv);
    correctLight(game.board, boardDiv);
    checkIfBulbsInCorrectPosition(game.board, boardDiv);
    renderBoard(game.board, boardDiv);
    if (hasWon(game)) {
      playerWon();
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
    playerWon();
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

const playerWon = () => {
  displayWin();
  saveScore();
  playersData = updateData();
  renderLeaderboard(playersData, leaderboard);
  stopCounter();
};

const displayWin = () => {
  console.log("Won!");
  gameEndDiv.style.display = "flex";
};

const saveScore = () => {
  let currentPlayer = localStorage.getItem("current-player");
  let currentMap = selectMapEl.value;
  let currentTime = document.querySelector(timeElSelector).innerHTML;
  currentTime = currentTime.split(":")[1];

  let userMaps = JSON.parse(localStorage.getItem(currentPlayer));
  if (!userMaps) {
    let mapsForUser = [{ [currentMap]: currentTime }];
    localStorage.setItem(currentPlayer, JSON.stringify(mapsForUser));
  } else {
    console.log(userMaps);
    let mapPlayerDidBefore = userMaps.find(
      (mapObj) => Object.keys(mapObj)[0] === currentMap
    ); // {map1 : 0} OR {map2:0} where map2 == name of map , 0 == time elapsed

    if (!mapPlayerDidBefore) {
      userMaps.push({ [currentMap]: currentTime });
    } else {
      if (mapPlayerDidBefore[currentMap] >= currentTime) {
        mapPlayerDidBefore[currentMap] = currentTime;
        userMaps.map((mapObj) => {
          if (Object.keys(mapObj)[0] === currentMap) {
            mapObj = mapPlayerDidBefore;
          }
        });
      }
    }
    userMaps = JSON.stringify(userMaps);
    localStorage.setItem(currentPlayer, userMaps);
  }

  console.log(`${currentPlayer} ${currentMap} ${currentTime}`);
};

testerButton.addEventListener("click", () => {
  saveScore();
});
