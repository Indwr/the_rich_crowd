import { useState } from "react";
import { Logo } from "../assets/Images/image";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleToggle = () => {
    setMenuOpen(!menuOpen);
  };

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();

    const section = document.querySelector(id);

    if (section) {
      const offset = 30;
      const top =
        section.getBoundingClientRect().top + window.pageYOffset - offset;

      window.scrollTo({
        top,
        behavior: "smooth",
      });
    }

    setMenuOpen(false);
  };

  return (
    <header>
      <div className="container">
        <nav>
          <div className="logo">
            <img src={Logo} alt="The Rich Crowd Logo" />
          </div>

          {/* Hamburger */}
          <div
            className={`hamburger ${menuOpen ? "toggle" : ""}`}
            onClick={handleToggle}
          >
            <div className="line1"></div>
            <div className="line2"></div>
            <div className="line3"></div>
          </div>

          {/* Nav Links */}
          <div className={`nav-links ${menuOpen ? "nav-active" : ""}`}>
            <a href="#home" onClick={e => handleScroll(e, "#home")}>
              Home
            </a>
            <a href="#about" onClick={e => handleScroll(e, "#about")}>
              About
            </a>
            <a href="#token" onClick={e => handleScroll(e, "#token")}>
              KSN Token
            </a>
            <a href="#tech" onClick={e => handleScroll(e, "#tech")}>
              Technology
            </a>
            <a href="#roadmap" onClick={e => handleScroll(e, "#roadmap")}>
              Roadmap
            </a>
            <a href="/login">Login</a>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
