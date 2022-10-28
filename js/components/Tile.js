import { getRandomInt } from "../utils/HelperFunctions.js";

export const TILE_STATUS = {
  TOO_MANY_BULBS: -1,
  CORRECT_NUMBER_OF_BULBS: 1,
  NEUTRAL: 0,
};

export class Tile {
  #xCoord;
  #yCoord;
  #hasBulb;
  #isIlluminated;
  #black;
  #number;
  surroundingBulbs;
  #wrongPositionForBulb = false;
  #tileStatus = TILE_STATUS.NEUTRAL;
  #wrongNumberOfBulbs = false;
  constructor(x, y, black) {
    this.#xCoord = x;
    this.#yCoord = y;
    this.#hasBulb = false;
    this.#isIlluminated = false;
    this.#black = black;
    // if (this.#black) {
    //   this.#number = getRandomInt(0, 4);
    // }
  }

  static createTile(
    x,
    y,
    black,
    number,
    hasBulb,
    isIlluminated,
    wrongNumberOfBulbs,
    wrongPositionForBulb,
    tileStatus
  ) {
    let tile = new Tile(x, y, black);
    tile.setNumber(number);
    tile.#hasBulb = hasBulb;
    tile.#isIlluminated = isIlluminated;
    tile.#wrongNumberOfBulbs = wrongNumberOfBulbs;
    tile.#wrongPositionForBulb = wrongPositionForBulb;
    tile.#tileStatus = tileStatus;
    return tile;
  }

  setHasBulb(value) {
    this.#hasBulb = value;
  }

  setBulbIsInWrongPosition(value) {
    this.#wrongPositionForBulb = value;
  }

  setTileStatus(value) {
    this.#tileStatus = value;
  }

  setHasWrongNumberOfBulbs(value) {
    this.#wrongNumberOfBulbs = value;
  }

  setIsIlluminated(value) {
    this.#isIlluminated = value;
  }

  setIsBlack(value) {
    this.#black = value;
  }
  setNumber(number) {
    this.#number = number;
  }

  getHasBulb() {
    return this.#hasBulb;
  }

  getIsIlluminated() {
    return this.#isIlluminated;
  }

  getIsBlack() {
    return this.#black;
  }

  getNumber() {
    return this.#number;
  }

  getCoords() {
    return { x: this.#xCoord, y: this.#yCoord };
  }

  getBulbIsInWrongPosition() {
    return this.#wrongPositionForBulb;
  }

  getHasWrongNumberOfBulbs(value) {
    return this.#wrongNumberOfBulbs;
  }

  getTileStatus() {
    return this.#tileStatus;
  }

  toJSON() {
    return {
      x: this.#xCoord,
      y: this.#yCoord,
      hasBulb: this.#hasBulb,
      isIlluminated: this.#isIlluminated,
      black: this.#black,
      number: this.#number,
      wrongPositionForBulb: this.#wrongPositionForBulb,
      wrongNumberOfBulbs: this.#wrongNumberOfBulbs,
    };
  }
}
