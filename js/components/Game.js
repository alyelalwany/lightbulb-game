import { map1, map2, map3 } from "../../assets/maps/Maps.js";
import { Tile } from "./Tile.js";
export const GAME_STATE = {
  IN_GAME: 0,
  WON: 1,
};
const maps = { map1, map2, map3 };
export class Game {
  board = [];
  altBoard = [];
  gameState = GAME_STATE.IN_GAME;
  constructor(mapName) {
    // this.initBoard(rows, columns);
    this.initBoardFromFile(mapName);
  }

  initBoardFromFile(mapName) {
    this.altBoard = [];
    // console.log(maps[mapName]);
    maps[mapName].map((row, i) => {
      let rowToInsert = [];
      row.map((cell, j) => {
        // console.log(JSON.stringify(cell));
        let tileToPush = Tile.createTile(
          cell.x,
          cell.y,
          cell.black,
          cell.number
        );
        // console.log(tileToPush);
        rowToInsert.push(tileToPush);
      });
      this.altBoard.push(rowToInsert);
    });
    this.board = this.altBoard;
  }

  // initBoard(rows, columns) {
  //   this.board = Array(rows)
  //     .fill(0)
  //     .map((row, y) =>
  //       Array(columns)
  //         .fill(0)
  //         .map((cell, x) => {
  //           return new Tile(x, y, this.randomBoolean());
  //           // return new Tile(x, y, false);
  //         })
  //     );
  // }

  randomBoolean() {
    return (Math.random() * 10).toFixed() % 2 === 0;
  }
}
