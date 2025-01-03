import React, { useState, useEffect, useContext } from "react";
import AuthContext from "../../contexts/AuthContext";
import { useParams } from "react-router-dom";
import axios from "axios";
import GameModal from "../GameModal/GameModal";
import Preloader from "../Preloader/Preloader";
import "./GamesSection.css";

function GamesSection({
  openLoginModal,
  saveGame,
  currentUser,
  setCurrentUser,
}) {
  const { teamId } = useParams();
  const [games, setGames] = useState([]);
  const [teamName, setTeamName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedGame, setSelectedGame] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const { isLoggedIn } = useContext(AuthContext);
  const { setTeamData } = useContext(AuthContext);

  console.log(currentUser);

  const today = new Date();
  const twoWeeksFromNow = new Date(today);
  twoWeeksFromNow.setDate(today.getDate() + 14);

  const formatDateForAPI = (date) => {
    const dateObj = new Date(date);
    return dateObj.toISOString().split("T")[0];
  };

  const formatDate = (date) => {
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) return "";

    const month = dateObj.getMonth() + 1;
    const day = dateObj.getDate();

    return `${month.toString().padStart(2, "0")}/${day
      .toString()
      .padStart(2, "0")}`;
  };

  const formatTime = (dateTime) => {
    const dateObj = new Date(dateTime);
    if (isNaN(dateObj.getTime())) return "";

    const options = { hour: "numeric", minute: "2-digit", hour12: true };
    return dateObj.toLocaleTimeString([], options).replace(/^0/, "");
  };

  const isLive = (dateTime) => {
    const now = new Date();
    const gameDate = new Date(dateTime);
    return (
      now >= gameDate && now <= new Date(gameDate.getTime() + 120 * 60 * 1000)
    );
  };

  const isGameOver = (dateTime) => {
    const now = new Date();
    const gameEnd = new Date(new Date(dateTime).getTime() + 120 * 60 * 1000);
    return now > gameEnd;
  };

  const startDate = formatDateForAPI(today);
  const endDate = formatDateForAPI(twoWeeksFromNow);

  const getSeasonYear = (date) => {
    const currentMonth = date.getMonth();
    return currentMonth < 6 ? date.getFullYear() - 1 : date.getFullYear();
  };

  const seasonYear = getSeasonYear(today);

  useEffect(() => {
    const fetchTeamData = async () => {
      setLoading(true);
      setError(null);
      try {
        const teamResponse = await axios.get(
          `https://api-football-v1.p.rapidapi.com/v3/teams`,
          {
            headers: {
              "X-RapidAPI-Key": import.meta.env.VITE_API_KEY,
              "X-RapidAPI-Host": "api-football-v1.p.rapidapi.com",
            },
            params: {
              id: teamId,
            },
          }
        );
        console.log("Team Response:", teamResponse.data);
        console.log("Full Team Response:", teamResponse.data);
        console.log("Team Response Array:", teamResponse.data.response);
        const teamData = teamResponse.data.response[0];
        if (!teamData) {
          throw new Error("No team data found");
        }
        setTeamName(teamData.team.name);
        setTeamData(teamData);

        const gamesResponse = await axios.get(
          `https://api-football-v1.p.rapidapi.com/v3/fixtures`,
          {
            headers: {
              "X-RapidAPI-Key": import.meta.env.VITE_API_KEY,
              "X-RapidAPI-Host": "api-football-v1.p.rapidapi.com",
            },
            params: {
              team: teamId,
              // season: new Date().getFullYear(),
              season: seasonYear,
              from: startDate,
              to: endDate,
            },
          }
        );

        console.log("Games Response:", gamesResponse.data.response);
        console.log("Games Response Full Data:", gamesResponse.data);
        console.log("Start Date:", startDate);
        console.log("End Date:", endDate);

        const sortedGames = gamesResponse.data.response.sort((a, b) => {
          return new Date(a.fixture.date) - new Date(b.fixture.date);
        });
        setGames(sortedGames);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTeamData();
  }, [teamId, startDate, endDate]);

  const handleCardClick = (game) => {
    console.log("Game clicked:", game);
    setSelectedGame(game);
    console.log(selectedGame);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedGame(null);
  };

  if (loading) return <Preloader className="gamessection__preloader" />;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="gamessection">
      <h2 className="gamessection__header">
        Games for Team {teamName} from {formatDate(today)} to{" "}
        {formatDate(twoWeeksFromNow)}
      </h2>
      {games.length === 0 ? (
        <p className="gamessection__no-games">No games during this period.</p>
      ) : (
        <ul className="gamessection__card-list">
          {games.map((game) => (
            <li
              key={game.fixture.id}
              className="gamessection__card"
              onClick={() => handleCardClick(game)}
            >
              <div className="gamessection__teams-date">
                <span
                  className={`gamessection__date ${
                    isLive(game.fixture.date) ? "gamessection__live" : ""
                  }`}
                >
                  {isLive(game.fixture.date) ? (
                    "LIVE"
                  ) : isGameOver(game.fixture.date) ? (
                    <>
                      {formatDate(game.fixture.date)}{" "}
                      <span className="gamessection__final">FINAL</span>
                    </>
                  ) : (
                    `${formatDate(game.fixture.date)} ${formatTime(
                      game.fixture.date
                    )}`
                  )}
                </span>
              </div>
              <div className="gamessection__teams">
                <div className="gamessection__team">
                  <img
                    src={game.teams.home.logo}
                    alt={`${game.teams.home.name} logo`}
                    className="gamessection__team-logo"
                  />
                  <span className="gamessection__teams-name">
                    {game.teams.home.name}
                  </span>
                </div>
                <span className="gamessection__vs">vs</span>
                <div className="gamessection__team">
                  <img
                    src={game.teams.away.logo}
                    alt={`${game.teams.away.name} logo`}
                    className="gamessection__team-logo"
                  />
                  <span className="gamessection__teams-name">
                    {game.teams.away.name}
                  </span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
      {modalOpen && selectedGame && (
        <GameModal
          game={selectedGame}
          onClose={handleCloseModal}
          isLoggedIn={isLoggedIn}
          openLoginModal={openLoginModal}
          saveGame={saveGame}
          currentUser={currentUser}
          setCurrentUser={setCurrentUser}
        />
      )}
    </div>
  );
}

export default GamesSection;
