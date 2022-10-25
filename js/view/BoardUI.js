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
{
  /* <td class="tile ${tile.getBulbIsInWrongPosition() ? "wrong" : ""} ${
              tile.getHasBulb() ? "bulb" : ""
            } ${tile.getIsBlack() ? "black" : ""} ${
              tile.getIsIlluminated() ? "illuminated" : ""
            }"> */
}
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
  // if (hasWon(board)) {
  // alert("You won!");
  // restartGame();
  // }
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
  console.log(`Removing light from : ${x} , ${y}`);
  handleLightHorizontally(board, currentTile, false);
  handleLightVertically(board, currentTile, false);
  // renderBoard(board, boardDiv);
}

export function spreadLight(board, currentTile, boardDiv) {
  let { x, y } = xyCoord(currentTile);
  console.log(`Spreading light from : ${x} , ${y}`);
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

  console.log(`Before going left : (${currentColumn},${y})`);
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
  console.log(`Before going up : (${x},${currentRow}) `);
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
