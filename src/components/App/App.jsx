// import { useState, useEffect } from "react";
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import CurrentUserContext from "../../contexts/CurrentUserContext";

// import Header from "../Header/Header";
// import Main from "../Main/Main";
// import ApiData from "../ApiData/ApiData";
// import Profile from "../Profile/Profile";
// import Footer from "../Footer/Footer";
// import ModalWithForm from "../ModalWithForm/ModalWithForm";

// import "./App.css";

// function App() {
//   const [currentUser, setCurrentUser] = useState(null);
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [isFormValid, setIsFormValid] = useState(false);

//   useEffect(() => {
//     // Mock check to see if the user is logged in.
//     // Replace this with real logic to check if the user is authenticated.
//     const user = localStorage.getItem("user");
//     if (user) {
//       setCurrentUser(JSON.parse(user));
//       setIsLoggedIn(true);
//     }
//   }, []);

//   const handleLogin = (user) => {
//     setCurrentUser(user);
//     setIsLoggedIn(true);
//     localStorage.setItem("user", JSON.stringify(user)); // Mock storing user data
//   };

//   const handleLogout = () => {
//     setCurrentUser(null);
//     setIsLoggedIn(false);
//     localStorage.removeItem("user"); // Mock removing user data
//   };

//   const openModal = () => {
//     setIsModalOpen(true);
//   };

//   const closeModal = () => {
//     setIsModalOpen(false);
//   };

//   const handleFormSubmit = (event) => {
//     event.preventDefault();
//     // Handle form submission logic here
//     console.log("Form submitted");
//     closeModal();
//   };

//   // Function to handle form validation, which can be triggered on input change
//   const validateForm = (event) => {
//     // Implement form validation logic here
//     // For example, set the form as valid if all required fields are filled
//     const isValid = true; // Example condition
//     setIsFormValid(isValid);
//   };

//   return (
//     <Router>
//       <CurrentUserContext.Provider value={currentUser}>
//         <div className="page">
//           <div className="page__content">
//             <Header
//               isLoggedIn={isLoggedIn}
//               currentUser={currentUser}
//               onLogout={handleLogout}
//               openModal={openModal}
//             />
//             <Routes>
//               <Route path="/" element={<Main />} />
//               <Route path="/api-data" element={<ApiData />} />
//               <Route path="/profile" element={<Profile />} />
//             </Routes>
//             <Footer />
//           </div>
//           <ModalWithForm
//             title="Form Title"
//             buttonText="Submit"
//             isOpen={isModalOpen}
//             onClose={closeModal}
//             onSubmit={handleFormSubmit}
//             isFormValid={isFormValid}
//           >
//             {/* Form fields go here */}
//             <input type="text" onChange={validateForm} required />
//           </ModalWithForm>
//         </div>
//       </CurrentUserContext.Provider>
//     </Router>
//   );
// }

// export default App;

import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CurrentUserContext from "../../contexts/CurrentUserContext";

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

  const handleLogin = (user) => {
    setCurrentUser(user);
    setIsLoggedIn(true);
    localStorage.setItem("user", JSON.stringify(user));
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
    // Handle login logic here
    console.log("Login form submitted", formData);
    handleLogin({ username: formData.username });
    closeLoginModal();
  };

  const handleRegisterSubmit = (formData) => {
    // Handle registration logic here
    console.log("Register form submitted", formData);
    // Optionally, handle login after registration
    closeRegisterModal();
  };

  const validateForm = (event) => {
    // Implement form validation logic here
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
          />
        </div>
      </CurrentUserContext.Provider>
    </Router>
  );
}

export default App;
