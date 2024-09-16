import React, { useEffect } from "react";
import ModalWithForm from "../ModalWithForm/ModalWithForm";
import useFormState from "../../hooks/formState";
import "./LoginModal.css";

function LoginModal({ isOpen, onClose, onSubmit, openRegisterModal }) {
  const { formData, error, setError, resetForm, handleChange } = useFormState({
    email: "",
    password: "",
  });

  const isFormValid = formData.email && formData.password;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isFormValid) {
      setError("Please fill in all fields.");
      return;
    }

    onSubmit(formData)
      .then(() => {
        onClose();
      })
      .catch((err) => {
        setError(err.message || "An error occurred. Please try again.");
      });
  };

  const handleSignUpClick = () => {
    openRegisterModal();
    onClose();
  };

  useEffect(() => {
    if (!isOpen) {
      resetForm();
    }
  }, [isOpen]);

  return (
    <ModalWithForm
      title="Login"
      buttonText="Sign In"
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      isFormValid={isFormValid}
      extraAction={
        <div className="modal__alternate-action">
          <p className="modal__or">or</p>
          <button className="modal__link" onClick={handleSignUpClick}>
            Sign Up
          </button>
        </div>
      }
    >
      <p className="modal__label">Email</p>
      <input
        className={`modal__input ${formData.email ? "filled" : ""}`}
        type="email"
        name="email"
        placeholder="Enter email"
        value={formData.email}
        onChange={handleChange}
        required
      />
      <p className="modal__label">Password</p>
      <input
        className={`modal__input ${formData.password ? "filled" : ""}`}
        type="password"
        name="password"
        placeholder="Password"
        value={formData.password}
        onChange={handleChange}
        required
      />
      {error && <span className="modal__error">{error}</span>}
    </ModalWithForm>
  );
}

export default LoginModal;
