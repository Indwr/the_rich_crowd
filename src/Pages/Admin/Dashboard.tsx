import { type FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Logo } from "../../assets/Images/image";
import { useAuth } from "../../features/auth/hooks/useAuth";

const Dashboard = () => {
  const navigate = useNavigate();
  const { authenticatePreview, isAuthenticating } = useAuth();
  const [previewId, setPreviewId] = useState("");

  const handlePreviewLogin = async (event: FormEvent) => {
    event.preventDefault();
    const userId = previewId.trim();
    if (!userId) return;

    try {
      await authenticatePreview(userId);
      toast.success("Preview mode enabled.");
      navigate("/dashboard");
    } catch (error: any) {
      toast.error(error?.message ?? "Failed to start preview mode.");
    }
  };

  return (
    <>
      <div className="dashboard-container">
        <div className="user-container">
          <div className="user-greeting">
            <p id="greetingMessage">Good Evening, </p>
          </div>
        </div>
        <div className="profile-hero-section">
          <div className="hero-card user-info">
            <div className="user-header">
              <div className="user-avatar-circle">
                <img src={Logo} alt="User" />
                <div className="avatar-badge">
                  <img src={Logo} alt="badge" />
                </div>
              </div>
              <div className="user-text">
                <h3>
                  User ID <span>3869766</span>
                </h3>
                <p>
                  Sponsor by ID <span>2072139</span>
                </p>
              </div>
            </div>
            <div className="rank-section">
              <span className="rank-label">Rank</span>
              <div className="stars">
                <i className="fas fa-star active" />
                <i className="fas fa-star active" />
                <i className="fas fa-star" />
                <i className="fas fa-star" />
                <i className="fas fa-star" />
                <i className="fas fa-star" />
                <i className="fas fa-star" />
                <i className="fas fa-star" />
                <i className="fas fa-star" />
                <i className="fas fa-star" />
              </div>
            </div>
            <div className="wallet-pill" onClick={undefined}>
              <span id="walletAddressDisplay">0x81f7...77C7</span>
              <i
                className="fas fa-copy"
                onClick={undefined}
              />
            </div>
          </div>
          <div className="right-column">
            <div className="hero-card links-info">
              <div className="link-section">
                <label className="section-label">Personal link</label>
                <div className="input-group">
                  <input
                    type="text"
                    defaultValue="https://therichcrowd.live/register?ref=3869766"
                    readOnly
                    id="refLinkInput"
                  />
                  <i className="fas fa-copy" onClick={undefined} />
                </div>
              </div>
              <form className="preview-group" onSubmit={handlePreviewLogin}>
                <input
                  type="text"
                  name="userid"
                  className="preview-input"
                  placeholder="Preview ID..."
                  required
                  value={previewId}
                  onChange={(event) => setPreviewId(event.target.value)}
                />
                <button type="submit" className="go-btn" disabled={isAuthenticating}>
                  {isAuthenticating ? "Loading..." : "GO"}
                </button>
              </form>
            </div>
            <div className="hero-card ksn-card">
              <div className="ksn-info">
                <h4>KSN/USDT</h4>
                <div className="ksn-pill" id="ksnPriceDisplay">
                  0.02004 USDT
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="metric-grid">
          <div className="grid-section-title">
            <i className="fas fa-wallet" /> Wallet &amp; Earnings
          </div>
          <div className="metric-card">
            <div className="metric-header">
              <div className="metric-title">Wallets</div>
              <i className="fas fa-exchange-alt metric-icon-bg" />
            </div>
            <div className="split-container">
              <div className="split-item">
                <div className="split-value">111,110.00</div>
                <span className="split-label">X2 Auto Upgrade</span>
              </div>
              <div className="split-divider" />
              <div className="split-item right">
                <div className="split-value">0.00</div>
                <span className="split-label">X3 Wallet</span>
              </div>
            </div>
          </div>
          <div className="metric-card">
            <div className="metric-header">
              <div className="metric-title">Profits</div>
              <i className="fas fa-chart-line metric-icon-bg" />
            </div>
            <div className="metric-value">
              0.00 <span>USDT</span>
            </div>
          </div>
          <div className="metric-card">
            <div className="metric-header">
              <div className="metric-title">Partners</div>
              <i className="fas fa-users metric-icon-bg" />
            </div>
            <div className="metric-value">0</div>
          </div>
          <div className="grid-section-title">
            <i className="fas fa-briefcase" /> X2 Business Overview
          </div>
          <div className="metric-card">
            <div className="metric-header">
              <div className="metric-title">X2 Team Business</div>
              <i className="fas fa-hand-holding-usd metric-icon-bg" />
            </div>
            <div className="metric-value">
              0 <span>USDT</span>
            </div>
          </div>
          <div className="metric-card">
            <div className="metric-header">
              <div className="metric-title">X2 L/R Business</div>
              <i className="fas fa-balance-scale metric-icon-bg" />
            </div>
            <div className="split-container">
              <div className="split-item">
                <div className="split-value">0.00</div>
                <span className="split-label">Left (USDT)</span>
              </div>
              <div className="split-divider" />
              <div className="split-item right">
                <div className="split-value">0.00</div>
                <span className="split-label">Right (USDT)</span>
              </div>
            </div>
          </div>
          <div className="metric-card">
            <div className="metric-header">
              <div className="metric-title">X2 L/R Team</div>
              <i className="fas fa-network-wired metric-icon-bg" />
            </div>
            <div className="split-container">
              <div className="split-item">
                <div className="split-value">0</div>
                <span className="split-label">Left Team</span>
              </div>
              <div className="split-divider" />
              <div className="split-item right">
                <div className="split-value">0</div>
                <span className="split-label">Right Team</span>
              </div>
            </div>
          </div>
          <div className="metric-card">
            <div className="metric-header">
              <div className="metric-title">X2 Total Team</div>
              <i className="fas fa-user-friends metric-icon-bg" />
            </div>
            <div className="metric-value">0</div>
          </div>
          <div className="grid-section-title">
            <i className="fas fa-coins" /> X3 Staking Business
          </div>
          <div className="metric-card">
            <div className="metric-header">
              <div className="metric-title">X3 Staking Biz</div>
              <i className="fas fa-layer-group metric-icon-bg" />
            </div>
            <div className="metric-value">0</div>
          </div>
          <div className="metric-card">
            <div className="metric-header">
              <div className="metric-title">X3 L/R Business</div>
              <i className="fas fa-columns metric-icon-bg" />
            </div>
            <div className="split-container">
              <div className="split-item">
                <div className="split-value">0</div>
                <span className="split-label">Left</span>
              </div>
              <div className="split-divider" />
              <div className="split-item right">
                <div className="split-value">0</div>
                <span className="split-label">Right</span>
              </div>
            </div>
          </div>
          <div className="metric-card">
            <div className="metric-header">
              <div className="metric-title">X3 Common Biz</div>
              <i className="fas fa-globe metric-icon-bg" />
            </div>
            <div className="metric-value">0</div>
          </div>
          <div className="grid-section-title">
            <i className="fas fa-sync" /> X3 Compounding Business
          </div>
          <div className="metric-card">
            <div className="metric-header">
              <div className="metric-title">X3 Compounding</div>
              <i className="fas fa-recycle metric-icon-bg" />
            </div>
            <div className="metric-value">0</div>
          </div>
          <div className="metric-card">
            <div className="metric-header">
              <div className="metric-title">X3 Compounding L/R</div>
              <i className="fas fa-random metric-icon-bg" />
            </div>
            <div className="split-container">
              <div className="split-item">
                <div className="split-value">0</div>
                <span className="split-label">Left</span>
              </div>
              <div className="split-divider" />
              <div className="split-item right">
                <div className="split-value">0</div>
                <span className="split-label">Right</span>
              </div>
            </div>
          </div>
        </div>
        <div className="program-section-header">
          <i className="fas fa-th-large" />
          <span>The Rich Crowd Programs</span>
        </div>
        <div className="program-grid">
          <div className="metric-card program-card subsection-title-card">
            <div className="metric-title">🔹 X2 Income</div>
          </div>
          <div className="metric-card program-card">
            <div className="metric-header">
              <div className="metric-title">X2 Direct Income</div>
              <i className="fas fa-hand-holding-usd metric-icon-bg" />
            </div>
            <div className="metric-value">
              0 <span>USDT</span>
            </div>
          </div>
          <div className="metric-card program-card">
            <div className="metric-header">
              <div className="metric-title">X2 Hybrid Level Income</div>
              <i className="fas fa-layer-group metric-icon-bg" />
            </div>
            <div className="metric-value">
              0 <span>USDT</span>
            </div>
          </div>
          <div className="metric-card program-card subsection-title-card">
            <div className="metric-title">🔹 TRC Income</div>
          </div>
          <div className="metric-card program-card">
            <div className="metric-header">
              <div className="metric-title">TRC Special Income</div>
              <i className="fas fa-star metric-icon-bg" />
            </div>
            <div className="metric-value">
              0 <span>USDT</span>
            </div>
          </div>
          <div className="metric-card program-card subsection-title-card">
            <div className="metric-title">🔹 X3 Income</div>
          </div>
          <div className="metric-card program-card">
            <div className="metric-header">
              <div className="metric-title">X3 Staking Income</div>
              <i className="fas fa-coins metric-icon-bg" />
            </div>
            <div className="metric-value">
              0 <span>USDT</span>
            </div>
          </div>
          <div className="metric-card program-card">
            <div className="metric-header">
              <div className="metric-title">X3 Direct Income</div>
              <i className="fas fa-user-check metric-icon-bg" />
            </div>
            <div className="metric-value">
              0 <span>USDT</span>
            </div>
          </div>
          <div className="metric-card program-card">
            <div className="metric-header">
              <div className="metric-title">X3 Hybrid Level Income</div>
              <i className="fas fa-project-diagram metric-icon-bg" />
            </div>
            <div className="metric-value">
              0 <span>USDT</span>
            </div>
          </div>
          <div className="metric-card program-card subsection-title-card">
            <div className="metric-title">🔹 Royalty</div>
          </div>
          <div className="metric-card program-card">
            <div className="metric-header">
              <div className="metric-title">Royalty Income</div>
              <i className="fas fa-crown metric-icon-bg" />
            </div>
            <div className="metric-value">
              0 <span>USDT</span>
            </div>
          </div>
        </div>
        <div className="x2-section-container">
          <h2 className="x2-section-title">The Rich Crowd X2</h2>
          <div className="x2-grid">
            <div className="x2-card status-next">
              <span className="x2-bg-number">1</span>
              <span className="x2-level-badge">Slot 1</span>
              <div className="x2-price">$35</div>
              <div className="x2-label">Upgrade Now</div>
              <button className="x2-btn" onClick={undefined}>
                Activate{" "}
              </button>
            </div>
            <div className="x2-card status-locked">
              <span className="x2-bg-number">2</span>
              <span className="x2-level-badge">Slot 2</span>
              <div className="x2-price">$40</div>
              <div className="x2-label">Locked</div>
              <button className="x2-btn" disabled>
                <i className="fas fa-lock" /> Locked{" "}
              </button>
            </div>
            <div className="x2-card status-locked">
              <span className="x2-bg-number">3</span>
              <span className="x2-level-badge">Slot 3</span>
              <div className="x2-price">$70</div>
              <div className="x2-label">Locked</div>
              <button className="x2-btn" disabled>
                <i className="fas fa-lock" /> Locked{" "}
              </button>
            </div>
            <div className="x2-card status-locked">
              <span className="x2-bg-number">4</span>
              <span className="x2-level-badge">Slot 4</span>
              <div className="x2-price">$225</div>
              <div className="x2-label">Locked</div>
              <button className="x2-btn" disabled>
                <i className="fas fa-lock" /> Locked{" "}
              </button>
            </div>
            <div className="x2-card status-locked">
              <span className="x2-bg-number">5</span>
              <span className="x2-level-badge">Slot 5</span>
              <div className="x2-price">$675</div>
              <div className="x2-label">Locked</div>
              <button className="x2-btn" disabled>
                <i className="fas fa-lock" /> Locked{" "}
              </button>
            </div>
            <div className="x2-card status-locked">
              <span className="x2-bg-number">6</span>
              <span className="x2-level-badge">Slot 6</span>
              <div className="x2-price">$1,250</div>
              <div className="x2-label">Locked</div>
              <button className="x2-btn" disabled>
                <i className="fas fa-lock" /> Locked{" "}
              </button>
            </div>
            <div className="x2-card status-locked">
              <span className="x2-bg-number">7</span>
              <span className="x2-level-badge">Slot 7</span>
              <div className="x2-price">$2,000</div>
              <div className="x2-label">Locked</div>
              <button className="x2-btn" disabled>
                <i className="fas fa-lock" /> Locked{" "}
              </button>
            </div>
            <div className="x2-card status-locked">
              <span className="x2-bg-number">8</span>
              <span className="x2-level-badge">Slot 8</span>
              <div className="x2-price">$5,000</div>
              <div className="x2-label">Locked</div>
              <button className="x2-btn" disabled>
                <i className="fas fa-lock" /> Locked{" "}
              </button>
            </div>
            <div className="x2-card status-locked">
              <span className="x2-bg-number">9</span>
              <span className="x2-level-badge">Slot 9</span>
              <div className="x2-price">$8,000</div>
              <div className="x2-label">Locked</div>
              <button className="x2-btn" disabled>
                <i className="fas fa-lock" /> Locked{" "}
              </button>
            </div>
            <div className="x2-card status-locked">
              <span className="x2-bg-number">10</span>
              <span className="x2-level-badge">Slot 10</span>
              <div className="x2-price">$12,000</div>
              <div className="x2-label">Locked</div>
              <button className="x2-btn" disabled>
                <i className="fas fa-lock" /> Locked{" "}
              </button>
            </div>
          </div>
        </div>
        <div className="x3-promo-container">
          <div className="x3-promo-card">
            <div className="x3-top-row">
              <div className="x3-text-content">
                <h2>The Rich Crowd x3</h2>
                <p>The Rich Crowd are wealthy trendsetters.</p>
              </div>
              <div className="x3-actions">
                <Link
                  to="/x3-staking"
                  style={{ textDecoration: "none" }}
                >
                  <button className="x3-action-btn">Proceed with x3</button>
                </Link>
                <Link to="/auto-compounding">
                <button
                  className="x3-action-btn"
                  >
                  Proceed with Auto Compounding
                </button>
                  </Link>
              </div>
            </div>
            <div className="x3-stats-bar">
              <div className="x3-stat-item">
                <span className="x3-stat-label">Total Staked</span>
                <span className="x3-stat-value">0.00</span>
              </div>
              <div className="x3-stat-item">
                <span className="x3-stat-label">Total Compound</span>
                <span className="x3-stat-value">0.00</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default Dashboard;
