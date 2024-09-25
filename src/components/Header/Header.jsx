// import React from "react";
// import { NavLink } from "react-router-dom";
// import logoutIcon from "../../../public/assets/icons/logout.svg";
// import "./Header.css";

// function Header({
//   isLoggedIn,
//   currentUser,
//   onLogout,
//   openLoginModal,
//   resetSearch,
// }) {
//   return (
//     <header className="header">
//       <h1 className="header__logo">FutbolScores</h1>
//       <nav className="header__nav">
//         <div className="header__homepage-btn">
//           <NavLink
//             to="/"
//             onClick={resetSearch}
//             className={({ isActive }) =>
//               isActive ? "header__link header__link_active" : "header__link"
//             }
//           >
//             Home
//           </NavLink>
//         </div>
//         {isLoggedIn ? (
//           <>
//             <NavLink
//               to="/saved-games"
//               className={({ isActive }) =>
//                 isActive ? "header__link header__link_active" : "header__link"
//               }
//             >
//               Saved Games
//             </NavLink>
//             <div className="header__signout">
//               <button
//                 onClick={onLogout}
//                 className="header__link header__logout-btn"
//               >
//                 {/* placeholder username for now */}
//                 Jill
//                 <img
//                   src={logoutIcon}
//                   alt="Log out"
//                   className="header__logout-icon"
//                 />
//                 {currentUser ? currentUser.name : "User"}
//               </button>
//             </div>
//           </>
//         ) : (
//           <div className="header__signin">
//             <button onClick={openLoginModal} className="header__link">
//               Sign In
//             </button>
//           </div>
//         )}
//       </nav>
//     </header>
//   );
// }

// export default Header;

import React from "react";
import { NavLink } from "react-router-dom";
import logoutIcon from "../../../public/assets/icons/logout.svg";
import "./Header.css";

function Header({
  isLoggedIn,
  currentUser,
  onLogout,
  openLoginModal,
  resetSearch,
}) {
  return (
    <header className="header">
      <h1 className="header__logo">FutbolScores</h1>
      <nav className="header__nav">
        <div className="header__homepage-btn">
          <NavLink
            to="/"
            onClick={resetSearch}
            className={({ isActive }) =>
              isActive ? "header__link header__link_active" : "header__link"
            }
          >
            Home
          </NavLink>
        </div>
        <NavLink
          to="/live"
          className={({ isActive }) =>
            isActive ? "header__link header__link_active" : "header__link"
          }
        >
          Live Now
        </NavLink>
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
