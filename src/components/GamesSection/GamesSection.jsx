import React, { useState, useEffect, useContext } from "react";
import AuthContext from "../../contexts/AuthContext";
import { useParams } from "react-router-dom";
import axios from "axios";
import GameModal from "../GameModal/GameModal";
import Preloader from "../Preloader/Preloader";
import "./GamesSection.css";

function GamesSection({ openLoginModal }) {
  const { teamId } = useParams();
  const [games, setGames] = useState([]);
  const [teamName, setTeamName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedGame, setSelectedGame] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const { isLoggedIn } = useContext(AuthContext);

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

  const startDate = formatDateForAPI(today);
  const endDate = formatDateForAPI(twoWeeksFromNow);

  useEffect(() => {
    const fetchTeamData = async () => {
      setLoading(true);
      setError(null);

      setTimeout(async () => {
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
          const teamData = teamResponse.data.response[0];
          setTeamName(teamData.team.name);

          const gamesResponse = await axios.get(
            `https://api-football-v1.p.rapidapi.com/v3/fixtures`,
            {
              headers: {
                "X-RapidAPI-Key": import.meta.env.VITE_API_KEY,
                "X-RapidAPI-Host": "api-football-v1.p.rapidapi.com",
              },
              params: {
                team: teamId,
                season: new Date().getFullYear(),
                from: startDate,
                to: endDate,
              },
            }
          );

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
      }, 300);
    };

    fetchTeamData();
  }, [teamId, startDate, endDate]);

  const handleCardClick = (game) => {
    setSelectedGame(game);
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
        <p className="gamessection__no-games">No games during this period.</p> // Display this message if no games are found
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
                  {isLive(game.fixture.date)
                    ? "LIVE"
                    : `${formatDate(game.fixture.date)} ${formatTime(
                        game.fixture.date
                      )}`}
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
        />
      )}
    </div>
  );
}

export default GamesSection;
