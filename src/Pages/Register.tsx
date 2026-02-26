import { Logo } from "../assets/Images/image";
import SvgIcons from "../assets/Svg/SvgIcons";

const Register = () => {
  return (
    <>
      <div className="register-outer ">
        <div className="login-outer">
          <div className="background-wrapper">
            <div className="bg-orb orb-1" />
            <div className="bg-orb orb-2" />
            <div className="background-grid" />
          </div>
          <div className="auth-container">
            <div className="logo-container">
              <a href="/">
                <img
                  src={Logo}
                  alt="The Rich Crowd Logo"
                />
              </a>
            </div>
            <h2>Create Account</h2>
            <p className="sub-title">Join the Future of Decentralized Wealth</p>
            <div className="wallet-connect">
              <button type="button" id="connectWallet">
                {SvgIcons.waletIcon}{" "}
                Connect Wallet
              </button>
              <div className="wallet-info" id="walletInfo">
                <div className="wallet-detail">
                  <div className="status-dot" />
                  <span id="walletAddress">0x...</span>
                </div>
              </div>
            </div>
            <form
              action="#"
              method="post"
              id="registrationForm"
            >
              <input
                type="hidden"
                id="csrf_token"
                name="csrf_test_name"
                defaultValue="3f073d21bd68136e0d4af657f0e07e6b"
              />
              <input
                type="hidden"
                name="wallet_address"
                id="walletAddressInput"
                required
              />
              <input type="hidden" name="signature" id="walletSignature" />
              <div className="form-group">
                <input
                  type="text"
                  name="sponsor_id"
                  id="sponsor_id"
                  placeholder="Sponsor ID"
                />
              </div>
              <button type="submit" id="registerButton" disabled>
                Register Account
              </button>
            </form>
            <div className="login-link">
              Already a member?{" "}
              <a href="/login">Sign In</a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default Register;
