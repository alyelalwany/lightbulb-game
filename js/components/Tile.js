import { getRandomInt } from "../utils/MathFunctions.js";

export class Tile {
  #xCoord;
  #yCoord;
  #hasBulb;
  #isIlluminated;
  #black;
  #number;
  constructor(x, y, black) {
    this.#xCoord = x;
    this.#yCoord = y;
    this.#hasBulb = false;
    this.#isIlluminated = false;
    this.#black = black;
    if (this.#black) {
      this.#number = getRandomInt(0, 4);
    }
  }
  setHasBulb(value) {
    this.#hasBulb = value;
  }
  setIsIlluminated(value) {
    this.#isIlluminated = value;
  }
  setIsBlack(value) {
    this.#black = value;
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
}
