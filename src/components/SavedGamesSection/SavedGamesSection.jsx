import React, { useContext, useState, useEffect } from "react";
import AuthContext from "../../contexts/AuthContext";
import GameModal from "../GameModal/GameModal";
import { saveGame, getSavedGames } from "../../utils/auth";
import Preloader from "../Preloader/Preloader";
import "./SavedGamesSection.css";

function SavedGamesSection({ openLoginModal }) {
  const { isLoggedIn } = useContext(AuthContext);
  const [savedGames, setSavedGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedGame, setSelectedGame] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const fetchSavedGames = async () => {
    setLoading(true);
    setError(null);
    try {
      const savedGamesData = await getSavedGames();
      console.log(savedGamesData); // Log the data to check its structure
      setSavedGames(savedGamesData);
    } catch (error) {
      console.error("Error fetching saved games:", error);
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSavedGames();
  }, []);

  const handleSaveGame = async (gameData) => {
    try {
      await saveGame(gameData);
      fetchSavedGames();
    } catch (error) {
      console.error("Error saving game:", error);
    }
  };

  const handleCardClick = (game) => {
    setSelectedGame(game);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedGame(null);
  };

  const isLive = (dateTime) => {
    const now = new Date();
    const gameDate = new Date(dateTime);
    return (
      now >= gameDate && now <= new Date(gameDate.getTime() + 120 * 60 * 1000)
    );
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

  if (loading) return <Preloader className="savedgamessection__preloader" />;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="savedgamessection">
      <h2>Saved Games</h2>
      {savedGames.length === 0 ? (
        <p>No games saved yet.</p>
      ) : (
        <ul className="savedgamessection__card-list">
          {savedGames.map((game) => {
            const identifier = game.fixtureId || game.gameId;
            if (!identifier) {
              console.error("Game identifier is undefined:", game);
              return null;
            }

            // Check if teams exist and if home/away properties are defined
            const teams = game.teams || {};
            const homeTeam = teams.home || {};
            const awayTeam = teams.away || {};
            const gameDate = game.fixtureId || game.date;

            return (
              <li
                key={identifier}
                className="savedgamessection__card"
                onClick={() => handleCardClick(game)}
              >
                <div className="savedgamessection__teams-date">
                  <span
                    className={`savedgamessection__date ${
                      isLive(gameDate) ? "savedgamessection__live" : ""
                    }`}
                  >
                    {isLive(gameDate)
                      ? "LIVE"
                      : `${formatDate(gameDate)} ${formatTime(gameDate)}`}
                  </span>
                </div>
                <div className="savedgamessection__teams">
                  <div className="savedgamessection__team">
                    <img
                      src={homeTeam.logo}
                      alt={`${homeTeam.name} logo`}
                      className="savedgamessection__team-logo"
                    />
                    <span className="savedgamessection__teams-name">
                      {homeTeam.name}
                    </span>
                  </div>
                  <span className="savedgamessection__vs">vs</span>
                  <div className="savedgamessection__team">
                    <img
                      src={awayTeam.logo}
                      alt={`${awayTeam.name} logo`}
                      className="savedgamessection__team-logo"
                    />
                    <span className="savedgamessection__teams-name">
                      {awayTeam.name}
                    </span>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
      {modalOpen && selectedGame && (
        <GameModal
          game={selectedGame}
          onClose={handleCloseModal}
          isLoggedIn={isLoggedIn}
          openLoginModal={openLoginModal}
          saveGame={handleSaveGame}
        />
      )}
    </div>
  );
}

export default SavedGamesSection;
