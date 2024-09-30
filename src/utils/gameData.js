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
    homeTeamLogo: game.teams.home.logo, // Optionally include logos
    awayTeamLogo: game.teams.away.logo,
    status: game.fixture.status.short, // Optional status, in case you need it
    score: game.score, // Optional, if score is available
    events: game.events, // Optional, if there are events (e.g., goals)
  };
};

export default gameData;
