import { Link } from "react-router-dom";
import { Logo } from "../assets/Images/image";

const Footer = () => {
  return (
    <>
      <footer>
        <div className="container">
          <div className="footer-content">
            <div className="footer-col">
              <img
                src={Logo}
                alt="Logo"
                style={{ height: 50, marginBottom: 20 }}
              />
              <p
                style={{ color: "#b0b0b0", maxWidth: 300, fontSize: "0.9rem" }}
              >
                A decentralized revolution that knows no bounds. Join us on a
                journey towards financial freedom and empowerment.
              </p>
            </div>
            <div className="footer-col">
              <h4>Quick Links</h4>
              <Link to="#home">Home</Link>
              <Link to="#about">About Us</Link>
              <Link to="#token">Tokenomics</Link>
              <Link to="#roadmap">Roadmap</Link>
            </div>
            <div className="footer-col">
              <h4>Legal</h4>
              <Link to="#">Smart Contract</Link>
              <Link to="#">Privacy Policy</Link>
              <Link to="#">Terms of Service</Link>
            </div>
          </div>
          <div className="copyright">
            © 2026 The Rich Crowd. All Rights Reserved.
          </div>
        </div>
      </footer>
    </>
  );
};
export default Footer;
