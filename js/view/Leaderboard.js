export function loadLeaderboard() {
  let list = JSON.parse(localStorage.getItem("leaderboard"));
  return list;
}

export const renderLeaderboard = (list, div) => {
  div.innerHTML = `
  <h2>Leaderboard</h2>
  <table>
   ${list
     .map((obj) => {
       return `
      <tr>
      <td>${obj.name} </td> 
     ${obj.maps
       .map(
         (mapObj) =>
           `
           <td>${mapObj.name} : ${mapObj.time}sec</td>`
       )
       .join("")}
    </tr>
    `;
     })
     .join("")}
    </table>
    `;
};
