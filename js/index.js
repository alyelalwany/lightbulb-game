import { Game, GAME_STATE } from "./components/Game.js";
import { delegate } from "./utils/EventFunctions.js";
import "./view/MapSelectorPage.js";
import "./view/CustomMaps.js";
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
  stopCounter,
  generateSavedMaps,
} from "./utils/HelperFunctions.js";
import { renderLeaderboard, loadLeaderboard } from "./view/Leaderboard.js";
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
const leaderboard = document.querySelector("div#leaderboard");
const loadGameEl = document.querySelector("div#load-games");
const mapselectorContainer = document.querySelector(
  "div#mapselector-container"
);
const savedMaps = document.querySelector("div#saved-maps");

let mapName = "map1";
let playerName;
let game;
let timeElSelector = "span#time";
let playersData = loadLeaderboard();
let savedGames;
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
    console.log(mapName);
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
  if (board) {
    game.board = board;
    document.querySelector(timeElSelector).innerHTML = time ? time : 0;
  }
  stopCounter();
  resetCounter(timeElSelector, time);
  startCounter(timeElSelector);
  renderBoard(game.board, boardDiv);
  isCorrectNumberOfBulbsAroundTile(game.board);
  checkIfBulbsInCorrectPosition(game.board, boardDiv);
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
  startGame(mapName, playerName, boardToLoad, time);
  loadGameEl.classList.add("hidden");
  loadGameEl.classList.remove("flex");
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
    if (playerExists) {
      savedGames.map((item) => {
        let boardExists = item.boards.find(
          (boardInStore) => boardInStore.map === mapName
        );
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
export function showSavedGames() {
  loadGameEl.classList.add("flex");
  loadGameEl.classList.remove("hidden");
  savedGames = JSON.parse(localStorage.getItem("saved-games"));
  let string = "No games saved!";
  if (savedGames) {
    string = savedGames
      .map((entry) => {
        return `<ul>
        <span>${entry.name}</span>
        ${entry.boards
          .map((item) => {
            return `<button><li>${item.map}</li></button>`;
          })
          .join("")}
      </ul>`;
      })
      .join("");

    loadGameEl.innerHTML = string;
    delegate(loadGameEl, "click", "button li", handleLoadGameOnBoard);
  } else {
    alert(string);
  }
}

function handleTileClick(event) {
  const tile = event.target;
  let { x, y } = xyCoord(tile);
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
  renderBoard(game.board, boardDiv);
  if (hasWon(game)) {
    playerWon();
  }
}
delegate(boardDiv, "click", "td", handleTileClick);

const playerWon = () => {
  displayWin();
  saveScore();
  playersData = loadLeaderboard();
  renderLeaderboard(playersData, leaderboard);
  stopCounter();
};

const displayWin = () => {
  console.log("Won!");
  gameEndDiv.classList.remove("hidden");
  gameEndDiv.classList.add("flex");
};

const saveScore = () => {
  let currentPlayer = localStorage.getItem("current-player");
  let currentMap = selectMapEl.value;
  let currentTime = document.querySelector(timeElSelector).innerHTML;
  currentTime = currentTime.split(":")[1];
  currentTime = parseInt(currentTime);
  let savedPlayers = JSON.parse(localStorage.getItem("leaderboard"));
  if (!savedPlayers) {
    savedPlayers = [
      { name: currentPlayer, maps: [{ name: currentMap, time: currentTime }] },
    ];
  } else {
    let playerInStore = savedPlayers.find(
      (entry) => entry.name === currentPlayer
    );
    if (!playerInStore) {
      let newPlayer = {
        name: currentPlayer,
        maps: [{ name: currentMap, time: currentTime }],
      };
      savedPlayers.push(newPlayer);
    } else {
      let mapPlayerDidBefore = playerInStore.maps.find(
        (entry) => entry.name === currentMap
      );
      console.log(mapPlayerDidBefore);
      if (!mapPlayerDidBefore) {
        playerInStore.maps.push({ name: currentMap, time: currentTime });
      } else {
        console.log(mapPlayerDidBefore);
        console.log(currentTime);
        if (mapPlayerDidBefore.time >= currentTime) {
          playerInStore.maps = playerInStore.maps.map((entry) => {
            if (entry.name === mapPlayerDidBefore.name) {
              entry.time = currentTime;
            }
            return entry;
          });
        }
      }
      savedPlayers = savedPlayers.map((entry) => {
        if (entry.name === currentPlayer) {
          entry = playerInStore;
        }
        return entry;
      });
    }
  }
  console.log(savedPlayers);
  console.log("leaderboard");
  localStorage.setItem("leaderboard", JSON.stringify(savedPlayers));
};

function handleClick(event) {
  const targetElement = event.target;
  const parentElement = targetElement.parentNode;

  let buttons = parentElement.querySelectorAll("button");
  buttons = Array.from(buttons);
  buttons.map((button) => button.classList.remove("selected-tab"));
  targetElement.classList.add("selected-tab");

  const idSelector = targetElement.id;
  const containerToReveal = mapselectorContainer.querySelector(
    `div#${idSelector}`
  );

  let containersToHide = mapselectorContainer.querySelectorAll("div");
  containersToHide = Array.from(containersToHide);
  containersToHide.forEach((item) => {
    item.classList.add("hidden");
    item.style.display = "none";
    item.classList.remove("flex");
  });
  containerToReveal.style.display = "block";

  if (idSelector === "saved-maps") {
    generateSavedMaps(savedMaps);
  }
  if (idSelector == "load-games") {
    containerToReveal.classList.add("flex");
    containerToReveal.style.display = "flex";
    showSavedGames();
    if (!containerToReveal.innerHTML) {
      containerToReveal.innerHTML = `
      <span>If there are no games here, click on<b><i> Get saved games</i></b> at the bottom left</span>`;
    }
  }
  console.log(containerToReveal);
  containerToReveal.classList.remove("hidden");
}

delegate(mapselectorContainer, "click", "div>section>button", handleClick);
