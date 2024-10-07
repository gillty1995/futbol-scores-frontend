import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import logoutIcon from "../../../public/assets/icons/logout.svg";
import menuIcon from "../../../public/assets/icons/mobile/icon/menu.svg";
import closeIcon from "../../../public/assets/icons/black/back.svg";
import "./Header.css";

function Header({
  isLoggedIn,
  currentUser,
  onLogout,
  openLoginModal,
  resetSearch,
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className="header">
      <h1 className="header__logo">FutbolScores</h1>

      <button className="header__menu-icon" onClick={toggleMenu}>
        <img
          src={isMenuOpen ? closeIcon : menuIcon}
          alt="Menu"
          className="header__menu-img"
        />
      </button>

      <nav className={`header__nav ${isMenuOpen ? "header__nav_open" : ""}`}>
        <div className="header__homepage-btn">
          <NavLink
            to="/"
            onClick={() => {
              resetSearch();
              closeMenu();
            }}
            className={({ isActive }) =>
              isActive ? "header__link header__link_active" : "header__link"
            }
          >
            Home
          </NavLink>
        </div>
        <NavLink
          to="/live"
          onClick={closeMenu}
          className={({ isActive }) =>
            isActive
              ? "header__link header__link_active header__link_mobile"
              : "header__link header__link_mobile"
          }
        >
          Live Now
        </NavLink>
        {isLoggedIn ? (
          <>
            <NavLink
              to="/saved-games"
              onClick={closeMenu}
              className={({ isActive }) =>
                isActive
                  ? "header__link header__link_active header__link_mobile"
                  : "header__link header__link_mobile"
              }
            >
              Saved Games
            </NavLink>
            <div className="header__signout">
              <button
                onClick={() => {
                  onLogout();
                  closeMenu();
                }}
                className="header__link header__logout-btn"
              >
                {currentUser ? currentUser.name : "User"}
                <img
                  src={logoutIcon}
                  alt="Log out"
                  className="header__logout-icon"
                />
              </button>
            </div>
          </>
        ) : (
          <div className="header__signin">
            <button
              onClick={() => {
                openLoginModal();
                closeMenu();
              }}
              className="header__link"
            >
              Sign In
            </button>
          </div>
        )}
      </nav>
    </header>
  );
}

export default Header;
