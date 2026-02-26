import { Logo } from "../assets/Images/image";
import SvgIcons from "../assets/Svg/SvgIcons";

const Login = () => {
  return (
    <>
      <div className="login-outer">
        <div className="background-wrapper">
          <div className="bg-orb orb-1" />
          <div className="bg-orb orb-2" />
          <div className="background-grid" />
        </div>
        <div className="auth-container">
          <div className="logo-container">
            <a href="/">
              <img src={Logo} alt="The Rich Crowd Logo" />
            </a>
          </div>
          <h2>Member Access</h2>
          <p className="sub-title">Secure Decentralized Gateway</p>
          <div className="wallet-connect">
            <button type="button" id="connectWallet">
              {SvgIcons.waletIcon}
              
              {" "}
              Connect Wallet
            </button>
            <div className="wallet-info" id="walletInfo">
              <div className="status-dot" />
              <span id="walletAddress">0x...</span>
            </div>
          </div>
          <form
            action="#"
            method="post"
            id="loginForm"
          >
            <input
              type="hidden"
              name="wallet_address"
              id="walletAddressInput"
            />
            <input type="hidden" name="signature" id="walletSignature" />
            <button type="submit" id="loginButton" disabled>
              Authenticate Access
            </button>
          </form>
          <div className="register-link">
            Not a member yet?{" "}
            <a href="/register">Join the Elite</a>
          </div>
        </div>
      </div>
    </>
  );
};
export default Login;
