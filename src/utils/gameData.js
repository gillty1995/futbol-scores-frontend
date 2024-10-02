const gameData = (game, currentUser) => {
  console.log("Fetched game object:", game);

  if (!game || !game.teams) {
    console.error("Invalid game object:", game);
    return null;
  }

  const gameDateTime = new Date(game.dateTime || game.fixture?.date);
  let status;

  if (gameDateTime > new Date()) {
    status = "scheduled";
  } else if (gameDateTime <= new Date() && game.completed) {
    status = "completed";
  } else {
    status = "live";
  }

  return {
    fixtureId: game.fixtureId || game.fixture.id.toString() || "N/A",
    user: currentUser || "Unknown",
    teams: {
      home: {
        id: game.teams.home.id?.toString() || "N/A",
        name: game.teams.home.name || "Unknown",
        logo: game.teams.home.logo || "",
      },
      away: {
        id: game.teams.away.id?.toString() || "N/A",
        name: game.teams.away.name || "Unknown",
        logo: game.teams.away.logo || "",
      },
    },
    dateTime: gameDateTime,
    status: status,
    liveScore: {},
    liveEvents: [],
  };
};

export default gameData;
