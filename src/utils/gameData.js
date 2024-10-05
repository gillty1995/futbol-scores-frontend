const gameData = (game, currentUser) => {
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
    league: {
      id: game.league
        ? game.league.id
          ? game.league.id.toString()
          : "Unknown ID"
        : "N/A",
      name: game.league
        ? game.league.name
          ? game.league.name
          : "Unknown League"
        : "Unknown",
    },
  };
};

export default gameData;
