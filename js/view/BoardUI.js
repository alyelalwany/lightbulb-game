import { TILE_STATUS } from "../components/Tile.js";

export function render(board, boardDiv) {
  renderBoard(board, boardDiv);
  renderStatus();
}

const generateClassForTile = (tile) => {
  let str = "";
  if (tile.getBulbIsInWrongPosition()) {
    str += "wrong ";
  }
  if (tile.getHasBulb()) {
    str += "bulb ";
  }
  if (tile.getIsBlack()) {
    str += "black ";
  }
  if (tile.getIsIlluminated()) {
    str += "illuminated ";
  }
  switch (tile.getTileStatus()) {
    case TILE_STATUS.TOO_MANY_BULBS:
      str += "number-wrong ";
      break;
    case TILE_STATUS.CORRECT_NUMBER_OF_BULBS:
      str += "number-correct";
      break;
    default:
      str += "";
      break;
  }
  return str;
};

export function renderBoard(board, boardDiv) {
  boardDiv.innerHTML = `
    <table>
    ${board
      .map(
        (row) => `
    <tr>
        ${row
          .map(
            (tile) => `
        <td class="tile ${generateClassForTile(tile)}">
            ${
              tile.getIsBlack() && tile.getNumber() !== -1
                ? tile.getNumber()
                : tile.getHasBulb()
                ? "💡"
                : ""
            }
        </td>
        `
          )
          .join("")}

    </tr>
    `
      )
      .join("")}
    </table>`;
}

function checkIfValidSolution(board) {}

export function xyCoord(tableCell) {
  const x = tableCell.cellIndex;
  const tableRow = tableCell.parentNode;
  const y = tableRow.sectionRowIndex;
  return { x, y };
}
export function getTileFromTable(x, y, boardDiv) {
  const tableDiv = boardDiv.querySelector("#board table");
  return tableDiv.rows[y].cells[x];
}
export function removeLight(board, currentTile, boardDiv) {
  let { x, y } = xyCoord(currentTile);
  // console.log(`Removing light from : ${x} , ${y}`);
  handleLightHorizontally(board, currentTile, false);
  handleLightVertically(board, currentTile, false);
  // renderBoard(board, boardDiv);
}

export function spreadLight(board, currentTile, boardDiv) {
  let { x, y } = xyCoord(currentTile);
  // console.log(`Spreading light from : ${x} , ${y}`);
  handleLightHorizontally(board, currentTile, true);
  handleLightVertically(board, currentTile, true);
  // renderBoard(board, boardDiv);
}

export function handleLightHorizontally(board, currentTile, illuminate) {
  let { x, y } = xyCoord(currentTile);
  let currentColumn = x + 1;
  let mainTile = board[y][x];

  //Move right
  while (currentColumn < board.length) {
    let tile = board[y][currentColumn];
    // console.log(tile);
    if (tile.getIsBlack()) {
      break;
    }
    tile.setIsIlluminated(illuminate);
    currentColumn++;
  }

  // console.log(`Before going left : (${currentColumn},${y})`);
  currentColumn = x - 1;

  //Move left
  while (currentColumn >= 0) {
    let tile = board[y][currentColumn];

    // console.log(tile);
    if (tile.getIsBlack()) {
      break;
    }

    tile.setIsIlluminated(illuminate);
    // console.log(
    //   `current tile : (${currentColumn},${y}) illuminated : ${tile.getIsIlluminated()}`
    // );
    currentColumn--;
  }
}

export function handleLightVertically(board, currentTile, illuminate) {
  let { x, y } = xyCoord(currentTile);
  let mainTile = board[y][x];
  let currentRow = y + 1;
  // console.log(`illuminate : ${illuminate}`);

  //Move down
  while (currentRow < board.length) {
    let tile = board[currentRow][x];
    // console.log(tile);
    if (tile.getIsBlack()) {
      break;
      //   renderBoard(game.board, boardDiv);
    }

    tile.setIsIlluminated(illuminate);
    currentRow++;
  }
  // console.log(`Before going up : (${x},${currentRow}) `);
  currentRow = y - 1;

  //Move up
  while (currentRow >= 0) {
    let tile = board[currentRow][x];

    // console.log(tile);
    if (tile.getIsBlack()) {
      break;
    }
    tile.setIsIlluminated(illuminate);
    // console.log(
    //   `current tile : (${x},${currentRow}) illuminated : ${tile.getIsIlluminated()}`
    // );
    currentRow--;
  }
}

export function isCorrectNumberOfBulbsAroundTile(board) {
  let blackTiles = [];
  board.map((row) => {
    row.map((cell) => {
      if (cell.getIsBlack()) {
        blackTiles.push(cell);
      }
    });
  });
  blackTiles = blackTiles.filter((cell) => cell.getNumber() !== -1);
  blackTiles.map((tile) => {
    tile.surroundingBulbs = 0;
    tile.setTileStatus(TILE_STATUS.NEUTRAL);
    countOfBulbsHorizontal(tile, board);
    countOfBulbsVertical(tile, board);
    console.log(tile.getCoords());
    console.log(tile.surroundingBulbs);
    if (tile.surroundingBulbs > tile.getNumber()) {
      tile.setTileStatus(TILE_STATUS.TOO_MANY_BULBS);
    } else if (tile.surroundingBulbs === tile.getNumber()) {
      tile.setTileStatus(TILE_STATUS.CORRECT_NUMBER_OF_BULBS);
    } else {
      tile.setTileStatus(TILE_STATUS.NEUTRAL);
    }
  });
}

function countOfBulbsVertical(tile, board) {
  let { x, y } = tile.getCoords();
  let rowAbove = y - 1;
  let rowBelow = y + 1;
  if (rowAbove >= 0) {
    let tileAbove = board[rowAbove][x];
    if (tileAbove.getHasBulb()) {
      ++tile.surroundingBulbs;
    }
  }
  if (rowBelow < board.length) {
    let tileBelow = board[rowBelow][x];
    if (tileBelow.getHasBulb()) {
      ++tile.surroundingBulbs;
    }
  }
}

function countOfBulbsHorizontal(tile, board) {
  let { x, y } = tile.getCoords();
  let columnBefore = x - 1;
  let columnAfter = x + 1;
  if (columnBefore >= 0) {
    let tileAbove = board[y][columnBefore];
    if (tileAbove.getHasBulb()) {
      ++tile.surroundingBulbs;
    }
  }
  if (columnAfter < board.length) {
    let tileBelow = board[y][columnAfter];
    if (tileBelow.getHasBulb()) {
      ++tile.surroundingBulbs;
    }
  }
}

export function correctLight(board, boardDiv) {
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
