export function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function xyCoord(tableCell) {
  const x = tableCell.cellIndex;
  const tableRow = tableCell.parentNode;
  const y = tableRow.sectionRowIndex;
  return { x, y };
}

export const hasWon = (board) => {
  let whiteTiles = board.map((row) => row.filter((tile) => !tile.getIsBlack()));
  return whiteTiles.every((row) =>
    row.every((tile) => tile.getIsIlluminated())
  );
};
