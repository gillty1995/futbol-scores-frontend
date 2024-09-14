import React from "react";
import { NavLink } from "react-router-dom";
import "./Header.css";

function Header({ isLoggedIn, currentUser, onLogout, openLoginModal }) {
  return (
    <header className="header">
      <p className="header__logo">FutbolScores</p>
      <nav className="header__nav">
        <div className="header__homepage-btn">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? "header__link header__link_active" : "header__link"
            }
          >
            Home
          </NavLink>
        </div>
        {isLoggedIn ? (
          <>
            <NavLink
              to="/profile"
              className={({ isActive }) =>
                isActive ? "header__link header__link_active" : "header__link"
              }
            >
              Saved Games
            </NavLink>
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
