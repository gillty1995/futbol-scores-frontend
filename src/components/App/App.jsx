import { useState, useEffect, useContext } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import CurrentUserContext from "../../contexts/CurrentUserContext";
import AuthContext from "../../contexts/AuthContext";
import { loginUser, registUser, checkToken } from "../../utils/auth";

import Header from "../Header/Header";
import Main from "../Main/Main";
import ApiData from "../ApiData/ApiData";
import SavedGamesSection from "../SavedGamesSection/SavedGamesSection";
import Footer from "../Footer/Footer";
import LoginModal from "../LoginModal/LoginModal";
import RegisterModal from "../RegisterModal/RegisterModal";

import "./App.css";

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { login, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      setCurrentUser(JSON.parse(user));
      setIsLoggedIn(true);
    }
    console.log("Current User:", currentUser);
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
    localStorage.removeItem("user");
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

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="page">
        <div className="page__content">
          <Header
            isLoggedIn={isLoggedIn}
            currentUser={currentUser}
            onLogout={handleLogout}
            openLoginModal={openLoginModal}
          />
          <Routes>
            <Route path="/" element={<Main />} />
            <Route path="/api-data" element={<ApiData />} />
            <Route path="/saved-games" element={<SavedGamesSection />} />
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
