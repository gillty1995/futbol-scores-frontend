import { useState, useEffect, useContext } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import CurrentUserContext from "../../contexts/CurrentUserContext";
import AuthContext from "../../contexts/AuthContext";
import {
  loginUser,
  registUser,
  checkToken,
  saveGame as saveGameToApi,
} from "../../utils/auth";
import axios from "axios";

import Header from "../Header/Header";
import Main from "../Main/Main";
import ApiData from "../ApiData/ApiData";
import SavedGamesSection from "../SavedGamesSection/SavedGamesSection";
import Footer from "../Footer/Footer";
import LoginModal from "../LoginModal/LoginModal";
import RegisterModal from "../RegisterModal/RegisterModal";
import GamesSection from "../GamesSection/GamesSection";
import AllLiveGamesSection from "../AllLiveGamesSection/AllLiveGamesSection";

import "./App.css";

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { login, logout } = useContext(AuthContext);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [savedGames, setSavedGames] = useState([]);
  const navigate = useNavigate();

  const handleSearch = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log("Searching for:", searchQuery);
      const response = await axios.get(
        `https://api-football-v1.p.rapidapi.com/v3/teams`,
        {
          headers: {
            "X-RapidAPI-Key": import.meta.env.VITE_API_KEY,
            "X-RapidAPI-Host": "api-football-v1.p.rapidapi.com",
          },
          params: { search: searchQuery },
        }
      );
      console.log("Search results:", response.data);
      setSearchResults(response.data.response);
    } catch (err) {
      console.error("Error fetching search results:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      setCurrentUser(JSON.parse(user));
      setIsLoggedIn(true);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (token) {
      checkToken(token)
        .then((userData) => {
          setIsLoggedIn(true);
          setIsAuthenticated(true);
          setCurrentUser(userData);
          login();
        })
        .catch((err) => {
          console.error("Token validation failed:", err);
          localStorage.removeItem("jwt");
          setCurrentUser(null);
          setIsLoggedIn(false);
          logout();
        });
    }
  }, [login, logout]);

  const handleRegister = ({ email, password, name }) => {
    registUser({ email, password, name })
      .then((data) => {
        console.log("Registration successful:", data);
        handleLogin({ email, password });
      })
      .catch((error) => {
        console.error("Registration error:", error);
      });
  };

  const handleLogin = ({ email, password }) => {
    return loginUser({ email, password })
      .then((data) => {
        console.log("Login successful:", data);
        if (data.token) {
          localStorage.setItem("jwt", data.token);
          setIsLoggedIn(true);
          setIsAuthenticated(true);

          return checkToken(data.token)
            .then((userData) => {
              setCurrentUser(userData);
              login();
              closeLoginModal();
              navigate("/");
            })
            .catch((err) => {
              console.error("Error fetching user data:", err);
              setCurrentUser(null);
              throw err;
            });
        } else {
          throw new Error("Invalid login response");
        }
      })
      .catch((error) => {
        console.error("Login error:", error);
        throw error;
      });
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setIsLoggedIn(false);
    localStorage.removeItem("jwt");
  };

  const handleUpdateUser = (updatedUserData) => {
    setCurrentUser((prevUser) => ({
      ...prevUser,
      ...updatedUserData,
    }));
  };

  const openLoginModal = () => {
    setIsLoginModalOpen(true);
  };

  const closeLoginModal = () => {
    setIsLoginModalOpen(false);
  };

  const openRegisterModal = () => {
    setIsRegisterModalOpen(true);
  };

  const closeRegisterModal = () => {
    setIsRegisterModalOpen(false);
  };

  const handleLoginSubmit = (formData) => {
    return handleLogin({ email: formData.email, password: formData.password });
  };

  const handleRegisterSubmit = (formData) => {
    return handleRegister({
      email: formData.email,
      password: formData.password,
      name: formData.name,
    });
  };

  const validateForm = (e) => {
    const isValid = e.target.form.checkValidity();
    setIsFormValid(isValid);
  };

  const resetSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
  };

  const saveGame = async (game) => {
    console.log("Full Game object:", game);
    try {
      const response = await saveGameToApi(game);
      console.log("Response from API:", response);

      setSavedGames((prevSavedGames) => {
        const updatedSavedGames = [...prevSavedGames, response];
        console.log("Updated Saved Games:", updatedSavedGames);
        return updatedSavedGames;
      });

      // Check if the game is saved
      const isSaved = updatedSavedGames.some(
        (savedGame) => savedGame.fixtureId === game.fixtureId
      );
      console.log(`Game ${isSaved ? "is" : "is not"} saved.`);
    } catch (error) {
      console.error("Error saving game:", error);
    }
  };

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="page page__background-image">
        <div className="page__content">
          <Header
            isLoggedIn={isLoggedIn}
            currentUser={currentUser}
            onLogout={handleLogout}
            openLoginModal={openLoginModal}
            resetSearch={resetSearch}
          />
          <Routes>
            <Route
              path="/"
              element={
                <Main
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  handleSearch={handleSearch}
                  searchResults={searchResults}
                  loading={loading}
                  error={error}
                  setSearchResults={setSearchResults}
                />
              }
            />
            <Route path="/api-data" element={<ApiData />} />
            <Route
              path="/live"
              element={
                <AllLiveGamesSection
                  openLoginModal={openLoginModal}
                  handleUpdateUser={handleUpdateUser}
                  currentUser={currentUser}
                  setCurrentUser={setCurrentUser}
                />
              }
            />
            <Route
              path="/saved-games"
              element={
                <SavedGamesSection
                  savedGames={savedGames}
                  handleUpdateUser={handleUpdateUser}
                  currentUser={currentUser}
                  setCurrentUser={setCurrentUser}
                />
              }
            />
            <Route
              path="/team/:teamId"
              element={
                <GamesSection
                  openLoginModal={openLoginModal}
                  saveGame={saveGame}
                  handleUpdateUser={handleUpdateUser}
                  currentUser={currentUser}
                  setCurrentUser={setCurrentUser}
                />
              }
            />
          </Routes>
          <Footer />
        </div>
        <LoginModal
          isOpen={isLoginModalOpen}
          onClose={closeLoginModal}
          onSubmit={handleLoginSubmit}
          isFormValid={isFormValid}
          openRegisterModal={openRegisterModal}
        />
        <RegisterModal
          isOpen={isRegisterModalOpen}
          onClose={closeRegisterModal}
          onSubmit={handleRegisterSubmit}
          isFormValid={isFormValid}
          openLoginModal={openLoginModal}
        />
      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;
