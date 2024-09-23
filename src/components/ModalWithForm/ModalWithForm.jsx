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
  return (
    <div className={`modal ${isOpen && "modal_opened"}`}>
      <div className="modal__content">
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
            disabled={!isFormValid}
          >
            {buttonText}
          </button>
        </form>
        <div className="modal__footer">{extraAction}</div>
      </div>
    </div>
  );
}

export default ModalWithForm;
