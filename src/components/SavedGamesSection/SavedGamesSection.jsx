import React, { useContext, useState, useEffect } from "react";
import GamesSection from "../GamesSection/GamesSection";
import AuthContext from "../../contexts/AuthContext";
import { saveGame, getSavedGames } from "../../utils/auth";

function SavedGamesSection({ openLoginModal }) {
  const { isLoggedIn } = useContext(AuthContext);
  const [savedGames, setSavedGames] = useState([]);
  const [selectedGame, setSelectedGame] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const fetchSavedGames = async () => {
    try {
      const savedGamesData = await getSavedGames();
      setSavedGames(savedGamesData);
    } catch (error) {
      console.error("Error fetching saved games:", error);
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

  return (
    <div className="savedgamessection">
      <h2>Saved Games</h2>
      {savedGames.length === 0 ? (
        <p>No games saved yet.</p>
      ) : (
        <GamesSection
          openLoginModal={openLoginModal}
          saveGame={handleSaveGame}
          games={savedGames}
          handleCardClick={handleCardClick}
          isLive={isLive}
          formatDate={formatDate}
          formatTime={formatTime}
          selectedGame={selectedGame}
          modalOpen={modalOpen}
          handleCloseModal={handleCloseModal}
        />
      )}
    </div>
  );
}

export default SavedGamesSection;
