import { type FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import "animate.css";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { Logo } from "../../assets/Images/image";
import Cookies from "js-cookie";
import { useAuth } from "../../features/auth/hooks/useAuth";
import { useDashboardData } from "../../features/dashboard/hooks/useDashboardData";
import { useCopyToClipboard } from "../../hooks/useCopyToClipboard";
import { shortenAddress } from "../../utils";
import MultiColorProgress from "src/Components/AdminComponent/MultiColorProgress";
import { useTokenPrice } from "src/hooks/useTokenPrice";
import { getTokenCirculatingSupply } from "src/utils/web3";
import { userKey } from "src/utils/constants";

interface TokenSupplySnapshot {
  totalSupply: string;
  burned: string;
  circulating: string;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const { authenticatePreview, isAuthenticating } = useAuth();
  const {
    dashboardResponse,
    userPackages,
    isDashboardLoading,
    dashboardError,
  } = useDashboardData();
  const { copyText } = useCopyToClipboard();
  const [previewId, setPreviewId] = useState("");
  const [tokenSupply, setTokenSupply] = useState<TokenSupplySnapshot | null>(null);
  const { tokenPrice } = useTokenPrice(0.02004);
  const user = dashboardResponse?.data?.user;
  const dashboardSummary = dashboardResponse?.data?.dashboard_summary;
  const totalUsers = dashboardResponse?.data?.total_users;
  // const x3Summary = dashboardResponse?.data?.x3_summary;
  const walletAddress = user?.wallet_address ?? "0x81f7...77C7";

  const formatAmount = (value?: number) => Number(value ?? 0).toFixed(2);
  const formatTokenUnits = (rawValue?: string, fractionDigits = 2) => {
    if (!rawValue) return "--";
    try {
      const decimals = 18n;
      const base = 10n ** decimals;
      const amount = BigInt(rawValue);
      const whole = amount / base;
      const fraction = amount % base;
      const fractionText = fraction
        .toString()
        .padStart(Number(decimals), "0")
        .slice(0, fractionDigits);
      return `${whole.toLocaleString()}${fractionDigits ? `.${fractionText}` : ""}`;
    } catch (_error) {
      return "--";
    }
  };

  useEffect(() => {
    let isMounted = true;

    const loadTokenSupply = async () => {
      try {
        const snapshot = await getTokenCirculatingSupply();
        if (!isMounted) return;
        setTokenSupply(snapshot);
      } catch (_error) {
        if (!isMounted) return;
        setTokenSupply(null);
      }
    };

    void loadTokenSupply();
    return () => {
      isMounted = false;
    };
  }, []);

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

  const totalIncome = (dashboardSummary?.total_income ?? 0) + (dashboardSummary?.total_income_x3 ?? 0);

  const handleProtectedNavigation = (path: string, allowInPreview = false) => {
    const profileRaw = Cookies.get(userKey);
    if (profileRaw) {
      try {
        const profile = JSON.parse(profileRaw) as { previewUserId?: string };
        if (profile?.previewUserId && !allowInPreview) {
          toast.error("This feature is not available in preview mode.");
          return;
        }
      } catch (_error) {
        // Ignore invalid cookie and allow normal navigation.
      }
    }
    navigate(path);
  };

  const rank = Number(user?.rank ?? 0);
  const royaltyUsersCount = Number(user?.royalty_users_count ?? 0);
  const normalizedRoyaltyUsersCount = Math.max(0, Math.min(royaltyUsersCount, 8));

  const rankTitles = ["1 Star", "2 Star"];
  const poolTitles = [
    "First Pool",
    "Second Pool",
    "Third Pool",
    "Silver Star",
    "Gold Star",
    "Platinum Star",
    "Emerald Star",
    "Diamond Star",
  ];
  const rankStars = rankTitles.map((title, index) => {
    const isActive = index < rank;
    return (
      <span className="star-with-tooltip" data-tooltip={title} key={`rank-${index}`}>
        <i
          className={`fas fa-star ${isActive ? "active" : ""}`}
          aria-label={title}
        />
      </span>
    );
  });

  const poolStars = poolTitles.map((title, index) => {
    const isActive = index < normalizedRoyaltyUsersCount;
    return (
      <span className="star-with-tooltip" data-tooltip={title} key={`pool-${index}`}>
        <i
          className={`fas fa-star ${isActive ? "active" : ""}`}
          aria-label={title}
        />
      </span>
    );
  });
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
            <div className="profile-main">
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
                  <div className="rank-header-row">
                    <span className="rank-label">Rank Progress</span>
                    <span className="rank-badge">Rank {rank}</span>
                  </div>
                  <div className="rank-progress-meta">
                    <span>Stars: {rank}/2</span>
                    <span>Pools: {normalizedRoyaltyUsersCount}/8</span>
                  </div>
                  <div className="rank-stars-row">
                    <span className="rank-row-label">Stars</span>
                    <div className="stars rank-stars">{rankStars}</div>
                  </div>
                  <div className="rank-stars-row">
                    <span className="rank-row-label">Pools</span>
                    <div className="stars pool-stars">{poolStars}</div>
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
          </div>
          <div className="hero-card ksn-card ksn-card-full">
            <div className="ksn-info">
              <h4>KSN/USDT</h4>
              <div className="ksn-pill" id="ksnPriceDisplay">
                {tokenPrice.toFixed(5)} USDT
              </div>
              <div className="ksn-details">
                <div className="ksn-detail-row">
                  <span>Total Max Supply</span>
                  <strong>{formatTokenUnits(tokenSupply?.totalSupply)} KSN</strong>
                </div>
                <div className="ksn-detail-row">
                  <span>Real time Burned</span>
                  <strong>{formatTokenUnits(tokenSupply?.burned)} KSN</strong>
                </div>
                <div className="ksn-detail-row">
                  <span>Real time Circulating Supply</span>
                  <strong>{formatTokenUnits(tokenSupply?.circulating)} KSN</strong>
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
              ${formatAmount(totalIncome)}

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
                <button
                  className="x3-action-btn x3-action-btn-staking"
                  type="button"
                  onClick={() => handleProtectedNavigation("/x3-staking", true)}
                >
                  Start X3 Staking <i className="fas fa-arrow-right" />
                </button>
                <button
                  className="x3-action-btn x3-action-btn-compounding"
                  type="button"
                  onClick={() => handleProtectedNavigation("/auto-compounding", true)}
                >
                  Start Auto Compounding <i className="fas fa-arrow-right" />
                </button>
              </div>
            </div>
            <div className="x3-stats-bar">
              <div className="x3-stat-item">
                <span className="x3-stat-label">Total X3 Staked</span>
                <span className="x3-stat-value">
                  ${formatAmount(dashboardSummary?.totalStaked)}
                </span>
              </div>
              <div className="x3-stat-item">
                <span className="x3-stat-label">Total X3 Auto Compounded</span>
                <span className="x3-stat-value">
                  ${formatAmount(dashboardSummary?.totalCompound)}
                </span>
              </div>
              <div className="x3-stat-item">
                <span className="x3-stat-label">Total Combined Staked</span>
                <span className="x3-stat-value">
                  ${formatAmount(Number(dashboardSummary?.totalStaked ?? 0) + Number(dashboardSummary?.totalCompound ?? 0))}
                </span>
              </div>
            </div>
            <div className="x3-stats-bar x3-stats-bar-progress">
              <div className="x3-stat-item">
                <span className="x3-stat-label">3X Max</span>
                <span className="x3-stat-value">
                  ${formatAmount(user?.incomeLimit2)}
                </span>
              </div>
              <div className="x3-stat-item">
                <span className="x3-stat-label">3X Used Limit</span>
                <span className="x3-stat-value">
                  ${formatAmount(user?.incomeLimit)}
                </span>
              </div>
              <div className="progress-bar-dashboard">
                <MultiColorProgress progress={{ totalLimit: Number(user?.incomeLimit2), usedLimit: Number(user?.incomeLimit) }} />
              </div>
            </div>
          </div>
        </div>
        <div className="active-user">
          <div className="grid-section-title">
            <i className="fa-solid fa-chart-line"></i> Platform activity
          </div>
          <div className="metric-card">
            <div className="metric-title">Total Members</div>
            <div className="metric-value">{(totalUsers ?? 0) + 50}</div>
          </div>
        </div>
      </div>
  );
};
export default Dashboard;
