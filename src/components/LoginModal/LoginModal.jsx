import React, { useState } from "react";
import ModalWithForm from "../ModalWithForm/ModalWithForm";
import "./LoginModal.css";

function LoginModal({
  isOpen,
  onClose,
  onSubmit,
  isFormValid,
  openRegisterModal,
}) {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    // Implement form validation logic here
    const isValid = formData.username && formData.password; // Example validation
    setIsFormValid(isValid);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log("Form submitted", formData);
    onSubmit(formData);
  };

  const handleSignUpClick = () => {
    openRegisterModal();
    onClose();
  };

  return (
    <ModalWithForm
      title="Login"
      buttonText="Sign In"
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      isFormValid={isFormValid}
    >
      <input
        type="text"
        name="username"
        placeholder="Username"
        value={formData.username}
        onChange={handleChange}
        required
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        value={formData.password}
        onChange={handleChange}
        required
      />
      <button type="button" className="modal__link" onClick={handleSignUpClick}>
        Sign Up
      </button>
    </ModalWithForm>
  );
}

export default LoginModal;
