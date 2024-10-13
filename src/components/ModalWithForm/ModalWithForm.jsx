import { useEffect, useRef } from "react";
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
  const startY = useRef(0);
  const threshold = 100;

  const handleTouchStart = (e) => {
    startY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e) => {
    e.preventDefault();
    const currentY = e.touches[0].clientY;
    const diffY = currentY - startY.current;

    if (diffY > threshold) {
      console.log("Swipe down detected");
      onClose();
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";

      document.addEventListener("keydown", handleEscapeClose);
      document.addEventListener("touchstart", handleTouchStart, {
        passive: false,
      });
      document.addEventListener("touchmove", handleTouchMove, {
        passive: false,
      });

      return () => {
        document.body.style.overflow = "auto";
        document.removeEventListener("keydown", handleEscapeClose);
        document.removeEventListener("touchstart", handleTouchStart);
        document.removeEventListener("touchmove", handleTouchMove);
      };
    }
  }, [isOpen, onClose]);

  const handleEscapeClose = (e) => {
    if (e.key === "Escape") onClose();
  };

  const handleOverlayClick = (e) => {
    if (e.target.classList.contains("modal_opened")) {
      onClose();
    }
  };

  return (
    <div
      className={`modal ${isOpen ? "modal_opened" : ""}`}
      onClick={handleOverlayClick}
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
