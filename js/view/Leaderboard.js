const leaderboard = document.querySelector("div#leaderboard");
const listElement = leaderboard.querySelector("ul");

let listOfPlayers = Object.keys(localStorage);

//Works
// listOfPlayers.map((item) =>
//   console.log(JSON.parse(localStorage.getItem(item)))
// );

listElement.innerHTML = renderLeaderboardList(listOfPlayers);

function renderLeaderboardList(list) {
  return listOfPlayers.map((username) => `<li>${username}</li>`).join("");
}
