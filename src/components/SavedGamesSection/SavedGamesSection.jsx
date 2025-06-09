// SavedGamesSection.jsx
import React, { useState, useEffect, useContext } from "react";
import AuthContext from "../../contexts/AuthContext";
import axios from "axios";
import GameModal from "../GameModal/GameModal";
import Preloader from "../Preloader/Preloader";
import { baseUrl } from "../../utils/constants";
import "./SavedGamesSection.css";

function SavedGamesSection({ currentUser, setCurrentUser }) {
  const [savedGames, setSavedGames] = useState([]);
  const [fixtureStatuses, setFixtureStatuses] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedGame, setSelectedGame] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const { isLoggedIn } = useContext(AuthContext);
  const [visibleGamesCount, setVisibleGamesCount] = useState(10);

  // Helpers for formatting
  const formatDate = (date) => {
    const d = new Date(date);
    if (isNaN(d.getTime())) return "";
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${mm}/${dd}`;
  };
  const formatTime = (dateTime) => {
    const d = new Date(dateTime);
    if (isNaN(d.getTime())) return "";
    const opts = { hour: "numeric", minute: "2-digit", hour12: true };
    return d.toLocaleTimeString([], opts).replace(/^0/, "");
  };

  // Interpret status.short
  const LIVE_STATUSES = ["1H", "2H", "HT", "ET", "P"];
  const isLive = (short) => LIVE_STATUSES.includes(short);
  const GAME_OVER = ["FT", "AET", "PEN"];
  const isGameOver = (short) => GAME_OVER.includes(short);

  useEffect(() => {
    if (!isLoggedIn) {
      setLoading(false);
      return;
    }

    let isMounted = true;
    let intervalId = null;

    async function fetchSavedGamesAndStatuses() {
      setLoading(true);
      setError(null);

      try {
        // Fetch /me/games
        const token = localStorage.getItem("token");
        const resp = await axios.get(`${baseUrl}/me/games`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!Array.isArray(resp.data)) {
          throw new Error("Expected array from /me/games");
        }

        // Build minimal savedGames
        const formatted = resp.data.map((g) => ({
          fixture: { id: g.fixtureId, date: g.dateTime },
          league: {
            id: g.league?.id ?? null,
            name: g.league?.name ?? null,
            logo: g.league?.logo ?? null,
            country: g.league?.country ?? null,
            flag: g.league?.flag ?? null,
          },
          teams: g.teams,
          user: g.user || "Unknown",
        }));
        formatted.sort(
          (a, b) =>
            new Date(a.fixture.date).getTime() -
            new Date(b.fixture.date).getTime()
        );
        if (!isMounted) return;
        setSavedGames(formatted);

        // Immediately fetch each fixture’s status.short
        const statusMap = {};
        await Promise.all(
          formatted.map(async (fg) => {
            try {
              const r = await axios.get(
                "https://api-football-v1.p.rapidapi.com/v3/fixtures",
                {
                  headers: {
                    "X-RapidAPI-Key": import.meta.env.VITE_API_KEY,
                    "X-RapidAPI-Host": "api-football-v1.p.rapidapi.com",
                  },
                  params: { id: fg.fixture.id },
                }
              );
              const apiObj = r.data.response[0];
              statusMap[fg.fixture.id] = apiObj?.fixture?.status?.short ?? "NS";
            } catch {
              statusMap[fg.fixture.id] = "NS";
            }
          })
        );
        if (!isMounted) return;
        setFixtureStatuses(statusMap);

        // Now start polling statuses every 60 seconds (no loading spinner)
        intervalId = setInterval(async () => {
          const newMap = {};
          await Promise.all(
            formatted.map(async (fg) => {
              try {
                const r2 = await axios.get(
                  "https://api-football-v1.p.rapidapi.com/v3/fixtures",
                  {
                    headers: {
                      "X-RapidAPI-Key": import.meta.env.VITE_API_KEY,
                      "X-RapidAPI-Host": "api-football-v1.p.rapidapi.com",
                    },
                    params: { id: fg.fixture.id },
                  }
                );
                const obj2 = r2.data.response[0];
                newMap[fg.fixture.id] = obj2?.fixture?.status?.short ?? "NS";
              } catch {
                newMap[fg.fixture.id] = "NS";
              }
            })
          );
          if (!isMounted) return;
          setFixtureStatuses(newMap);
        }, 120_000);
      } catch (err) {
        if (!isMounted) return;
        const msg =
          err.response?.data?.message || err.message || "Unknown error";
        setError(new Error(msg));
        setSavedGames([]);
      } finally {
        if (!isMounted) return;
        setLoading(false);
      }
    }

    fetchSavedGamesAndStatuses();
    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
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
    setVisibleGamesCount((p) => p + 10);
  };
  const renderTeamLogo = (team) =>
    team.logo ? (
      <img
        src={team.logo}
        alt={`${team.name} logo`}
        className="savedgamessection__team-logo"
      />
    ) : (
      <span className="savedgamessection__team-logo">N/A</span>
    );

  if (loading) return <Preloader className="savedgamessection__preloader" />;
  if (error)
    return <p className="savedgamessection__error">Error: {error.message}</p>;

  return (
    <div className="savedgamessection">
      <h2 className="savedgamessection__header">Saved Games</h2>
      <ul className="savedgamessection__card-list">
        {savedGames.length > 0 ? (
          savedGames.slice(0, visibleGamesCount).map((game) => {
            const statusShort = fixtureStatuses[game.fixture.id] || "NS";
            const over = isGameOver(statusShort);
            const live = isLive(statusShort);

            return (
              <SavedGameCard
                key={game.fixture.id}
                game={game}
                statusShort={statusShort}
                over={over}
                live={live}
                formatDate={formatDate}
                formatTime={formatTime}
                onClick={() => handleCardClick(game)}
              />
            );
          })
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

const SavedGameCard = React.memo(function ({
  game,
  statusShort,
  over,
  live,
  formatDate,
  formatTime,
  onClick,
}) {
  console.log(
    `Fixture ${game.teams.home.name} vs ${game.teams.away.name} (ID ${game.fixture.id}) → statusShort =`,
    statusShort
  );
  return (
    <li className="savedgamessection__card" onClick={onClick}>
      <div className="savedgamessection__teams-date">
        <span
          className={`savedgamessection__date ${
            live ? "savedgamessection__live" : ""
          }`}
        >
          {over ? (
            <span className="savedgamessection__final">FINAL</span>
          ) : statusShort === "NS" ? (
            // Not started yet, show date/time
            `${formatDate(game.fixture.date)} ${formatTime(game.fixture.date)}`
          ) : (
            // In‐play statuses → LIVE
            <span className="savedgamessection__live">LIVE</span>
          )}
        </span>
      </div>
      <div className="savedgamessection__teams">
        <div className="savedgamessection__team">
          {game.teams.home.logo ? (
            <img
              src={game.teams.home.logo}
              alt={`${game.teams.home.name} logo`}
              className="savedgamessection__team-logo"
            />
          ) : (
            <span className="savedgamessection__team-logo">N/A</span>
          )}
          <span className="savedgamessection__teams-name">
            {game.teams.home.name}
          </span>
        </div>
        <span className="savedgamessection__vs">vs</span>
        <div className="savedgamessection__team">
          {game.teams.away.logo ? (
            <img
              src={game.teams.away.logo}
              alt={`${game.teams.away.name} logo`}
              className="savedgamessection__team-logo"
            />
          ) : (
            <span className="savedgamessection__team-logo">N/A</span>
          )}
          <span className="savedgamessection__teams-name">
            {game.teams.away.name}
          </span>
        </div>
      </div>
    </li>
  );
});

export default SavedGamesSection;
