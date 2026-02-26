import { useState } from "react";
import { Logo } from "../assets/Images/image";
import { Link } from "react-router-dom";

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
            <Link to="#home" onClick={e => handleScroll(e, "#home")}>
              Home
            </Link>
            <Link to="#about" onClick={e => handleScroll(e, "#about")}>
              About
            </Link>
            <Link to="#token" onClick={e => handleScroll(e, "#token")}>
              KSN Token
            </Link>
            <Link to="#tech" onClick={e => handleScroll(e, "#tech")}>
              Technology
            </Link>
            <Link to="#roadmap" onClick={e => handleScroll(e, "#roadmap")}>
              Roadmap
            </Link>
            <Link to="/login">Login</Link>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
