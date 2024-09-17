import React from "react";
import "./Main.css";

function Main({
  searchQuery,
  setSearchQuery,
  handleSearch,
  searchResults,
  loading,
  error,
}) {
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
        <button onClick={handleSearch} className="main__search-btn">
          Search
        </button>
      </div>
      <div className="main__preloader main__preloader_error">
        {loading && <p>Loading...</p>}
        {error && <p>Error: {error.message}</p>}
        <ul>
          {searchResults.map((team) => (
            <li key={team.team.id}>{team.team.name}</li>
          ))}
        </ul>
      </div>
    </main>
  );
}

export default Main;
