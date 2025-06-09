import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ModalWithForm from "../ModalWithForm/ModalWithForm";
import Preloader from "../Preloader/Preloader";
import { saveGame, unsaveGame } from "../../utils/auth";
import gameData from "../../utils/gameData";
import "./GameModal.css";

function GameModal({
  game,
  onClose,
  isLoggedIn,
  openLoginModal,
  currentUser,
  setCurrentUser,
}) {
  const userId = currentUser?._id;
  const updatesRef = useRef(null);
  const [liveScore, setLiveScore] = useState(null);
  const [liveEvents, setLiveEvents] = useState([]);
  const [isFormValid, setIsFormValid] = useState(true);
  const [isLiveGame, setIsLiveGame] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isStatsLoading, setIsStatsLoading] = useState(false);
  const [buttonText, setButtonText] = useState("Save Game");
  const [isGameSaved, setIsGameSaved] = useState(false);
  const [displayTime, setDisplayTime] = useState("");
  const [isPenalties, setIsPenalties] = useState(false);
  const [penaltyScore, setPenaltyScore] = useState({ home: 0, away: 0 });
  const [showLineups, setShowLineups] = useState(false);
  const [showStandings, setShowStandings] = useState(false);
  const [lineups, setLineups] = useState(null);
  const [standings, setStandings] = useState(null);
  const hasScrolled = useRef(false);
  const navigate = useNavigate();

  // check if game saved
  useEffect(() => {
    if (currentUser && game) {
      const isSaved = currentUser.savedGames.some(
        (savedGame) => String(savedGame.fixtureId) === String(game.fixture.id)
      );

      console.log("Is game saved?", isSaved);
      setIsGameSaved(isSaved);
      setButtonText(isSaved ? "Game Saved" : "Save Game");
    } else {
      console.log("Current user or game is not defined.");
    }
  }, [currentUser, game]);

  // fetch live game data, optionally showing the spinner
  const fetchLiveGameData = async (showSpinner = true) => {
    if (!game) return;

    // only toggle loading when you want the spinner
    if (showSpinner) setIsLoading(true);

    try {
      const response = await axios.get(
        "https://api-football-v1.p.rapidapi.com/v3/fixtures",
        {
          headers: {
            "X-RapidAPI-Key": import.meta.env.VITE_API_KEY,
            "X-RapidAPI-Host": "api-football-v1.p.rapidapi.com",
          },
          params: {
            id: game.fixture.id,
          },
        }
      );

      const fixtureData = response.data.response[0];
      if (fixtureData) {
        const fixtureStatus = fixtureData.fixture.status;
        setLiveScore(fixtureData);
        setLiveEvents(fixtureData.events || []);
        setIsLiveGame(
          ["In Play", "1H", "2H", "HT", "ET", "P"].includes(fixtureStatus.short)
        );
        const p = fixtureData.score.penalty || {};
        if (p.home != null || p.away != null) {
          setIsPenalties(true);
          setPenaltyScore({ home: p.home, away: p.away });
        } else {
          setIsPenalties(false);
        }
      } else {
        setIsLiveGame(false);
        setLiveScore(null);
        setLiveEvents([]);
      }
    } catch (error) {
      console.error("Error fetching live games:", error);
    } finally {
      // only hide spinner if we showed it
      if (showSpinner) setIsLoading(false);
    }

    console.log(game.league.name);
  };

  useEffect(() => {
    if (!game) return;
    // show spinner on initial load
    fetchLiveGameData(true);
  }, [game]);

  // poll every 30s, but only while the game is actually live
  useEffect(() => {
    if (!isLiveGame) return;

    const id = setInterval(() => fetchLiveGameData(false), 30_000);
    return () => clearInterval(id);
  }, [isLiveGame]);

  // checking for extra time (and stoppage) or penalties
  useEffect(() => {
    if (!liveScore) return;
    const { short, elapsed, extra } = liveScore.fixture.status;
    let txt;

    if (isPenalties) {
      txt = "Penalties";
    } else if (short === "FT") {
      txt = "FT";
    } else if (short === "HT") {
      txt = "HT";
    } else if ((short === "2H" || short === "ET") && extra != null) {
      txt = `90+${extra}'`;
    } else if (short === "1H" && extra != null) {
      txt = `45+${extra}'`;
    } else {
      txt = `${elapsed}'`;
    }

    setDisplayTime(txt);
  }, [liveScore, isPenalties]);

  const fetchStats = async () => {
    setIsStatsLoading(true);
    try {
      const leagueId = liveScore?.league?.id ?? game.league?.id;
      const season = liveScore?.league?.season ?? game.league?.season;

      if (!leagueId || !season) {
        console.error("Cannot fetch standings—no league/season yet:", {
          leagueId,
          season,
        });
        setIsStatsLoading(false);
        return;
      }
      // pull lineup + standings in parallel
      const [lineupRes, standingRes] = await Promise.all([
        axios.get(
          "https://api-football-v1.p.rapidapi.com/v3/fixtures/lineups",
          {
            headers: {
              "X-RapidAPI-Key": import.meta.env.VITE_API_KEY,
              "X-RapidAPI-Host": "api-football-v1.p.rapidapi.com",
            },
            params: { fixture: game.fixture.id },
          }
        ),
        axios.get("https://api-football-v1.p.rapidapi.com/v3/standings", {
          headers: {
            "X-RapidAPI-Key": import.meta.env.VITE_API_KEY,
            "X-RapidAPI-Host": "api-football-v1.p.rapidapi.com",
          },
          params: {
            league: leagueId,
            season: season,
          },
        }),
      ]);

      // lineups come back as an array of two objects
      setLineups(lineupRes.data.response);

      const standingArray = standingRes.data.response;
      if (!Array.isArray(standingArray) || standingArray.length === 0) {
        console.error("No standings data returned yet for this league/season");
        setIsStatsLoading(false);
        return;
      }

      // pick out the correct sub‐table for this team
      const allGroups = standingRes.data.response[0].league.standings;
      // each group is an array of rows; find the one that contains our team
      const homeId = String(game.teams.home.id);
      const awayId = String(game.teams.away.id);

      // try to find a group where either homeId or awayId appears
      let chosenGroup = null;
      for (const group of allGroups) {
        if (
          group.some(
            (row) =>
              String(row.team.id) === homeId || String(row.team.id) === awayId
          )
        ) {
          chosenGroup = group;
          break;
        }
      }
      // if none matched, fall back to the first group
      if (!chosenGroup) {
        chosenGroup = allGroups[0];
      }

      setStandings(chosenGroup);
    } catch (e) {
      console.error("Error fetching stats:", e);
    } finally {
      setIsStatsLoading(false);
    }
  };

  const handleToggleLineups = () => {
    setShowLineups((prev) => {
      const opening = !prev;
      if (opening && !lineups) fetchStats();
      return opening;
    });
    // if standings were showing, hide them
    if (showStandings) setShowStandings(false);
  };

  const handleToggleStandings = () => {
    setShowStandings((prev) => {
      const opening = !prev;
      if (opening && !standings) fetchStats();
      return opening;
    });
    // if lineups were showing, hide them
    if (showLineups) setShowLineups(false);
  };

  // smooth scroll effect
  const startSmoothScroll = (speedMultiplier = 1) => {
    if (updatesRef.current) {
      const updatesList = updatesRef.current;
      const scrollDuration = 5000 * speedMultiplier;
      const totalScrollHeight = updatesList.scrollHeight;
      const startTime = performance.now();

      const scrollDown = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / scrollDuration, 1);
        updatesList.scrollTop = totalScrollHeight * progress;

        if (progress < 1) {
          requestAnimationFrame(scrollDown);
        } else {
          setTimeout(() => {
            updatesList.scrollTo({
              top: 0,
              behavior: "smooth",
            });
          }, 50);
        }
      };

      requestAnimationFrame(scrollDown);
    }
  };

  // initial smooth scroll on mount
  useEffect(() => {
    if (!hasScrolled.current) {
      hasScrolled.current = true;
      startSmoothScroll();
    }
  }, [liveEvents]);

  // restart smooth scroll effect
  const handleLiveEventsClick = () => {
    startSmoothScroll(2);
  };

  // current user game data
  useEffect(() => {
    if (currentUser) {
      const data = gameData(game, currentUser);
    }
  }, [currentUser, game]);

  // handle save game
  const handleSaveGame = async (e) => {
    e.preventDefault();

    if (!isLoggedIn) {
      onClose();
      openLoginModal();
      return;
    }

    setIsLoading(true);
    try {
      const formattedGameData = gameData(game, userId);
      const fixtureId = String(game.fixture.id);

      if (!formattedGameData.fixtureId || !formattedGameData.dateTime) {
        console.error("Missing required fields in formatted game data");
        setIsLoading(false);
        return;
      }

      if (isGameSaved) {
        console.log("Unsaving the game:", fixtureId);
        await unsaveGame(fixtureId);

        setCurrentUser((prevUser) => {
          const updatedSavedGames = prevUser.savedGames.filter(
            (savedGame) => savedGame.fixtureId !== fixtureId
          );

          console.log("Updated saved games after unsaving:", updatedSavedGames);

          return {
            ...prevUser,
            savedGames: updatedSavedGames,
          };
        });

        setButtonText("Save Game");
        setIsGameSaved(false);
      } else {
        console.log("Saving the game:", formattedGameData);
        await saveGame(formattedGameData);

        setCurrentUser((prevUser) => {
          const updatedSavedGames = [...prevUser.savedGames, formattedGameData];

          return {
            ...prevUser,
            savedGames: updatedSavedGames,
          };
        });

        setButtonText("Game Saved");
        setIsGameSaved(true);
      }
    } catch (error) {
      console.error("Error saving game:", error);
      setButtonText("Save Failed");
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, 800);
    }
  };

  // live events
  const renderLiveEvents = () => {
    if (!liveEvents.length) {
      return <p className="gamemodal__no-updates">No updates yet...</p>;
    }

    return (
      <ul
        className="gamemodal__event-list"
        ref={updatesRef}
        onClick={handleLiveEventsClick}
      >
        {liveEvents
          .slice()
          .reverse()
          .map((event, index) => {
            const teamName =
              String(event.team.id).trim() === String(game.teams.home.id).trim()
                ? game.teams.home.name
                : game.teams.away.name;

            // determine yellow or red card emoji
            const cardEmoji = event.detail === "Yellow Card" ? "🟨" : "🟥";

            return (
              <li key={index} className="gamemodal__event">
                <span className="gamemodal__event-time">
                  {event.time.elapsed}'
                </span>
                <span className="gamemodal__event-detail">
                  {event.type === "Goal" &&
                    `⚽ ${event.detail} by ${event.player.name} (${teamName})`}
                  {event.type === "Card" &&
                    `${cardEmoji} ${event.detail} for ${event.player.name} (${teamName})`}
                  {event.type === "subst" &&
                    `🔄 Substitution: ${event.assist.name} replaced by ${event.player.name} (${teamName})`}
                  {event.type === "Offside" &&
                    `🚫 ${event.player.name} is offside! (${teamName})`}
                  {event.type === "Foul" &&
                    `🚫 ${event.player.name} committed a foul (${teamName})`}
                  {event.type === "Goal Disallowed" &&
                    `🚫 Goal overturned: ${event.player.name} scored (${teamName})`}
                </span>
              </li>
            );
          })}
      </ul>
    );
  };

  // game content
  const renderContent = () => {
    if (isLoading) {
      return <Preloader className="gamemodal__preloader" />;
    }

    const gameDate = new Date(game.fixture.date);
    const now = new Date();
    const isUpcoming = gameDate > now;

    if (isUpcoming) {
      return (
        <div className="gamemodal">
          <h3 className="gamemodal__teams">
            {game.teams.home.name} vs {game.teams.away.name}
          </h3>
          <p className="gamemodal__date">
            Date: {formatDate(game.fixture.date)}{" "}
            {formatTime(game.fixture.date)}
          </p>

          {showLineups ? (
            <div className="gamemodal__stats">
              <h4 className="gamemodal__stats-title">Starting XI</h4>
              <div
                className="gamemodal__stats-container"
                onTouchStart={(e) => e.stopPropagation()}
                onTouchMove={(e) => e.stopPropagation()}
              >
                {isStatsLoading ? (
                  <Preloader />
                ) : lineups && lineups.length > 0 ? (
                  lineups.map((team) => (
                    <div key={team.team.id}>
                      <h5 className="gamemodal__stats-teams">
                        {team.team.name}
                      </h5>
                      <ul className="gamemodal__stats-players">
                        {team.startXI.map((p) => (
                          <li
                            className="gamemodal__stats-players_data"
                            key={p.player.id}
                          >
                            <span>#{p.player.number}</span>
                            <span className="gamemodal__player-connector" />{" "}
                            {p.player.name}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))
                ) : (
                  <p className="gamemodal__no-data">
                    Starting XI data not available.
                  </p>
                )}
              </div>
            </div>
          ) : showStandings ? (
            <div className="gamemodal__stats">
              <h4 className="gamemodal__standings-title">League Standings</h4>
              {isStatsLoading ? (
                <Preloader />
              ) : standings ? (
                <div
                  className="gamemodal__standings-container"
                  onTouchStart={(e) => e.stopPropagation()}
                  onTouchMove={(e) => e.stopPropagation()}
                >
                  <table className="gamemodal__standings-stats">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Team</th>
                        <th>P</th>
                        <th>W</th>
                        <th>D</th>
                        <th>L</th>
                        <th>GD</th>
                        <th>Pt</th>
                      </tr>
                    </thead>
                    <tbody>
                      {standings.map((row) => (
                        <tr
                          key={row.team.id}
                          onClick={() => navigate(`/team/${row.team.id}`)}
                          style={{ cursor: "pointer" }}
                        >
                          <td>{row.rank}</td>
                          <td className="team-name">{row.team.name}</td>
                          <td>{row.all.played}</td>
                          <td>{row.all.win}</td>
                          <td>{row.all.draw}</td>
                          <td>{row.all.lose}</td>
                          <td>{row.goalsDiff}</td>
                          <td>{row.points}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="gamemodal__no-data">League data not available.</p>
              )}
            </div>
          ) : null}
        </div>
      );
    }

    if (liveScore) {
      const homeScore =
        liveScore.goals?.home != null ? liveScore.goals.home : "N/A";
      const awayScore =
        liveScore.goals?.away != null ? liveScore.goals.away : "N/A";
      const gameStatus = liveScore.fixture.status.short || "";

      return (
        <div className="gamemodal">
          <h3 className="gamemodal__teams">
            {game.teams.home.name} vs {game.teams.away.name}
          </h3>

          <div className="gamemodal__live-section">
            <p className="gamemodal__live-section-text">
              {isLiveGame ? (
                gameStatus === "HT" ? (
                  <span className="gamemodal__half-time-text">
                    AT HALF TIME
                  </span>
                ) : gameStatus === "ET" ? (
                  <span className="gamemodal__extra-time-text">
                    LIVE - EXTRA TIME
                  </span>
                ) : (
                  <span className="gamemodal__live-text">LIVE</span>
                )
              ) : (
                <span className="gamemodal__live-text-final">FINAL</span>
              )}
            </p>
            <p className="gamemodal__time">
              {isLiveGame ? displayTime : gameStatus}
            </p>
          </div>

          <p className="gamemodal__score">
            {homeScore} - {awayScore}
          </p>

          {isPenalties && (
            <p className="gamemodal__penalty-score">
              ({penaltyScore.home}) – ({penaltyScore.away})
            </p>
          )}

          {showLineups ? (
            <div className="gamemodal__stats">
              <h4 className="gamemodal__stats-title">Starting XI</h4>
              <div
                className="gamemodal__stats-container"
                onTouchStart={(e) => e.stopPropagation()}
                onTouchMove={(e) => e.stopPropagation()}
              >
                {isStatsLoading ? (
                  <Preloader />
                ) : lineups && lineups.length > 0 ? (
                  lineups.map((team) => (
                    <div key={team.team.id}>
                      <h5 className="gamemodal__stats-teams">
                        {team.team.name}
                      </h5>
                      <ul className="gamemodal__stats-players">
                        {team.startXI.map((p) => (
                          <li
                            className="gamemodal__stats-players_data"
                            key={p.player.id}
                          >
                            {" "}
                            <span>#{p.player.number}</span>
                            <span className="gamemodal__player-connector"></span>{" "}
                            {p.player.name}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))
                ) : (
                  <p className="gamemodal__no-data">
                    Starting XI data not available.
                  </p>
                )}
              </div>
            </div>
          ) : showStandings ? (
            <div className="gamemodal__stats">
              <h4 className="gamemodal__standings-title">League Standings</h4>

              {isStatsLoading ? (
                <Preloader />
              ) : standings ? (
                <div
                  className="gamemodal__standings-container"
                  onTouchStart={(e) => e.stopPropagation()}
                  onTouchMove={(e) => e.stopPropagation()}
                >
                  <table className="gamemodal__standings-stats">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Team</th>
                        <th>P</th>
                        <th>W</th>
                        <th>D</th>
                        <th>L</th>
                        <th>GD</th>
                        <th>Pt</th>
                      </tr>
                    </thead>
                    <tbody>
                      {standings.map((row) => (
                        <tr
                          key={row.team.id}
                          onClick={() => navigate(`/team/${row.team.id}`)}
                          style={{ cursor: "pointer" }}
                        >
                          <td>{row.rank}</td>
                          <td className="team-name">{row.team.name}</td>
                          <td>{row.all.played}</td>
                          <td>{row.all.win}</td>
                          <td>{row.all.draw}</td>
                          <td>{row.all.lose}</td>
                          <td>{row.goalsDiff}</td>
                          <td>{row.points}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="gamemodal__no-data">League data not available.</p>
              )}
            </div>
          ) : (
            <div className="gamemodal__updates">
              <h4 className="gamemodal__updates-header">Live Updates</h4>
              {renderLiveEvents()}
            </div>
          )}
        </div>
      );
    }

    // fallback if there's no liveScore and it's not upcoming
    return (
      <div className="gamemodal">
        <h3 className="gamemodal__teams">
          {game.teams.home.name} vs {game.teams.away.name}
        </h3>
        <p className="gamemodal__date">
          Date: {formatDate(game.fixture.date)} {formatTime(game.fixture.date)}
        </p>
      </div>
    );
  };
  console.log("Game object in Modal:", game);

  return (
    <ModalWithForm
      title={
        <div className="gamemodal__title">
          Game Details
          {game.league && game.league.name && (
            <span className="gamemodal__league"> {game.league.name}</span>
          )}
        </div>
      }
      isOpen={!!game}
      onClose={onClose}
      onSubmit={handleSaveGame}
      buttonText={buttonText}
      isFormValid={isFormValid}
      isLoading={isLoading}
      extraAction={
        <div className="gamemodal__alternate-action">
          <button className="gamemodal__link" onClick={handleToggleLineups}>
            {showLineups ? "Hide Stats" : "Show Stats"}
          </button>
          <span className="gamemodal__or">or</span>
          <button className="gamemodal__link" onClick={handleToggleStandings}>
            {showStandings ? "Hide Standings" : "League Standing"}
          </button>
        </div>
      }
    >
      {renderContent()}
    </ModalWithForm>
  );
}

// format date and time
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

export default GameModal;
