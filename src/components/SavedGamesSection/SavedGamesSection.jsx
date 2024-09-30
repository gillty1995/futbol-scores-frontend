import React, { useState, useEffect, useContext } from "react";
import AuthContext from "../../contexts/AuthContext";
import axios from "axios";
import GameModal from "../GameModal/GameModal";
import Preloader from "../Preloader/Preloader";
import gameData from "../../utils/gameData"; // Import the gameData function
import "./SavedGamesSection.css";

function SavedGamesSection({ openLoginModal }) {
  const [savedGames, setSavedGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedGame, setSelectedGame] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const { isLoggedIn } = useContext(AuthContext);
  const [visibleGamesCount, setVisibleGamesCount] = useState(10);

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
        const response = await axios.get("http://localhost:3002/me/games", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("Fetched saved games:", response.data);
        if (Array.isArray(response.data)) {
          const formattedGames = response.data.map((game) => gameData(game));
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
        setLoading(false);
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
              key={game.fixtureId || game.gameId}
              className="savedgamessection__card"
              onClick={() => handleCardClick(game)}
            >
              <div className="savedgamessection__teams-date">
                <span className="savedgamessection__date">
                  {game.dateTime || "Date N/A"}
                </span>
              </div>
              <div className="savedgamessection__teams">
                <div className="savedgamessection__team">
                  {renderTeamLogo(game.homeTeamId)}
                  <span className="savedgamessection__teams-name">
                    {game.homeTeam.name}i
                  </span>
                </div>
                <span className="savedgamessection__vs">vs</span>
                <div className="savedgamessection__team">
                  {renderTeamLogo(game.awayTeam)}
                  <span className="savedgamessection__teams-name">
                    {game.awayTeam.name}
                  </span>
                </div>
              </div>
            </li>
          ))
        ) : (
          <li>No saved games available at the moment.</li>
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
          openLoginModal={openLoginModal}
        />
      )}
    </div>
  );
}

export default SavedGamesSection;
