import React, { useState, useEffect } from "react";
import axios from "axios";
import ModalWithForm from "../ModalWithForm/ModalWithForm";
import "./GameModal.css";

function GameModal({ game, onClose }) {
  const [liveScore, setLiveScore] = useState(null);
  const [isFormValid, setIsFormValid] = useState(true);
  const [isLiveGame, setIsLiveGame] = useState(false);

  useEffect(() => {
    const checkIfLive = async () => {
      if (game) {
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
          console.log("Live Games Data:", liveGames);

          const liveGame = liveGames.find(
            (liveGame) => liveGame.fixture.id === game.fixture.id
          );

          if (liveGame) {
            setIsLiveGame(true);
            setLiveScore(liveGame);
            console.log("Live Game Details:", liveGame);
          } else {
            setIsLiveGame(false);
            setLiveScore(null);
          }
        } catch (error) {
          console.error("Error fetching live games:", error);
        }
      }
    };

    checkIfLive();
  }, [game]);

  const handleSaveGame = (event) => {
    event.preventDefault();
    console.log("Game saved!");
  };

  const renderContent = () => {
    if (isLiveGame && liveScore) {
      // Adjusting access based on the structure of score data
      const homeScore =
        liveScore.score?.fulltime?.home ??
        liveScore.score?.halftime?.home ??
        "N/A";
      const awayScore =
        liveScore.score?.fulltime?.away ??
        liveScore.score?.halftime?.away ??
        "N/A";

      return (
        <div>
          <h3>
            {game.teams.home.name} vs {game.teams.away.name}
          </h3>
          <p>Date: {formatDate(game.fixture.date)}</p>
          <p>
            Score: {homeScore} - {awayScore}
          </p>
        </div>
      );
    } else {
      return (
        <div>
          <h3>
            {game.teams.home.name} vs {game.teams.away.name}
          </h3>
          <p>
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
      // extraAction={}
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
