import React, { useState, useEffect } from "react";
import ModalWithForm from "../ModalWithForm/ModalWithForm";
import "./RegisterModal.css";

function RegisterModal({ isOpen, onClose, onSubmit, openLoginModal }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setName("");
      setError("");
    }
  }, [isOpen]);

  // Form validation based on the fields
  const isFormValid =
    email &&
    password &&
    confirmPassword &&
    name &&
    password === confirmPassword;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await onSubmit({ email, password, name });
      onClose(); // Close modal only after successful submission
    } catch (err) {
      console.error(err); // Log error for debugging
      setError(err.message || "An error occurred. Please try again."); // Display user-friendly error message
    }
  };

  const handleOpenLoginModal = () => {
    openLoginModal();
    onClose();
  };

  return (
    <ModalWithForm
      title="Sign Up"
      buttonText="Sign Up"
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      isFormValid={isFormValid}
      extraAction={
        <div className="modal__alternate-action">
          <p className="modal__or">or</p>
          <button className="modal__link" onClick={handleOpenLoginModal}>
            Sign In
          </button>
        </div>
      }
    >
      <p className="modal__label">Email</p>
      <input
        className={`modal__input ${email ? "filled" : ""}`}
        type="email"
        name="email"
        placeholder="Enter email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <p className="modal__label">Password</p>
      <input
        className={`modal__input ${password ? "filled" : ""}`}
        type="password"
        name="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <p className="modal__label">Confirm password</p>
      <input
        className={`modal__input ${confirmPassword ? "filled" : ""}`}
        type="password"
        name="confirmPassword"
        placeholder="Confirm Password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        required
      />
      <p className="modal__label">Username</p>
      <input
        className={`modal__input ${name ? "filled" : ""}`}
        type="text"
        name="name"
        placeholder="Username"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      {error && <span className="modal__error">{error}</span>}
    </ModalWithForm>
  );
}

export default RegisterModal;
