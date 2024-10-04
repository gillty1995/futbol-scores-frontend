import React, { useState, useEffect, useRef } from "react";
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
  handleUpdateUser,
}) {
  console.log("Is user logged in?", isLoggedIn);

  const userId = currentUser?._id;
  const updatesRef = useRef(null);
  const [liveScore, setLiveScore] = useState(null);
  const [liveEvents, setLiveEvents] = useState([]);
  const [isFormValid, setIsFormValid] = useState(true);
  const [isLiveGame, setIsLiveGame] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [buttonText, setButtonText] = useState("Save Game");
  const [isGameSaved, setIsGameSaved] = useState(false);

  const hasScrolled = useRef(false);

  useEffect(() => {
    if (currentUser && game) {
      console.log("Current User", currentUser);
      const formattedGameData = gameData(game, currentUser);
      const savedGames = currentUser.savedGames || [];

      console.log("Saved Games", savedGames);

      const isSaved = savedGames.some(
        (savedGame) => savedGame.fixtureId === formattedGameData.fixtureId
      );
      setIsGameSaved(isSaved);
      setButtonText(isSaved ? "Game Saved" : "Save Game");
    }
  }, [currentUser, game]);

  console.log("Current user in game modal", currentUser);

  const fetchLiveGameData = async () => {
    if (game) {
      setIsLoading(true);
      try {
        const response = await axios.get(
          `https://api-football-v1.p.rapidapi.com/v3/fixtures`,
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
            fixtureStatus.short === "In Play" ||
              fixtureStatus.short === "1H" ||
              fixtureStatus.short === "2H" ||
              fixtureStatus.short === "HT" ||
              fixtureStatus.short === "ET"
          );
        } else {
          setIsLiveGame(false);
          setLiveScore(null);
          setLiveEvents([]);
        }
      } catch (error) {
        console.error("Error fetching live games:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchLiveGameData();
  }, [game]);

  // Smooth scroll effect
  useEffect(() => {
    if (updatesRef.current && !hasScrolled.current) {
      hasScrolled.current = true;
      const updatesList = updatesRef.current;
      const scrollDuration = 5000;
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
  }, [liveEvents]);

  // handle refresh game
  const handleRefresh = () => {
    fetchLiveGameData();
  };

  useEffect(() => {
    if (currentUser) {
      const data = gameData(game, currentUser);
      console.log(data);
    }
  }, [currentUser, game]);

  // Handle save game
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
      const fixtureId = game.fixture.id;
      console.log("Unsave game fixtureId:", fixtureId);
      console.log("Fixture ID (type):", fixtureId);

      if (!formattedGameData.fixtureId || !formattedGameData.dateTime) {
        console.error("Missing required fields in formatted game data");
        setIsLoading(false);
        return;
      }

      if (isGameSaved) {
        await unsaveGame(fixtureId);
        setButtonText("Save Game");
        setIsGameSaved(false);
        currentUser.savedGames = currentUser.savedGames.filter(
          (savedGame) => savedGame.fixtureId !== fixtureId
        );
        handleUpdateUser({ savedGames: currentUser.savedGames });
      } else {
        await saveGame(formattedGameData);
        setButtonText("Game Saved");
        setIsGameSaved(true);
        currentUser.savedGames.push(formattedGameData);
        handleUpdateUser({ savedGames: currentUser.savedGames });
      }

      // setIsGameSaved((prev) => !prev);
    } catch (error) {
      console.error("Error saving game:", error);
      setButtonText("Save Failed");
    } finally {
      setIsLoading(false);
    }
  };

  const renderLiveEvents = () => {
    if (!liveEvents.length) {
      return <p className="gamemodal__no-updates">No updates yet...</p>;
    }

    return (
      <ul className="gamemodal__event-list" ref={updatesRef}>
        {liveEvents
          .slice()
          .reverse()
          .map((event, index) => {
            const teamName =
              event.team.id === game.teams.home.id
                ? game.teams.home.name
                : game.teams.away.name;

            return (
              <li key={index} className="gamemodal__event">
                <span className="gamemodal__event-time">
                  {event.time.elapsed}'
                </span>
                <span className="gamemodal__event-detail">
                  {event.type === "Goal" &&
                    `⚽ ${event.detail} by ${event.player.name} (${teamName})`}
                  {event.type === "Card" &&
                    `🟨 ${event.detail} card for ${event.player.name} (${teamName})`}
                  {event.type === "subst" &&
                    `🔄 Substitution: ${event.assist.name} replaced ${event.player.name} (${teamName})`}
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
        </div>
      );
    }

    if (liveScore) {
      const homeScore =
        liveScore?.goals?.home !== undefined ? liveScore.goals.home : "N/A";
      const awayScore =
        liveScore?.goals?.away !== undefined ? liveScore.goals.away : "N/A";
      const gameElapsedTime = liveScore.fixture?.status?.elapsed ?? 0;
      const gameStatus = liveScore.fixture?.status?.short ?? "";

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
              {isLiveGame ? `${gameElapsedTime}'` : gameStatus}
            </p>
          </div>
          <p className="gamemodal__score">
            {homeScore} - {awayScore}
          </p>

          {/* Live events section */}
          <div className="gamemodal__updates">
            <h4 className="gamemodal__updates-header">Live Updates</h4>
            {renderLiveEvents()}
          </div>
        </div>
      );
    } else {
      return (
        <div>
          <h3 className="gamemodal__teams">
            {game.teams.home.name} vs {game.teams.away.name}
          </h3>
          <p className="gamemodal__date">
            Date: {formatDate(game.fixture.date)}{" "}
            {formatTime(game.fixture.date)}
          </p>
        </div>
      );
    }
  };

  return (
    <ModalWithForm
      title="Game Details"
      isOpen={!!game}
      onClose={onClose}
      onSubmit={handleSaveGame}
      buttonText={buttonText}
      isFormValid={isFormValid}
      isLoading={isLoading}
      extraAction={
        <div className="modal__alternate-action">
          <p className="modal__or">or</p>
          <button className="modal__link" onClick={handleRefresh}>
            Refresh
          </button>
        </div>
      }
    >
      {renderContent()}
    </ModalWithForm>
  );
}

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
