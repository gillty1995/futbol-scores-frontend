import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CurrentUserContext from "../../contexts/CurrentUserContext";

import Header from "../Header/Header";
import Main from "../Main/Main";
import ApiData from "../ApiData/ApiData";
import Profile from "../Profile/Profile";
import Footer from "../Footer/Footer";

import "./App.css";

function App() {
  const [currentUser, setCurrentUser] = useState(null);

  return (
    <Router>
      <CurrentUserContext.Provider value={currentUser}>
        <div className="page">
          <div className="page__content">
            <Header />
            <Routes>
              <Route path="/" element={<Main />} />
              <Route path="/api-data" element={<ApiData />} />
              <Route path="/profile" element={<Profile />} />
            </Routes>
            <Footer />
          </div>
        </div>
      </CurrentUserContext.Provider>
    </Router>
  );
}

export default App;
