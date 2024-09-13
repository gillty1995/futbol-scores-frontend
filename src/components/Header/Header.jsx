import React from "react";
import { Link, NavLink } from "react-router-dom";

import "./Header.css";

function Header({ isLoggedIn, currentUser, onLogout, openLoginModal }) {
  return (
    <header className="header">
      <p className="header__logo">FutbolScores</p>
      <nav className="header__nav">
        <div className="header__homepage-btn">
          <NavLink
            to="/"
            className="header__link"
            activeClassName="header__link_active"
          >
            Home
          </NavLink>
        </div>
        {isLoggedIn ? (
          <>
            <Link to="/profile" className="header__link">
              Saved Games
            </Link>
            <div className="header__signout">
              <button onClick={onLogout} className="header__link">
                Log out ({currentUser?.name || "User"})
              </button>
            </div>
          </>
        ) : (
          <div className="header__signin">
            <button onClick={openLoginModal} className="header__link">
              Sign In
            </button>
          </div>
        )}
      </nav>
    </header>
  );
}

export default Header;
