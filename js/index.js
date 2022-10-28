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
import { Tile } from "./components/Tile.js";

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
const loadGameEl = document.querySelector("div#load-games");

let mapName = "map1";
let playerName;
let game;
let timeElSelector = "span#time";
let playersData = updateData();
let savedGames;
// game = new Game(mapName);
// renderBoard(game.board, boardDiv);
renderLeaderboard(playersData, leaderboard);
startGameButton.addEventListener("click", function (event) {
  console.log(nameInputEl);
  if (!nameInputEl.checkValidity()) {
    nameInputEl.reportValidity();
    nameInputEl.setCustomValidity(
      "Name must conform with pattern [A-Za-z0-9]+"
    );
  } else {
    mapName = selectMapEl.value;
    playerName = nameInputEl.value;
    startGame(mapName, playerName);
  }
});

function startGame(mapName, playerName, board, time) {
  localStorage.setItem("current-player", playerName);
  document.querySelector(
    "#name-display"
  ).innerHTML = `<b>Game details</b><br>Player : ${playerName} <br> Map : ${mapName}`;
  gameDisplay.hidden = false;
  game = new Game(mapName);
  // console.log(board);
  if (board) {
    game.board = board;
    document.querySelector(timeElSelector).innerHTML = time ? time : 0;
    // console.log(game.board);
  }
  stopCounter();
  resetCounter(timeElSelector, time);
  startCounter(timeElSelector);
  renderBoard(game.board, boardDiv);
  gameEndDiv.classList.add("hidden");
  gameEndDiv.classList.remove("flex");
}

restartGameButton.addEventListener("click", function (event) {
  game = new Game(mapName);
  renderBoard(game.board, boardDiv);
  resetCounter(timeElSelector);
  startCounter(timeElSelector);
  gameEndDiv.classList.add("hidden");
  gameEndDiv.classList.remove("flex");
});

function handleGameControl(event) {
  const targetElement = event.target;
  if (targetElement.id === "save") {
    savingGame();
  } else if (targetElement.id === "fetch") {
    showSavedGames();
  }
}

function handleLoadGameOnBoard(event) {
  const targetElement = event.target;
  const parentSection = targetElement.closest("ul");
  const spanInParent = parentSection.querySelector("span");
  const playerName = spanInParent.innerHTML;
  const mapName = targetElement.innerHTML;

  localStorage.setItem("current-player", playerName);
  let entry = savedGames.find((entry) => entry.name === playerName);
  let boardToLoad = entry.boards.find((entry) => entry.map === mapName);

  let time = Number(boardToLoad.time);
  boardToLoad = boardToLoad.boardInStore;
  // console.log(boardToLoad);
  let tempBoard = [];
  boardToLoad.map((row, i) => {
    let rowToInsert = [];
    row.map((cell, j) => {
      let tileToPush = Tile.createTile(
        cell.x,
        cell.y,
        cell.black,
        cell.number,
        cell.hasBulb,
        cell.isIlluminated,
        cell.wrongNumberOfBulbs,
        cell.wrongPositionForBulb,
        cell.tileStatus
      );
      rowToInsert.push(tileToPush);
    });
    tempBoard.push(rowToInsert);
  });
  boardToLoad = tempBoard;
  // console.log(boardToLoad);
  // game = new Game(mapName);
  // game.board = boardToLoad.boardInStore;
  // console.log(boardToLoad.boardInStore);
  startGame(mapName, playerName, boardToLoad, time);
  loadGameEl.classList.add("hidden");
  loadGameEl.classList.remove("flex");
  // loadGameEl.style.display = "none";
  // console.log(game.board);
}

delegate(gameControlDiv, "click", "button", handleGameControl);
// console.log(game.altBoard);

function savingGame() {
  let currentPlayerName = localStorage.getItem("current-player");
  let mapName = selectMapEl.value;
  let currentTime = document.querySelector(timeElSelector).innerHTML;
  if (!currentTime || !mapName || !currentPlayerName) {
    alert("No game to save");
    return;
  }
  currentTime = currentTime.split(":")[1];
  currentTime = currentTime.split("sec")[0].trim();
  console.log(currentTime);
  let boardToAdd = {
    map: mapName,
    boardInStore: game.board,
    time: currentTime,
  };
  let dataToStore = {
    name: currentPlayerName,
    boards: [boardToAdd],
  };
  savedGames = localStorage.getItem("saved-games");
  console.log(`${currentPlayerName} ${mapName}`);
  if (savedGames) {
    savedGames = JSON.parse(savedGames);
    let playerExists = savedGames.find((entry) => {
      console.log(entry.name);
      return entry.name === currentPlayerName;
    });
    // console.log(playerExists);
    if (playerExists) {
      savedGames.map((item) => {
        // console.log(item.boards);
        let boardExists = item.boards.find(
          (boardInStore) => boardInStore.map === mapName
        );
        // console.log(boardExists);
        if (boardExists) {
          item.boards = item.boards.map((entry) => {
            if (entry.map === mapName) {
              entry = boardToAdd;
            }
            return entry;
          });
        } else {
          item.boards.push(boardToAdd);
        }
      });
    } else {
      savedGames.push(dataToStore);
    }
    localStorage.setItem("saved-games", JSON.stringify(savedGames));
  } else {
    dataToStore = JSON.stringify([dataToStore]);
    localStorage.setItem("saved-games", dataToStore);
  }
}
function showSavedGames() {
  loadGameEl.classList.add("flex");
  loadGameEl.classList.remove("hidden");
  savedGames = JSON.parse(localStorage.getItem("saved-games"));
  // console.log(savedGames);
  let string = "No games saved!";
  if (savedGames) {
    string = savedGames
      .map((entry) => {
        return `<ul>
        <span>${entry.name}</span>
        ${entry.boards
          .map((item) => {
            // console.log(item.map);
            return `<button><li>${item.map}</li></button>`;
          })
          .join("")}
      </ul>`;
      })
      .join("");
    // console.log(string);

    loadGameEl.innerHTML = string;
    delegate(loadGameEl, "click", "button li", handleLoadGameOnBoard);
  } else {
    alert(string);
  }
}

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
  gameEndDiv.classList.remove("hidden");
  gameEndDiv.classList.add("flex");
  // gameEndDiv.style.display = "flex";
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
