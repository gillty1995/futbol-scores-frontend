import React, { useState } from "react";
import { Link } from "react-router-dom"; // Import Link from React Router
import "./Main.css";

function Main({
  searchQuery,
  setSearchQuery,
  handleSearch,
  searchResults,
  loading,
  error,
}) {
  const [errorMessage, setErrorMessage] = useState("");

  const handleSearchClick = () => {
    if (!searchQuery.trim()) {
      setErrorMessage("Please enter a search term.");
    } else {
      setErrorMessage("");
      handleSearch(); // Call the actual search function if input is valid
    }
  };

  return (
    <main className="main">
      <h2 className="main__header">What's the score?</h2>
      <p className="main__info">
        Find your favorite clubs and countries live scores and save any upcoming
        games to your personal profile.
      </p>
      <div className="main__search">
        <input
          type="text"
          className="main__search-input"
          placeholder="Enter football club or country"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button
          onClick={handleSearchClick} // Use handleSearchClick instead of handleSearch
          className="main__search-btn"
        >
          Search
        </button>
      </div>
      {errorMessage && <p className="main__error">{errorMessage}</p>}{" "}
      {/* Display error message */}
      <div className="main__preloader main__preloader_error">
        {loading && <p>Loading...</p>}
        {error && <p>Error: {error.message}</p>}
        <ul>
          {searchResults.map((team) => (
            <li key={team.team.id}>
              {/* Wrap the team name in a Link that navigates to /team/:id */}
              <Link to={`/team/${team.team.id}`}>{team.team.name}</Link>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}

export default Main;
