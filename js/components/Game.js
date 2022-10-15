import { Tile } from "./Tile.js";

export class Game {
  board = [];
  constructor(rows, columns) {
    this.initBoard(rows, columns);
  }

  initBoard(rows, columns) {
    this.board = Array(rows)
      .fill(0)
      .map((row, y) =>
        Array(columns)
          .fill(0)
          .map((cell, x) => {
            return new Tile(x, y, this.randomBoolean());
            // return new Tile(x, y, false);
          })
      );
  }

  randomBoolean() {
    return (Math.random() * 10).toFixed() % 2 === 0;
  }
}
