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
              <a href="#home">Home</a>
              <a href="#about">About Us</a>
              <a href="#token">Tokenomics</a>
              <a href="#roadmap">Roadmap</a>
            </div>
            <div className="footer-col">
              <h4>Legal</h4>
              <a href="#">Smart Contract</a>
              <a href="#">Privacy Policy</a>
              <a href="#">Terms of Service</a>
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
