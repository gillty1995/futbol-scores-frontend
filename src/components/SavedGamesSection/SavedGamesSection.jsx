import React, { useState, useEffect, useContext } from "react";
import AuthContext from "../../contexts/AuthContext";
import axios from "axios";
import GameModal from "../GameModal/GameModal";
import Preloader from "../Preloader/Preloader";
import { baseUrl } from "../../utils/constants";
import "./SavedGamesSection.css";

function SavedGamesSection({ game, currentUser, setCurrentUser }) {
  const [savedGames, setSavedGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedGame, setSelectedGame] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const { isLoggedIn } = useContext(AuthContext);
  const [visibleGamesCount, setVisibleGamesCount] = useState(10);

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

  useEffect(() => {
    const fetchSavedGames = async () => {
      setLoading(true);
      setError(null);

      if (!isLoggedIn) {
        setLoading(false);
        return;
      }

      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${baseUrl}/me/games`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("Fetched saved games:", response.data);

        if (Array.isArray(response.data)) {
          const formattedGames = response.data.map((game) => ({
            fixture: {
              id: game.fixtureId,
              date: game.dateTime,
            },
            league: {
              id: game.league?.id || null,
              name: game.league?.name || null,
              logo: game.league?.logo || null,
              country: game.league?.country || null,
              flag: game.league?.flag || null,
            },
            teams: game.teams,
            goals: {
              home: 0,
              away: 0,
            },
            score: {
              halftime: {
                home: null,
                away: null,
              },
              fulltime: {
                home: null,
                away: null,
              },
            },

            user: game.user || "Unknown",
          }));

          formattedGames.sort(
            (a, b) => new Date(a.fixture.date) - new Date(b.fixture.date)
          );

          setSavedGames(formattedGames);
        } else {
          console.error("Expected an array but got:", response.data);
          setSavedGames([]);
        }
      } catch (err) {
        const errorMessage = err.response
          ? err.response.data.message || err.response.statusText
          : err.message;
        console.error("Error fetching saved games:", errorMessage);
        setError(new Error(errorMessage));
      } finally {
        setTimeout(() => {
          setLoading(false);
        }, 1000);
      }
    };

    fetchSavedGames();
  }, [isLoggedIn]);

  const handleCardClick = (game) => {
    setSelectedGame(game);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedGame(null);
  };

  const handleShowMore = () => {
    setVisibleGamesCount((prevCount) => prevCount + 10);
  };

  const renderTeamLogo = (team) => {
    return team.logo ? (
      <img
        src={team.logo}
        alt={`${team.name} logo`}
        className="savedgamessection__team-logo"
      />
    ) : (
      <span className="savedgamessection__team-logo">N/A</span>
    );
  };

  if (loading) {
    return <Preloader className="savedgamessection__preloader" />;
  }

  if (error) {
    return <p className="savedgamessection__error">Error: {error.message}</p>;
  }

  return (
    <div className="savedgamessection">
      <h2 className="savedgamessection__header">Saved Games</h2>
      <ul className="savedgamessection__card-list">
        {savedGames.length > 0 ? (
          savedGames.slice(0, visibleGamesCount).map((game) => (
            <li
              key={game.fixture.id}
              className="savedgamessection__card"
              onClick={() => handleCardClick(game)}
            >
              <div className="savedgamessection__teams-date">
                <span
                  className={`savedgamessection__date ${
                    isLive(game.fixture.date) ? "savedgamessection__live" : ""
                  }`}
                >
                  {isLive(game.fixture.date) ? (
                    "LIVE"
                  ) : isGameOver(game.fixture.date) ? (
                    <>
                      {formatDate(game.fixture.date)}{" "}
                      <span className="savedgamessection__final">FINAL</span>
                    </>
                  ) : (
                    `${formatDate(game.fixture.date)} ${formatTime(
                      game.fixture.date
                    )}`
                  )}
                </span>
              </div>
              <div className="savedgamessection__teams">
                <div className="savedgamessection__team">
                  {renderTeamLogo(game.teams.home)}
                  <span className="savedgamessection__teams-name">
                    {game.teams.home.name}
                  </span>
                </div>
                <span className="savedgamessection__vs">vs</span>
                <div className="savedgamessection__team">
                  {renderTeamLogo(game.teams.away)}
                  <span className="savedgamessection__teams-name">
                    {game.teams.away.name}
                  </span>
                </div>
              </div>
            </li>
          ))
        ) : (
          <li className="savedgamessection__no-games">
            No saved games available at the moment.
          </li>
        )}
      </ul>
      {visibleGamesCount < savedGames.length && (
        <button
          onClick={handleShowMore}
          className="savedgamessection__show-more"
        >
          Show More
        </button>
      )}
      {modalOpen && selectedGame && (
        <GameModal
          game={selectedGame}
          onClose={handleCloseModal}
          isLoggedIn={isLoggedIn}
          currentUser={currentUser}
          setCurrentUser={setCurrentUser}
        />
      )}
    </div>
  );
}

export default SavedGamesSection;
