import React, { useState } from "react";
import GamesList from "../GamesList/GamesList";
import "./Main.css";

function Main({
  searchQuery,
  setSearchQuery,
  handleSearch,
  searchResults,
  loading,
  error,
  setSearchResults,
  openLoginModal,
}) {
  const [errorMessage, setErrorMessage] = useState("");
  const [searchDisabled, setSearchDisabled] = useState(false);

  const handleSearchClick = () => {
    if (!searchQuery.trim()) {
      setErrorMessage("Please enter a search term.");
    } else {
      setErrorMessage("");
      handleSearch();
      setSearchDisabled(true);
    }
  };

  const handleInputClick = () => {
    setSearchQuery("");
    setSearchDisabled(false);
    setSearchResults([]);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearchClick();
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
          onClick={handleInputClick}
          onKeyDown={handleKeyDown}
        />
        <button
          onClick={handleSearchClick}
          className="main__search-btn"
          disabled={searchDisabled}
        >
          Search
        </button>
      </div>

      <GamesList
        errorMessage={errorMessage}
        loading={loading}
        error={error}
        searchResults={searchResults}
      />
    </main>
  );
}

export default Main;
