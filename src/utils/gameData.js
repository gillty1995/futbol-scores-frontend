const gameData = (game, currentUser) => {
  if (!game || !game.fixture || !game.teams) {
    return null;
  }
  console.log(currentUser);

  const gameDateTime = new Date(game.fixture.date);
  let status;

  if (gameDateTime > new Date()) {
    status = "scheduled";
  } else if (gameDateTime <= new Date() && game.fixture.completed) {
    status = "completed";
  } else {
    status = "live";
  }

  return {
    fixtureId: game.fixture.id.toString(),
    user: currentUser,
    teams: {
      home: {
        id: game.teams.home.id.toString(),
        name: game.teams.home.name,
        logo: game.teams.home.logo,
      },
      away: {
        id: game.teams.away.id.toString(),
        name: game.teams.away.name,
        logo: game.teams.away.logo,
      },
    },
    dateTime: new Date(game.fixture.date),
    status: status,
    liveScore: {},
    liveEvents: [],
  };
};

export default gameData;
