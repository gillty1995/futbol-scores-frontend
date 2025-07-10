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
  const { isLoggedIn, setTeamData } = useContext(AuthContext);

  const today = new Date();
  const twoWeeksFromNow = new Date(today);
  twoWeeksFromNow.setDate(today.getDate() + 14);

  const formatDateForAPI = (date) => date.toISOString().split("T")[0];

  const formatDate = (date) => {
    const dateObj = new Date(date);
    return isNaN(dateObj.getTime())
      ? ""
      : dateObj.toLocaleDateString("en-US", {
          month: "2-digit",
          day: "2-digit",
        });
  };

  const formatTime = (dateTime) => {
    const dateObj = new Date(dateTime);
    return isNaN(dateObj.getTime())
      ? ""
      : dateObj
          .toLocaleTimeString([], {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
          })
          .replace(/^0/, "");
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
    return now > new Date(new Date(dateTime).getTime() + 120 * 60 * 1000);
  };

  const getCurrentSeason = async () => {
    try {
      const response = await axios.get(
        "https://api-football-v1.p.rapidapi.com/v3/leagues",
        {
          headers: {
            "X-RapidAPI-Key": import.meta.env.VITE_API_KEY,
            "X-RapidAPI-Host": "api-football-v1.p.rapidapi.com",
          },
          params: { team: teamId, status: "NS" },
        }
      );

      const activeSeasons = response.data.response
        .flatMap((league) => league.seasons)
        .filter((season) => season.current);

      return activeSeasons.length > 0
        ? activeSeasons[0].year
        : new Date().getFullYear();
    } catch (err) {
      console.error("Error fetching season year:", err);
      return new Date().getFullYear();
    }
  };

  useEffect(() => {
    const fetchTeamData = async (showLoader = false) => {
      if (showLoader) setLoading(true);
      setError(null);
      try {
        const teamResponse = await axios.get(
          `https://api-football-v1.p.rapidapi.com/v3/teams`,
          {
            headers: {
              "X-RapidAPI-Key": import.meta.env.VITE_API_KEY,
              "X-RapidAPI-Host": "api-football-v1.p.rapidapi.com",
            },
            params: { id: teamId },
          }
        );

        const teamData = teamResponse.data.response[0];
        if (!teamData) throw new Error("No team data found");

        setTeamName(teamData.team.name);
        setTeamData(teamData);

        const seasonYear = await getCurrentSeason();

        const gamesResponse = await axios.get(
          `https://api-football-v1.p.rapidapi.com/v3/fixtures`,
          {
            headers: {
              "X-RapidAPI-Key": import.meta.env.VITE_API_KEY,
              "X-RapidAPI-Host": "api-football-v1.p.rapidapi.com",
            },
            params: {
              team: teamId,
              season: seasonYear,
              from: formatDateForAPI(today),
              to: formatDateForAPI(twoWeeksFromNow),
            },
          }
        );

        const sortedGames = gamesResponse.data.response.sort(
          (a, b) => new Date(a.fixture.date) - new Date(b.fixture.date)
        );
        setGames(sortedGames);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTeamData(true);

    const intervalId = setInterval(() => fetchTeamData(false), 60_000);
    return () => clearInterval(intervalId);
  }, [teamId]);

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
                <span className="gamessection__date">
                  {(() => {
                    const short = game.fixture.status.short;
                    const LIVE_STATUSES = ["1H", "2H", "HT", "ET", "P", "LIVE"];
                    if (short === "FT") {
                      return <span className="gamessection__final">FINAL</span>;
                    } else if (short === "NS") {
                      return `${formatDate(game.fixture.date)} ${formatTime(
                        game.fixture.date
                      )}`;
                    } else if (LIVE_STATUSES.includes(short)) {
                      return <span className="gamessection__live">LIVE</span>;
                    } else {
                      // fallback for other statuses
                      return `${formatDate(game.fixture.date)} ${formatTime(
                        game.fixture.date
                      )}`;
                    }
                  })()}
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
