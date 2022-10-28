import { renderBoard } from "../view/BoardUI.js";

export function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const allBoardTilesUsed = (board) => {
  return board.every((row) =>
    row.every((tile) => tile.getHasBulb() || getIsIlluminated() || getIsBlack())
  );
};

export const hasWon = (game) => {
  return (
    isAllInCorrectPosition(game.board) &&
    isPlayerFinishedPuzzle(game.board) &&
    isNumberedTilesHaveCorrectNumberOfBulbs(game.board)
  );
};

export function isNumberedTilesHaveCorrectNumberOfBulbs(board) {
  let blackTilesWithNumbers = board
    .map((row) =>
      row.filter((tile) => tile.getIsBlack() && tile.getNumber() !== -1)
    )
    .filter((row) => row.length !== 0)
    .flat();
  console.log(blackTilesWithNumbers);
  return blackTilesWithNumbers.every(
    (tile) => tile.surroundingBulbs === tile.getNumber()
  );
}

function isPlayerFinishedPuzzle(board) {
  let whiteTiles = board.map((row) => row.filter((tile) => !tile.getIsBlack()));
  return whiteTiles.every((row) =>
    row.every((tile) => tile.getIsIlluminated() || tile.getHasBulb())
  );
}

function isAllInCorrectPosition(board) {
  return board.every((row) =>
    row.every((tile) => !tile.getBulbIsInWrongPosition())
  );
}

let counter = 0;
let timeOutId;
export function startCounter(selector) {
  let element = window.document.querySelector(selector);
  element.innerHTML = `Time elapsed : ${counter} sec`;
  counter += 1;
  timeOutId = setTimeout(startCounter, 1000, selector);
}

export function resetCounter(selector, number = 0) {
  console.log(number);
  counter = number;
  let element = window.document.querySelector(selector);
  element.innerHTML = `Time elapsed : ${counter} sec`;
}

export function stopCounter() {
  clearTimeout(timeOutId);
}

export function checkIfBulbsInCorrectPosition(board, boardDiv) {
  let tilesWithBulbs = board
    .map((row) => row.filter((cell) => cell.getHasBulb()))
    .filter((row) => row.length != 0)
    .flat();

  console.log(tilesWithBulbs);
  board.map((row) => row.map((cell) => cell.setBulbIsInWrongPosition(false)));

  if (tilesWithBulbs.length != 0) {
    tilesWithBulbs.map((tile) => checkBulbsHorizontal(tile, board));
    renderBoard(board, boardDiv);
    tilesWithBulbs.map((tile) => checkBulbsVertical(tile, board));
    renderBoard(board, boardDiv);
  }
}

export function checkBulbsHorizontal(tile, board) {
  let { x, y } = tile.getCoords();
  let currentColumn = x + 1;
  if (currentColumn >= board.length) return;
  while (
    currentColumn < board.length &&
    !board[y][currentColumn].getIsBlack()
  ) {
    // console.log(board[y][currentColumn]);
    if (board[y][currentColumn].getHasBulb()) {
      board[y][currentColumn].setBulbIsInWrongPosition(true);
      board[y][x].setBulbIsInWrongPosition(true);
    }
    currentColumn++;
  }
  currentColumn = x - 1;
  if (currentColumn < 0) return;
  while (currentColumn >= 0 && !board[y][currentColumn].getIsBlack()) {
    // console.log(board[y][currentColumn]);
    if (board[y][currentColumn].getHasBulb()) {
      board[y][currentColumn].setBulbIsInWrongPosition(true);
      board[y][x].setBulbIsInWrongPosition(true);
    } else if (!board[y][currentColumn].getHasBulb()) {
    }
    currentColumn--;
  }
}

