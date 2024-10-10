import { useEffect, useState } from "react";
import "./ModalWithForm.css";

function ModalWithForm({
  children,
  buttonText,
  title,
  isOpen,
  onClose,
  onSubmit,
  isFormValid,
  extraAction,
  isLoading,
}) {
  const [startY, setStartY] = useState(0);

  useEffect(() => {
    if (!isOpen) return;

    const handleEscapeClose = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscapeClose);

    return () => {
      document.removeEventListener("keydown", handleEscapeClose);
    };
  }, [isOpen, onClose]);

  const handleOverlayClick = (e) => {
    if (e.target.classList.contains("modal_opened")) {
      onClose();
    }
  };

  const handleTouchStart = (e) => {
    setStartY(e.touches[0].clientY);
  };

  const handleTouchMove = (e) => {
    const currentY = e.touches[0].clientY;
    const diffY = currentY - startY;

    if (diffY > 50) {
      onClose();
    }
  };

  return (
    <div
      className={`modal ${isOpen && "modal_opened"}`}
      onClick={handleOverlayClick}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
    >
      <div className="modal__content">
        <div className="modal__swipe-line" onClick={onClose}></div>
        <h2 className="modal__title">{title}</h2>
        <button
          onClick={onClose}
          type="button"
          className="modal__close"
        ></button>
        <form className="modal__form" onSubmit={onSubmit}>
          {children}
          <button
            onSubmit={onSubmit}
            type="submit"
            className={`modal__submit ${
              isLoading ? "modal__submit_hidden" : ""
            }`}
            disabled={!isFormValid || isLoading}
          >
            {buttonText}
          </button>
        </form>
        {!isLoading && <div className="modal__footer">{extraAction}</div>}
      </div>
    </div>
  );
}

export default ModalWithForm;
