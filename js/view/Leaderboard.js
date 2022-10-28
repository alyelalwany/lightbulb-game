const Leaderboard = document.querySelector("div#leaderboard");

const keyFilter = (key) => {
  return key !== "board" && key !== "current-player" && key != "saved-games";
};

export const updateData = () => {
  const listOfPlayers = Object.keys(localStorage).filter((key) =>
    keyFilter(key)
  );
  return listOfPlayers.map((name) => {
    let mapDetails = JSON.parse(localStorage.getItem(name));
    let returnData = {
      name: name,
      mapDetails: mapDetails,
    };
    // console.log(returnData);
    return returnData;
  });
};

export const renderLeaderboard = (list, div) => {
  div.innerHTML = `
  <h2>Our veterans</h2>
  <table>
   ${list
     .map((obj) => {
       return `
      <tr>
      <td>${obj.name} </td> 
     ${obj.mapDetails
       .map(
         (mapObj) =>
           `<td>${Object.keys(mapObj)[0]} :${Object.values(mapObj)[0]}</td>`
       )
       .join("")}
    </tr>
    `;
     })
     .join("")}
    </table>
    `;
};
