import { useState } from "react";

function Profile() {
  // Example state for saved games
  const [savedGames, setSavedGames] = useState([]);

  // Example function to save a game
  const saveGame = (game) => {
    setSavedGames([...savedGames, game]);
  };

  // Example function to remove a game
  const removeGame = (gameId) => {
    setSavedGames(savedGames.filter((game) => game.id !== gameId));
  };

  return (
    <div>
      <h1>User Profile</h1>
      <h2>Saved Games</h2>
      {savedGames.length === 0 ? (
        <p>No games saved yet.</p>
      ) : (
        <ul>
          {savedGames.map((game) => (
            <li key={game.id}>
              {game.name}
              <button onClick={() => removeGame(game.id)}>Remove</button>
            </li>
          ))}
        </ul>
      )}
      {/* Example button to simulate saving a game */}
      <button onClick={() => saveGame({ id: Date.now(), name: "Sample Game" })}>
        Save Sample Game
      </button>
    </div>
  );
}

export default Profile;
