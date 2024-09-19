import React, { useState } from "react";
import { Link } from "react-router-dom";
import Preloader from "../Preloader/Preloader";
import "./GamesList.css";

function GamesList({ errorMessage, loading, error, searchResults }) {
  const [visibleCount, setVisibleCount] = useState(50);

  const hasResults = searchResults && searchResults.length > 0;

  const handleShowMore = () => {
    setVisibleCount((prevCount) => prevCount + 50);
  };

  return (
    <div className="gameslist gameslist__preloader_error">
      <h2
        className="gameslist__header"
        style={{ visibility: hasResults ? "visible" : "hidden" }}
      >
        Search results
      </h2>

      {errorMessage && <p className="gameslist__error">{errorMessage}</p>}

      {loading && <Preloader />}
      {error && <p>Error: {error.message}</p>}

      <ul className="gameslist__list">
        {hasResults &&
          searchResults.slice(0, visibleCount).map((team) => (
            <li key={team.team.id}>
              <Link className="gameslist__link" to={`/team/${team.team.id}`}>
                {team.team.name}
              </Link>
            </li>
          ))}
      </ul>

      {hasResults && visibleCount < searchResults.length && (
        <button className="gameslist__show-more" onClick={handleShowMore}>
          Show more
        </button>
      )}
    </div>
  );
}

export default GamesList;
