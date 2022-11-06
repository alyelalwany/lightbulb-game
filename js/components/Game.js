import { map1, map2, map3 } from "../../assets/maps/Maps.js";
import { Tile, TILE_STATUS } from "./Tile.js";
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
    if (mapName !== "") {
      this.initBoardFromFile(mapName);
    } else {
      this.board = [];
      this.gameState = GAME_STATE.IN_GAME;
    }
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
          cell.number,
          false,
          false,
          false,
          false,
          TILE_STATUS.NEUTRAL
        );
        // console.log(tileToPush);
        rowToInsert.push(tileToPush);
      });
      this.altBoard.push(rowToInsert);
    });
    this.board = this.altBoard;
  }

  randomBoolean() {
    return (Math.random() * 10).toFixed() % 2 === 0;
  }
}
