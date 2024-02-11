const countPlayer = async (team) => {
    let count = 0;
  for (let names of team.values()) {
    count += names.length;
  }
  return count;
  };
  
  // Usage:
  // (async () => {
  //   console.log("Right Team:", await countNames(rightTeam));
  //   console.log("Left Team:", await countNames(leftTeam));
  // })();

export default countPlayer;