// utils/gameData.js

const gameData = (game) => {
  if (!game || !game.fixture || !game.teams) {
    return null;
  }

  return {
    fixtureId: game.fixture.id.toString(),
    homeTeamId: game.teams.home.id.toString(),
    awayTeamId: game.teams.away.id.toString(),
    dateTime: game.fixture.date,
    homeTeamName: game.teams.home.name,
    awayTeamName: game.teams.away.name,
    homeTeamLogo: game.teams.home.logo,
    awayTeamLogo: game.teams.away.logo,
  };
};

export default gameData;
