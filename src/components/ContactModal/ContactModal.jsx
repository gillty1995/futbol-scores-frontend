import ModalWithForm from "../ModalWithForm/ModalWithForm";
import { useEffect, useState } from "react";
import Preloader from "../Preloader/Preloader";
import "./ContactModal.css";

function ContactModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isFormValid, setIsFormValid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    setIsFormValid(
      formData.name.trim() !== "" &&
        formData.email.trim() !== "" &&
        formData.message.trim() !== ""
    );
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();

    if (!isFormValid) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:3002/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("Message sent successfully");
        setFormData({ name: "", email: "", message: "" });
        onClose();
      } else {
        alert("Failed to send message");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      alert("An error occurred while sending the message");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!isOpen) {
      setFormData({ name: "", email: "", message: "" });
      setIsFormValid(false);
    }
  }, [isOpen]);

  return (
    <ModalWithForm
      title="Contact the Creator"
      buttonText={isLoading ? "Sending..." : "Send"}
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleContactSubmit}
      isFormValid={isFormValid && !isLoading}
      isLoading={isLoading}
    >
      <div className="contact__modal">
        {isLoading ? (
          <Preloader className="contact__modal-preloader" />
        ) : (
          <>
            <p className="contact__modal-text">
              Would you like to send a message to the creator of this website
              with any notes or requests?
            </p>
            <div className="contact__modal-info">
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={formData.name}
                onChange={handleInputChange}
                className="contact__modal-name"
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Your Email"
                value={formData.email}
                onChange={handleInputChange}
                className="contact__modal-email"
                required
              />
            </div>
            <textarea
              name="message"
              placeholder="Your message..."
              value={formData.message}
              onChange={handleInputChange}
              className="contact__modal-message"
              required
            />
          </>
        )}
      </div>
    </ModalWithForm>
  );
}

export default ContactModal;
