import React from "react";
import { NavLink } from "react-router-dom";
import logoutIcon from "../../../public/assets/icons/logout.svg";
import "./Header.css";

function Header({ isLoggedIn, currentUser, onLogout, openLoginModal }) {
  console.log("Current User:", currentUser);
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
              to="/saved-games"
              className={({ isActive }) =>
                isActive ? "header__link header__link_active" : "header__link"
              }
            >
              Saved Games
            </NavLink>
            <div className="header__signout">
              <button
                onClick={onLogout}
                className="header__link header__logout-btn"
              >
                {/* placeholder username for now */}
                Jill
                <img
                  src={logoutIcon}
                  alt="Log out"
                  className="header__logout-icon"
                />
                {currentUser ? currentUser.name : "User"}
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
