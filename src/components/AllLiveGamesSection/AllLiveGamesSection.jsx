import React, { useState, useEffect, useContext } from "react";
import AuthContext from "../../contexts/AuthContext";
import axios from "axios";
import GameModal from "../GameModal/GameModal";
import Preloader from "../Preloader/Preloader";
import "./AllLiveGamesSection.css";

function AllLiveGamesSection({
  openLoginModal,
  saveGame,
  currentUser,
  setCurrentUser,
}) {
  const [liveGames, setLiveGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedGame, setSelectedGame] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const { isLoggedIn } = useContext(AuthContext);
  const [visibleGamesCount, setVisibleGamesCount] = useState(10);

  useEffect(() => {
    const fetchLiveGames = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(
          `https://api-football-v1.p.rapidapi.com/v3/fixtures`,
          {
            headers: {
              "X-RapidAPI-Key": import.meta.env.VITE_API_KEY,
              "X-RapidAPI-Host": "api-football-v1.p.rapidapi.com",
            },
            params: {
              live: "all",
            },
          }
        );
        if (response.data && response.data.response) {
          setLiveGames(response.data.response);
        } else {
          setLiveGames([]);
        }
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchLiveGames();
  }, []);

  const handleCardClick = (game) => {
    console.log("Game clicked:", game);
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
        className="alllivegamessection__team-logo"
      />
    ) : (
      <span className="alllivegamessection__team-logo">N/A</span>
    );
  };

  if (loading) {
    return <Preloader className="alllivegamessection__preloader" />;
  }
  if (error) {
    return <p>Error: {error.message}</p>;
  }

  return (
    <div className="alllivegamessection">
      <h2 className="alllivegamessection__header">Current Live Games</h2>
      <ul className="alllivegamessection__card-list">
        {liveGames.length > 0 ? (
          liveGames.slice(0, visibleGamesCount).map((game) => (
            <li
              key={game.fixture.id}
              className="alllivegamessection__card"
              onClick={() => handleCardClick(game)}
            >
              <div className="alllivegamessection__teams-date">
                <span className="alllivegamessection__live">LIVE</span>
              </div>
              <div className="alllivegamessection__teams">
                <div className="alllivegamessection__team">
                  {renderTeamLogo(game.teams.home)}
                  <span className="alllivegamessection__teams-name">
                    {game.teams.home.name}
                  </span>
                </div>
                <span className="alllivegamessection__vs">vs</span>
                <div className="alllivegamessection__team">
                  {renderTeamLogo(game.teams.away)}
                  <span className="alllivegamessection__teams-name">
                    {game.teams.away.name}
                  </span>
                </div>
              </div>
            </li>
          ))
        ) : (
          <li>No live games available at the moment.</li>
        )}
      </ul>
      {visibleGamesCount < liveGames.length && (
        <button
          onClick={handleShowMore}
          className="alllivegamessection__show-more"
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
          saveGame={saveGame}
          currentUser={currentUser}
          setCurrentUser={setCurrentUser}
        />
      )}
    </div>
  );
}

export default AllLiveGamesSection;
