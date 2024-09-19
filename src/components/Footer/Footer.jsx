import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <p className="footer__info">
        &copy; 2024 Developed by Gill Hermelin, powered by{" "}
        <a
          href="https://www.api-football.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="footer__link"
        >
          API-Football
        </a>
      </p>
    </footer>
  );
}

export default Footer;
