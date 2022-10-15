import { hasWon } from "../utils/MathFunctions.js";

export function render(board, boardDiv) {
  renderBoard(board, boardDiv);
  renderStatus();
}

function renderStatus(solved, gameState) {}

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
        <td class="tile ${tile.getHasBulb() ? "bulb" : ""} ${
              tile.getIsBlack() ? "black" : ""
            } ${tile.getIsIlluminated() ? "illuminated" : ""}">
            ${
              tile.getIsBlack()
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
  if (hasWon(board)) {
    alert("Won!");
  }
}
