import React, { useEffect } from "react";
import ModalWithForm from "../ModalWithForm/ModalWithForm";
import useFormState from "../../hooks/formState";
import "./RegisterModal.css";

function RegisterModal({ isOpen, onClose, onSubmit, openLoginModal }) {
  const { formData, error, setError, handleChange, resetForm } = useFormState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
  });

  const { email, password, confirmPassword, name } = formData;

  useEffect(() => {
    if (isOpen) {
      resetForm();
    }
  }, [isOpen]);

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
      onClose();
    } catch (err) {
      console.error(err);
      setError(err.message || "An error occurred. Please try again.");
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
        onChange={handleChange}
        required
      />
      <p className="modal__label">Password</p>
      <input
        className={`modal__input ${password ? "filled" : ""}`}
        type="password"
        name="password"
        placeholder="Password"
        value={password}
        onChange={handleChange}
        required
      />
      <p className="modal__label">Confirm password</p>
      <input
        className={`modal__input ${confirmPassword ? "filled" : ""}`}
        type="password"
        name="confirmPassword"
        placeholder="Confirm Password"
        value={confirmPassword}
        onChange={handleChange}
        required
      />
      <p className="modal__label">Username</p>
      <input
        className={`modal__input ${name ? "filled" : ""}`}
        type="text"
        name="name"
        placeholder="Username"
        value={name}
        onChange={handleChange}
        required
      />
      {error && <span className="modal__error">{error}</span>}
    </ModalWithForm>
  );
}

export default RegisterModal;
