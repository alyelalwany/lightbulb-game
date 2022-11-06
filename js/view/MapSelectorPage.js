import { delegate } from "../utils/EventFunctions.js";
import "./SignupForm.js";
import "./Leaderboard.js";
import { generateSavedMaps } from "../utils/HelperFunctions.js";
import { showSavedGames } from "../index.js";

const mapselectorContainer = document.querySelector(
  "div#mapselector-container"
);
const loadGameEl = document.querySelector("div#load-games");
let savedGames;
const savedMaps = document.querySelector("div#saved-maps");
let leaderBoardList = [];
function handleClick(event) {
  const targetElement = event.target;
  const parentElement = targetElement.parentNode;

  let buttons = parentElement.querySelectorAll("button");
  buttons = Array.from(buttons);
  buttons.map((button) => button.classList.remove("selected-tab"));
  targetElement.classList.add("selected-tab");

  const idSelector = targetElement.id;
  const containerToReveal = mapselectorContainer.querySelector(
    `div#${idSelector}`
  );

  let containersToHide = mapselectorContainer.querySelectorAll("div");
  containersToHide = Array.from(containersToHide);
  containersToHide.forEach((item) => {
    item.classList.add("hidden");
    item.style.display = "none";
    item.classList.remove("flex");
  });
  containerToReveal.style.display = "block";

  if (idSelector === "saved-maps") {
    generateSavedMaps(savedMaps);
  }
  if (idSelector == "load-games") {
    containerToReveal.classList.add("flex");
    containerToReveal.style.display = "flex";
    if (!containerToReveal.innerHTML) {
      containerToReveal.innerHTML = `
      <span>If there are no games here, click on<b><i> Get saved games</i></b> at the bottom left</span>`;
    }
  }
  console.log(containerToReveal);
  containerToReveal.classList.remove("hidden");
}

delegate(mapselectorContainer, "click", "div>section>button", handleClick);
