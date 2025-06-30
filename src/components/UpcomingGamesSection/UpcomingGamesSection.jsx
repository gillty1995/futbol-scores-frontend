import React, { useState, useEffect, useContext } from "react";
import AuthContext from "../../contexts/AuthContext";
import axios from "axios";
import GameModal from "../GameModal/GameModal";
import Preloader from "../Preloader/Preloader";
import "./UpcomingGamesSection.css";

export default function UpcomingGamesSection({
  openLoginModal,
  saveGame,
  currentUser,
  setCurrentUser,
}) {
  const [upcomingGames, setUpcomingGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedGame, setSelectedGame] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const { isLoggedIn } = useContext(AuthContext);
  const [visibleGamesCount, setVisibleGamesCount] = useState(10);

  useEffect(() => {
    let isMounted = true;

    const fetchUpcomingGames = async () => {
      setLoading(true);
      setError(null);

      // Current date string for API (user's local timezone)
      const now = new Date();
      const yyyy = now.getFullYear();
      const mm = String(now.getMonth() + 1).padStart(2, "0");
      const dd = String(now.getDate()).padStart(2, "0");
      const today = `${yyyy}-${mm}-${dd}`;

      try {
        const response = await axios.get(
          "https://api-football-v1.p.rapidapi.com/v3/fixtures",
          {
            headers: {
              "X-RapidAPI-Key": import.meta.env.VITE_API_KEY,
              "X-RapidAPI-Host": "api-football-v1.p.rapidapi.com",
            },
            params: {
              date: today,
              timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            },
          }
        );
        if (!isMounted) return;

        const allFixtures = response.data?.response || [];
        // Exclude games already started and sort by kickoff time ascending
        const upcoming = allFixtures
          .filter((g) => new Date(g.fixture.date) > now)
          .sort((a, b) => new Date(a.fixture.date) - new Date(b.fixture.date));

        setUpcomingGames(upcoming);
      } catch (err) {
        if (!isMounted) return;
        setError(err);
      } finally {
        if (!isMounted) return;
        setLoading(false);
      }
    };

    fetchUpcomingGames();
    const intervalId = setInterval(fetchUpcomingGames, 120_000);
    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, []);

  const handleCardClick = (game) => {
    setSelectedGame(game);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedGame(null);
  };

  const handleShowMore = () => {
    setVisibleGamesCount((prev) => prev + 10);
  };

  const renderTeamLogo = (team) =>
    team.logo ? (
      <img
        src={team.logo}
        alt={`${team.name} logo`}
        className="upcominggamessection__team-logo"
      />
    ) : (
      <span className="upcominggamessection__team-logo">N/A</span>
    );

  if (loading) return <Preloader className="upcominggamessection__preloader" />;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="upcominggamessection">
      <h2 className="upcominggamessection__header">Upcoming Games Today</h2>
      <ul className="upcominggamessection__card-list">
        {upcomingGames.length > 0 ? (
          upcomingGames.slice(0, visibleGamesCount).map((game) => {
            const kickoffLocal = new Date(game.fixture.date).toLocaleTimeString(
              [],
              { hour: "2-digit", minute: "2-digit" }
            );
            return (
              <li
                key={game.fixture.id}
                className="upcominggamessection__card"
                onClick={() => handleCardClick(game)}
              >
                <div className="upcominggamessection__teams-date">
                  <span className="upcominggamessection__upcoming">
                    {kickoffLocal}
                  </span>
                </div>
                <div className="upcominggamessection__teams">
                  <div className="upcominggamessection__team">
                    {renderTeamLogo(game.teams.home)}
                    <span className="upcominggamessection__teams-name">
                      {game.teams.home.name}
                    </span>
                  </div>
                  <span className="upcominggamessection__vs">vs</span>
                  <div className="upcominggamessection__team">
                    {renderTeamLogo(game.teams.away)}
                    <span className="upcominggamessection__teams-name">
                      {game.teams.away.name}
                    </span>
                  </div>
                </div>
              </li>
            );
          })
        ) : (
          <li className="upcominggamessection__no-games">
            No upcoming games today.
          </li>
        )}
      </ul>

      {visibleGamesCount < upcomingGames.length && (
        <button
          onClick={handleShowMore}
          className="upcominggamessection__show-more"
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
