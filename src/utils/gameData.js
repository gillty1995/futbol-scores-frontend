const gameData = (game, userId) => {
  if (!game || !game.fixture || !game.teams) {
    return null;
  }

  return {
    fixtureId: game.fixture.id.toString(),
    user: userId,
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
    // status: "scheduled",
  };
};

export default gameData;
