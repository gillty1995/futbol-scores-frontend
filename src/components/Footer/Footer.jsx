import { useState } from "react";
import ContactModal from "../ContactModal/ContactModal";
import githubImage from "../../../public/assets/icons/icon/github.svg";
import "./Footer.css";

function Footer() {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  const handleContactClick = () => {
    setIsContactModalOpen(true);
  };

  const closeContactModal = () => {
    setIsContactModalOpen(false);
  };

  return (
    <footer className="footer">
      <p className="footer__info">
        &copy; 2024 Gill Hermelin, Powered by{" "}
        <a
          href="https://www.api-football.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="footer__link"
        >
          API-Football
        </a>
      </p>

      <div className="footer__buttons">
        <button
          className="footer__button"
          onClick={() => (window.location.href = "/")}
        >
          Home
        </button>
        <button className="footer__button" onClick={handleContactClick}>
          Contact
        </button>
        <a
          href="https://github.com/gillty1995"
          target="_blank"
          rel="noopener noreferrer"
          className="footer__button-github"
        >
          <img src={githubImage} alt="GitHub" className="footer__github-icon" />
        </a>
      </div>

      <ContactModal isOpen={isContactModalOpen} onClose={closeContactModal} />
    </footer>
  );
}

export default Footer;
