const signupForm = document.querySelector("div#signup");
const inputElement = signupForm.querySelector("input[name=name]");
const mapsElement = signupForm.querySelector("select[name=maps]");
const signupButton = signupForm.querySelector("button");
const gameDisplay = document.querySelector("#game-display");

// signupButton.addEventListener("click", function (event) {
//   event.preventDefault();

//   const username = inputElement.value;
//   if (username === "") {
//     inputElement.setCustomValidity("Username cannot be empty");
//     return;
//   }
//   const selectedMap = mapsElement.value;
//   let userMaps = JSON.parse(localStorage.getItem(username));
//   if (!userMaps) {
//     let usernameValue = [{ [selectedMap]: 0 }];
//     localStorage.setItem(username, JSON.stringify(usernameValue));
//   } else {
//     let registeredMap = userMaps.find(
//       (map) => Object.keys(map)[0] === selectedMap
//     );

//     if (!registeredMap) {
//       let mapToAdd = { [selectedMap]: 0 };
//       userMaps.push(mapToAdd);
//     }
//     let mapStatsString = JSON.stringify(userMaps);
//     localStorage.setItem(username, mapStatsString);
//     let currentPlayerString = JSON.stringify({
//       username: username,
//       details: mapStatsString,
//     });
//     console.log(JSON.parse(currentPlayerString));
//     localStorage.setItem("current-player", currentPlayerString);
//     gameDisplay.hidden = false;
//   }
// });
