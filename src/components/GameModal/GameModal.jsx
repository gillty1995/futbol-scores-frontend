import React, { useState, useEffect } from "react";
import axios from "axios";
import ModalWithForm from "../ModalWithForm/ModalWithForm";
import Preloader from "../Preloader/Preloader";
import "./GameModal.css";

function GameModal({ game, onClose }) {
  const [liveScore, setLiveScore] = useState(null);
  const [liveEvents, setLiveEvents] = useState([]);
  const [isFormValid, setIsFormValid] = useState(true);
  const [isLiveGame, setIsLiveGame] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkIfLive = async () => {
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
                live: "all",
              },
            }
          );

          const liveGames = response.data.response;
          const liveGame = liveGames.find(
            (liveGame) => liveGame.fixture.id === game.fixture.id
          );

          if (liveGame) {
            setIsLiveGame(true);
            setLiveScore(liveGame);
            setLiveEvents(liveGame.events || []); // Set live events from the API
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

    checkIfLive();
  }, [game]);

  const handleSaveGame = (event) => {
    event.preventDefault();
    console.log("Game saved!");
  };

  const renderLiveEvents = () => {
    if (!liveEvents.length) {
      return <p className="gamemodal__no-updates">No updates yet</p>;
    }

    return (
      <ul className="gamemodal__event-list">
        {liveEvents.map((event, index) => (
          <li key={index} className="gamemodal__event">
            <span className="gamemodal__event-time">{event.time.elapsed}'</span>
            <span className="gamemodal__event-detail">
              {event.type === "Goal" &&
                `⚽ ${event.detail} by ${event.player.name}`}
              {event.type === "Card" &&
                `${event.detail} card for ${event.player.name}`}
              {event.type === "subst" &&
                `Substitution: ${event.assist.name} replaced ${event.player.name}`}
              {/* Add more event types as needed */}
            </span>
          </li>
        ))}
      </ul>
    );
  };

  const renderContent = () => {
    if (isLoading) {
      return <Preloader className="gamemodal__preloader" />;
    }

    if (isLiveGame && liveScore) {
      const homeScore =
        liveScore.score?.fulltime?.home ??
        liveScore.score?.halftime?.home ??
        "N/A";
      const awayScore =
        liveScore.score?.fulltime?.away ??
        liveScore.score?.halftime?.away ??
        "N/A";

      const gameElapsedTime = liveScore.fixture?.status?.elapsed ?? 0;
      const gameStatus = liveScore.fixture?.status?.short ?? "";

      return (
        <div className="gamemodal">
          <h3 className="gamemodal__teams">
            {game.teams.home.name} vs {game.teams.away.name}
          </h3>
          <div className="gamemodal__live-section">
            <p className="gamemodal__live-text">LIVE</p>
            <p className="gamemodal__time">
              {gameElapsedTime}' {gameStatus && `(${gameStatus})`}
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
      buttonText="Save Game"
      isFormValid={isFormValid}
      isLoading={isLoading}
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
