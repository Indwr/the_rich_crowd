import { type FormEvent, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import "animate.css";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { Logo } from "../../assets/Images/image";
import { useAuth } from "../../features/auth/hooks/useAuth";
import { useDashboardData } from "../../features/dashboard/hooks/useDashboardData";
import { useCopyToClipboard } from "../../hooks/useCopyToClipboard";
import { shortenAddress } from "../../utils";
import MultiColorProgress from "src/Components/AdminComponent/MultiColorProgress";

const Dashboard = () => {
  // const navigate = useNavigate();
  const { authenticatePreview, isAuthenticating } = useAuth();
  const {
    dashboardResponse,
    userPackages,
    isDashboardLoading,
    dashboardError,
  } = useDashboardData();
  const { copyText } = useCopyToClipboard();
  const [previewId, setPreviewId] = useState("");
  const user = dashboardResponse?.data?.user;
  const dashboardSummary = dashboardResponse?.data?.dashboard_summary;
  // const x3Summary = dashboardResponse?.data?.x3_summary;
  const walletAddress = user?.wallet_address ?? "0x81f7...77C7";

  const formatAmount = (value?: number) => Number(value ?? 0).toFixed(2);

  const handlePreviewLogin = async (event: FormEvent) => {
    event.preventDefault();
    const userId = previewId.trim();
    if (!userId) return;

    try {
      await authenticatePreview(userId);
      toast.success("Preview mode enabled.");
      window.location.reload();
    } catch (error: any) {
      toast.error(error?.message ?? "Failed to start preview mode.");
    }
  };

  const referralLink = `${import.meta.env.VITE_SITE_URL}register?ref=${user?.user_id ?? ""}`;
  // const totalBusiness =
  // (dashboardSummary?.left_business ?? 0) +
  // (dashboardSummary?.right_business ?? 0);
  // const totalx2Team =
  // (dashboardSummary?.left_team ?? 0) +
  // (dashboardSummary?.right_team ?? 0);
  // const x3StakingBusiness =
  // (x3Summary?.x3_left_business ?? 0) +
  // (x3Summary?.x3_right_business ?? 0);
  // const x3CompoundingBusiness =
  // (x3Summary?.x3_compound_left_business ?? 0) +
  // (x3Summary?.x3_compound_right_business ?? 0);
  // const x3CommonBusiness = Math.min(
  //   x3Summary?.x3_left_business ?? 0,
  //   x3Summary?.x3_right_business ?? 0,
  // );
  const showSkeleton = isDashboardLoading && !dashboardResponse;

  const getSlotCardClass = (status: number) => {
    if (status === 1) return "status-active";
    if (status === 2) return "status-next";
    return "status-locked";
  };

  const getSlotButton = (status: number) => {
    if (status === 1) return "Activated";
    if (status === 2) return "Activate";
    return "Locked";
  };
  const getGreeting = () => {
    const hour = new Date().getHours();

    if (hour < 12) {
      return "Good Morning";
    } else if (hour < 17) {
      return "Good Afternoon";
    } else {
      return "Good Evening";
    }
  };

  if (showSkeleton) {
    return (
      <SkeletonTheme
        baseColor="#1f2937"
        highlightColor="#374151"
        borderRadius={12}
      >
        <div className="dashboard-container animate__animated animate__fadeIn">
          <div className="user-container animate__animated animate__fadeInDown">
            <div className="user-greeting">
              <Skeleton width={220} height={18} />
            </div>
          </div>

          <div className="profile-hero-section animate__animated animate__fadeInUp">
            <div className="hero-card user-info">
              <Skeleton height={180} borderRadius={16} />
            </div>
            <div className="right-column">
              <div className="hero-card links-info">
                <Skeleton height={120} borderRadius={16} />
              </div>
              <div className="hero-card ksn-card">
                <Skeleton height={70} borderRadius={16} />
              </div>
            </div>
          </div>

          <div className="metric-grid animate__animated animate__fadeInUp">
            {Array.from({ length: 12 }).map((_, index) => (
              <div key={`metric-skeleton-${index}`} className="metric-card">
                <Skeleton height={90} borderRadius={12} />
              </div>
            ))}
          </div>

          <div className="x2-section-container animate__animated animate__fadeInUp">
            <h2 className="x2-section-title">The Rich Crowd X2</h2>
            <div className="x2-grid">
              {Array.from({ length: 10 }).map((_, index) => (
                <div
                  key={`slot-skeleton-${index}`}
                  className="x2-card status-locked"
                >
                  <Skeleton height={180} borderRadius={16} />
                </div>
              ))}
            </div>
          </div>

          <div className="x3-promo-container animate__animated animate__fadeInUp">
            <div className="x3-promo-card">
              <Skeleton height={120} borderRadius={16} />
            </div>
          </div>
        </div>
      </SkeletonTheme>
    );
  }

  return (
    <>
      <div className="dashboard-container animate__animated animate__fadeIn">
        <div className="user-container animate__animated animate__fadeInDown">
          <div className="user-greeting">
            <p id="greetingMessage">
              {getGreeting()}, {user?.first_name ?? "--"}
            </p>
            {isDashboardLoading && <small>Loading dashboard data...</small>}
            {dashboardError && <small>{dashboardError}</small>}
          </div>
        </div>
        <div className="profile-hero-section animate__animated animate__fadeInUp">
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
                  User ID <span>{user?.user_id ?? "--"}</span>
                </h3>
                <p>
                  Sponsor ID <span>{user?.sponser_id ?? "--"}</span>
                </p>
                    <p>
                      Tree Sponsor ID <span>{user?.parent_id ?? "--"}</span>
                    </p>
                    <p>
                      Trainer ID <span>{user?.trainer_id ?? "--"}</span>
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
            <div className="wallet-pill">
              <span id="walletAddressDisplay">
                {shortenAddress(walletAddress)}
              </span>
              <i
                className="fas fa-copy"
                onClick={() =>
                  copyText(walletAddress, {
                    successMessage: "Wallet address copied.",
                  })
                }
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
                    value={referralLink}
                    readOnly
                    id="refLinkInput"
                  />
                  <i
                    className="fas fa-copy"
                    onClick={() =>
                      copyText(referralLink, {
                        successMessage: "Referral link copied.",
                      })
                    }
                  />
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
                  onChange={event => setPreviewId(event.target.value)}
                />
                <button
                  type="submit"
                  className="go-btn"
                  disabled={isAuthenticating}
                >
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
        <div className="metric-grid animate__animated animate__fadeInUp">
          <div className="grid-section-title">
            <i className="fas fa-wallet" /> Wallet
          </div>
          <div className="metric-card">
            <div className="metric-header">
              <div className="metric-title">Wallets</div>
              <i className="fas fa-exchange-alt metric-icon-bg" />
            </div>
            <div className="split-container">
              <div className="split-item">
                <div className="split-value">
                  ${formatAmount(dashboardSummary?.holdingWallet)}
                </div>
                <span className="split-label">X2 Auto Upgrade</span>
              </div>
              <div className="split-divider" />
              <div className="split-item right">
                <div className="split-value">
                  ${formatAmount(dashboardSummary?.holdingWalletx3)}
                </div>
                <span className="split-label">X3 Wallet</span>
              </div>
            </div>
          </div>
          <div className="metric-card metric-card2 metric-card-earning">
            <div className="grid-section-title">
              <i className="fas fa-wallet" /> Earnings
            </div>
            <div className="metric-header">
              <div className="metric-title">Profits</div>
              <i className="fas fa-chart-line metric-icon-bg" />
            </div>
            <div className="metric-value">
              ${formatAmount(dashboardSummary?.total_income) +
                formatAmount(dashboardSummary?.total_income_x3)}{" "}
            
            </div>
          </div>
          <div className="metric-card metric-card2 metric-card-partner">
            <div className="grid-section-title">
              <i className="fa-solid fa-users"></i> Partners
            </div>
            <div className="metric-header">
              <div className="metric-title">Directs</div>
              <i className="fas fa-users metric-icon-bg" />
            </div>
            <div className="metric-value">{user?.directs ?? 0}</div>
          </div>
          {/* <div className="grid-section-title">
            <i className="fas fa-briefcase" /> X2 Business Overview
          </div>
          <div className="metric-card">
            <div className="metric-header">
              <div className="metric-title">X2 Team Business</div>
              <i className="fas fa-hand-holding-usd metric-icon-bg" />
            </div>
            <div className="metric-value">
              {formatAmount(totalBusiness)} <span>USDT</span>
            </div>
          </div>
          <div className="metric-card">
            <div className="metric-header">
              <div className="metric-title">X2 L/R Business</div>
              <i className="fas fa-balance-scale metric-icon-bg" />
            </div>
            <div className="split-container">
              <div className="split-item">
                <div className="split-value">{formatAmount(dashboardSummary?.left_business)}</div>
                <span className="split-label">Left (USDT)</span>
              </div>
              <div className="split-divider" />
              <div className="split-item right">
                <div className="split-value">{formatAmount(dashboardSummary?.right_business)}</div>
                <span className="split-label">Right (USDT)</span>
              </div>
            </div>
          </div>
          <div className="metric-card">
            <div className="metric-header">
              <div className="metric-title">X2 Total Team</div>
              <i className="fas fa-user-friends metric-icon-bg" />
            </div>
            <div className="metric-value">{totalx2Team}</div>
          </div> */}
          {/* <div className="metric-card">
            <div className="metric-header">
              <div className="metric-title">X2 L/R Team</div>
              <i className="fas fa-network-wired metric-icon-bg" />
            </div>
            <div className="split-container">
              <div className="split-item">
                <div className="split-value">{dashboardSummary?.left_team}</div>
                <span className="split-label">Left Team</span>
              </div>
              <div className="split-divider" />
              <div className="split-item right">
                <div className="split-value">{dashboardSummary?.right_team}</div>
                <span className="split-label">Right Team</span>
              </div>
            </div>
          </div> */}

          {/* <div className="grid-section-title">
            <i className="fas fa-coins" /> X3 Staking Business
          </div>
          <div className="metric-card">
            <div className="metric-header">
              <div className="metric-title">X3 Staking Biz</div>
              <i className="fas fa-layer-group metric-icon-bg" />
            </div>
            <div className="metric-value">
              {formatAmount(x3StakingBusiness)} <span>USDT</span>
            </div>
          </div>
          <div className="metric-card">
            <div className="metric-header">
              <div className="metric-title">X3 L/R Business</div>
              <i className="fas fa-columns metric-icon-bg" />
            </div>
            <div className="split-container">
              <div className="split-item">
                <div className="split-value">{formatAmount(x3Summary?.x3_left_business)}</div>
                <span className="split-label">Left</span>
              </div>
              <div className="split-divider" />
              <div className="split-item right">
                <div className="split-value">{formatAmount(x3Summary?.x3_right_business)}</div>
                <span className="split-label">Right</span>
              </div>
            </div>
          </div> */}

          {/* <div className="grid-section-title">
            <i className="fas fa-sync" /> X3 Compounding Business
          </div>

          
          <div className="metric-card">
            <div className="metric-header">
              <div className="metric-title">X3 Compounding</div>
              <i className="fas fa-recycle metric-icon-bg" />
            </div>
            <div className="metric-value">
              {formatAmount(x3CompoundingBusiness)} <span>USDT</span>
            </div>
          </div>
          
          <div className="metric-card">
            <div className="metric-header">
              <div className="metric-title">X3 Compounding L/R</div>
              <i className="fas fa-random metric-icon-bg" />
            </div>
            <div className="split-container">
              <div className="split-item">
                <div className="split-value">{formatAmount(x3Summary?.x3_compound_left_business)}</div>
                <span className="split-label">Left</span>
              </div>
              <div className="split-divider" />
              <div className="split-item right">
                <div className="split-value">{formatAmount(x3Summary?.x3_compound_right_business)}</div>
                <span className="split-label">Right</span>
              </div>
            </div>
          </div>
          <div className="grid-section-title">
            <i className="fas fa-sync" /> X3 Combined Business
          </div>
          <div className="metric-card">
            <div className="metric-header">
              <div className="metric-title">X3 Total Business</div>
              <i className="fas fa-globe metric-icon-bg" />
            </div>
            <div className="metric-value">
              {formatAmount(x3CommonBusiness)} <span>USDT</span>
            </div>
          </div>
          <div className="metric-card">
            <div className="metric-header">
              <div className="metric-title">X3 Total L/R</div>
              <i className="fas fa-random metric-icon-bg" />
            </div>
            <div className="split-container">
              <div className="split-item">
                <div className="split-value">{formatAmount(x3Summary?.x3_compound_left_business)}</div>
                <span className="split-label">Left</span>
              </div>
              <div className="split-divider" />
              <div className="split-item right">
                <div className="split-value">{formatAmount(x3Summary?.x3_compound_right_business)}</div>
                <span className="split-label">Right</span>
              </div>
            </div>
          </div> */}
        </div>
        {/* <div className="program-section-header">
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
              {formatAmount(dashboardSummary?.direct_referral)} <span>USDT</span>
            </div>
          </div>
          <div className="metric-card program-card">
            <div className="metric-header">
              <div className="metric-title">X2 Hybrid Level Income</div>
              <i className="fas fa-layer-group metric-icon-bg" />
            </div>
            <div className="metric-value">
              {formatAmount(dashboardSummary?.hybrid_turbo_bonus)} <span>USDT</span>
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
              {formatAmount(dashboardSummary?.trc_special)} <span>USDT</span>
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
              {formatAmount(dashboardSummary?.staking_income)} <span>USDT</span>
            </div>
          </div>
          <div className="metric-card program-card">
            <div className="metric-header">
              <div className="metric-title">X3 Direct Income</div>
              <i className="fas fa-user-check metric-icon-bg" />
            </div>
            <div className="metric-value">
            {formatAmount(dashboardSummary?.direct_referralX3)} <span>USDT</span>
            </div>
          </div>
          <div className="metric-card program-card">
            <div className="metric-header">
              <div className="metric-title">X3 Hybrid Level Income</div>
              <i className="fas fa-project-diagram metric-icon-bg" />
            </div>
            <div className="metric-value">
              {formatAmount(dashboardSummary?.level_incomeX3)} <span>USDT</span>
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
              {formatAmount(dashboardSummary?.royalty)} <span>USDT</span>
            </div>
          </div>
        </div> */}
        <div className="x2-section-container animate__animated animate__fadeInUp">
          <h2 className="x2-section-title">X2 SLOTS</h2>
          <div className="x2-grid">
            {userPackages.map((slot, index) => (
              <div
                key={`${slot.plan}-${slot.price}-${index}`}
                className={`x2-card ${getSlotCardClass(slot.status)}`}
              >
                <span className="x2-bg-number">{index + 1}</span>
                <span className="x2-level-badge">Slot {index + 1}</span>
                <div className="x2-price">
                  ${Number(slot.price ?? 0).toLocaleString()}
                </div>
                {/* <div className="x2-label">{getSlotLabel(slot.status)}</div> */}
                <button className="x2-btn" disabled={slot.status !== 2}>
                  {slot.status === 0 && <i className="fas fa-lock" />}{" "}
                  {getSlotButton(slot.status)}
                </button>
              </div>
            ))}
          </div>
        </div>
        <div className="x3-promo-container animate__animated animate__fadeInUp">
          <div className="x3-promo-card">
            <div className="x3-top-row">
              <div className="x3-text-content">
                <h2>X3 STAKING</h2>
                <p>The Rich Crowd are wealthy trendsetters.</p>
              </div>
              <div className="x3-actions">
                <Link to="/x3-staking" style={{ textDecoration: "none" }}>
                  <button className="x3-action-btn">
                    Start X3 Staking <i className="fas fa-arrow-right" />
                  </button>
                </Link>
                <Link to="/auto-compounding">
                  <button className="x3-action-btn">
                    Start Auto Compounding <i className="fas fa-arrow-right" />
                  </button>
                </Link>
              </div>
            </div>
            <div className="x3-stats-bar">
              <div className="x3-stat-item">
                <span className="x3-stat-label">Total X3 Staked</span>
                <span className="x3-stat-value">
                  {formatAmount(dashboardSummary?.totalStaked)}
                </span>
              </div>
              <div className="x3-stat-item">
                <span className="x3-stat-label">Total X3 Auto Compounded</span>
                <span className="x3-stat-value">
                  {formatAmount(dashboardSummary?.totalCompound)}
                </span>
              </div>
              <div className="x3-stat-item">
                <span className="x3-stat-label">Total Combined Staked</span>
                <span className="x3-stat-value">
                  {formatAmount(dashboardSummary?.totalCompound)}
                </span>
              </div>
            </div>
            <div className="x3-stats-bar x3-stats-bar-progress">
              <div className="x3-stat-item">
                <span className="x3-stat-label">3X Max</span>
                <span className="x3-stat-value">
                  {formatAmount(dashboardSummary?.totalStaked)}%
                </span>
              </div>
              <div className="progress-bar-dashboard">
                <MultiColorProgress />
              </div>
            </div>
          </div>
        </div>
        <div className="active-user">
          <div className="grid-section-title">
            <i className="fa-solid fa-chart-line"></i> Platform recent activity
          </div>
          <div className="metric-card">
            <div className="metric-title">Members total</div>
            <div className="metric-value">25856</div>
          </div>
        </div>
      </div>
    </>
  );
};
export default Dashboard;
