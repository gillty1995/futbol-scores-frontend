import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CurrentUserContext from "../../contexts/CurrentUserContext";
import { loginUser, registUser } from "../../utils/auth";

import Header from "../Header/Header";
import Main from "../Main/Main";
import ApiData from "../ApiData/ApiData";
import Profile from "../Profile/Profile";
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

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      setCurrentUser(JSON.parse(user));
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = async (userData) => {
    try {
      const user = await loginUser(userData);
      setCurrentUser(user);
      setIsLoggedIn(true);
      localStorage.setItem("user", JSON.stringify(user));
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const handleRegister = async (userData) => {
    try {
      await registUser(userData);
      // Optionally, log in the user after successful registration
      handleLogin({ email: userData.email, password: userData.password });
      closeRegisterModal();
    } catch (error) {
      console.error("Registration failed:", error);
    }
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
    handleLogin({ email: formData.email, password: formData.password });
  };

  const handleRegisterSubmit = (formData) => {
    handleRegister({
      email: formData.email,
      password: formData.password,
      name: formData.name,
    });
  };

  const validateForm = (event) => {
    const isValid = event.target.form.checkValidity();
    setIsFormValid(isValid);
  };

  return (
    <Router>
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
              <Route path="/profile" element={<Profile />} />
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
    </Router>
  );
}

export default App;