export function checkBulbsVertical(tile, board) {
  let { x, y } = tile.getCoords();
  let currentRow = y + 1;
  if (currentRow >= board.length) return;
  while (currentRow < board.length && !board[currentRow][x].getIsBlack()) {
    // console.log(board[currentRow][x]);
    if (board[currentRow][x].getHasBulb()) {
      board[currentRow][x].setBulbIsInWrongPosition(true);
      board[y][x].setBulbIsInWrongPosition(true);
    }
    currentRow++;
  }
  currentRow = y - 1;
  if (currentRow < 0) return;
  while (currentRow >= 0 && !board[currentRow][x].getIsBlack()) {
    // console.log(board[currentRow][x]);
    if (board[currentRow][x].getHasBulb()) {
      board[currentRow][x].setBulbIsInWrongPosition(true);
      board[y][x].setBulbIsInWrongPosition(true);
    } else if (!board[currentRow][x].getHasBulb()) {
    }
    currentRow--;
  }
}

//stored to check for later

function checkSolution(board, currentTile, boardDiv) {
  checkSolutionHorizontally(board, currentTile, boardDiv);
  checkSolutionVertically(board, currentTile, boardDiv);
}

function checkSolutionHorizontally(board, currentTile, boardDiv) {
  let { x, y } = xyCoord(currentTile);
  let clickedTile = board[y][x];
  // console.log(clickedTile);

  let currentColumn = x + 1;
  while (currentColumn < board.length) {
    let tile = board[y][currentColumn];
    if (tile.getIsBlack()) {
      break;
    }
    if (tile.getHasBulb() && board[y][x].getHasBulb()) {
      board[y][x].setBulbIsInWrongPosition(true);
      board[y][currentColumn].setBulbIsInWrongPosition(true);
      console.log(`Found a bulb : ${JSON.stringify(tile)}`);
      game.gameState = GAME_STATE.IN_GAME;
      // break;
    } else if (!board[y][x].getHasBulb()) {
      board[y][x].setBulbIsInWrongPosition(false);
      board[y][currentColumn].setBulbIsInWrongPosition(false);
      // console.log(`Found a bulb : ${JSON.stringify(tile)}`);
    }
    currentColumn++;
  }

  currentColumn = x - 1;
  while (currentColumn >= 0) {
    let tile = board[y][currentColumn];
    if (tile.getIsBlack()) {
      break;
    }
    if (tile.getHasBulb() && board[y][x].getHasBulb()) {
      board[y][x].setBulbIsInWrongPosition(true);
      board[y][currentColumn].setBulbIsInWrongPosition(true);
      console.log(`Found a bulb : ${JSON.stringify(tile)}`);
      game.gameState = GAME_STATE.IN_GAME;
      // break;
    } else if (!board[y][x].getHasBulb()) {
      board[y][x].setBulbIsInWrongPosition(false);
      board[y][currentColumn].setBulbIsInWrongPosition(false);
    }
    currentColumn--;
  }
}

function checkSolutionVertically(board, currentTile, boardDiv) {
  let { x, y } = xyCoord(currentTile);
  let clickedTile = board[y][x];
  // console.log(clickedTile);

  let currentRow = y + 1;
  while (currentRow < board.length) {
    let tile = board[currentRow][x];
    if (tile.getIsBlack()) {
      break;
    }
    if (tile.getHasBulb() && board[y][x].getHasBulb()) {
      board[y][x].setBulbIsInWrongPosition(true);
      board[currentRow][x].setBulbIsInWrongPosition(true);
      console.log(`Found a bulb : ${JSON.stringify(tile)}`);
      game.gameState = GAME_STATE.IN_GAME;
      // break;
    } else if (!board[y][x].getHasBulb()) {
      board[y][x].setBulbIsInWrongPosition(false);
      board[currentRow][x].setBulbIsInWrongPosition(false);
    }
    currentRow++;
  }

  currentRow = y - 1;
  while (currentRow >= 0) {
    let tile = board[currentRow][x];
    if (tile.getIsBlack()) {
      break;
    }
    if (tile.getHasBulb() && board[y][x].getHasBulb()) {
      board[y][x].setBulbIsInWrongPosition(true);
      board[currentRow][x].setBulbIsInWrongPosition(true);
      console.log(`Found a bulb : ${JSON.stringify(tile)}`);
      game.gameState = GAME_STATE.IN_GAME;
      // break;
    } else if (!board[y][x].getHasBulb()) {
      board[y][x].setBulbIsInWrongPosition(false);
      board[currentRow][x].setBulbIsInWrongPosition(false);
    }
    currentRow--;
  }
}
