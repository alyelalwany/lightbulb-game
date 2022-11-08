import { map1, map2, map3 } from "../../assets/maps/Maps.js";
import { Tile } from "../components/Tile.js";
import {
  genEditTable,
  generateOptions,
  getCustomMaps,
  mapsListToDict,
} from "../utils/HelperFunctions.js";
import { xyCoord } from "./BoardUI.js";

const inputWidth = document.querySelector("#width");
const inputHeight = document.querySelector("#height");
const buttonGenerate = document.querySelector("#generate");
const form = document.querySelector("section form");
const tableEdit = document.querySelector(".edit");
const saveMapButton = document.querySelector("button#save-custom-map");
const BLACK_TILE_COLOR = "#222222";
const WHITE_TILE_COLOR = "#ffffff";
const savedMapsDiv = document.querySelector("div#saved-maps");
const startMapButton = document.querySelector("button#start-custom-map");
const mapSelectEl = document.querySelector("div#signup form select");
let maps = [];
let grid = [];
let savedCustomMaps = [];
let lastMapId;
let allMapsDict = {};

buttonGenerate.addEventListener("click", (event) => {
  event.preventDefault();
  // read
  const w = inputWidth.valueAsNumber;
  const h = inputHeight.valueAsNumber;
  grid = Array(h)
    .fill("#ffffff")
    .map((row) => Array(w).fill("#ffffff"));
  //   console.log(grid);
  tableEdit.innerHTML = genEditTable(grid);
  saveMapButton.classList.remove("hidden");
  startMapButton.classList.remove("hidden");
});

form.addEventListener("change", function (event) {
  const targetElement = event.target;
  if (targetElement.matches("input")) {
    if (!inputHeight.checkValidity() || !inputWidth.checkValidity()) {
      buttonGenerate.disabled = true;
      console.log(buttonGenerate);
      targetElement.setCustomValidity("dimensions can only be between 1-15");
      console.log(
        targetElement.setCustomValidity("dimensions can only be between 1-15")
      );
    } else {
      buttonGenerate.disabled = false;
    }
  }
});

["click", "contextmenu"].forEach((eventType) => {
  tableEdit.addEventListener(eventType, function (e) {
    e.preventDefault();

    if (e.target.matches("td")) {
      const { x, y } = xyCoord(e.target);
      //   console.log(x, y);

      if (y < grid.length && x < grid[0].length) {
        grid[y][x] = BLACK_TILE_COLOR;
        if (e.type === "contextmenu") {
          grid[y][x] = WHITE_TILE_COLOR;
        }
        tableEdit.innerHTML = genEditTable(grid);
      }
      //   console.log(grid);
    }
  });
});

tableEdit.addEventListener("mouseover", function (event) {
  const targetElement = event.target;
  if (targetElement.matches("td")) {
    const { x, y } = xyCoord(targetElement);
    if (y < grid.length && x < grid[0].length) {
      //left mouse button down
      if (event.buttons === 1) {
        grid[y][x] = BLACK_TILE_COLOR;

        tableEdit.innerHTML = genEditTable(grid);
      }
      //right mouse button down
      if (event.buttons === 2) {
        grid[y][x] = WHITE_TILE_COLOR;
        tableEdit.innerHTML = genEditTable(grid);
      }
      // console.log(grid);
    }
  }
});

window.addEventListener("DOMContentLoaded", function (event) {
  savedCustomMaps = JSON.parse(localStorage.getItem("saved-maps"));
  reloadMapsFromStoreAndDefault();
});

saveMapButton.addEventListener("click", (event) => {
  let mapToSave = customMapToBoard(grid);
  let newMap;
  if (savedCustomMaps) {
    lastMapId = savedCustomMaps[savedCustomMaps.length - 1].id + 1;
    newMap = { id: lastMapId, map: mapToSave };
    savedCustomMaps.push(newMap);
  } else {
    lastMapId = 1;
    newMap = { id: lastMapId, map: mapToSave };
    savedCustomMaps = [newMap];
  }
  localStorage.setItem("saved-maps", JSON.stringify(savedCustomMaps));
  reloadMapsFromStoreAndDefault();
});

function reloadMapsFromStoreAndDefault() {
  maps = [map1, map2, map3];
  maps = maps.concat(getCustomMaps());
  generateOptions(mapSelectEl, maps);
  mapsListToDict(maps, allMapsDict);
  console.log(maps);
  console.log(allMapsDict);
}

function customMapToBoard(grid) {
  let matrix = [];

  matrix = grid.map((row, rowIndex) =>
    row.map((cell, columnIndex) => {
      let tile = new Tile(columnIndex, rowIndex, cell === BLACK_TILE_COLOR);
      tile.setNumber(-1);
      tile.surroundingBulbs = 0;
      return tile;
    })
  );

  return matrix;
}

export { allMapsDict };
