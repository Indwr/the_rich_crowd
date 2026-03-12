import { useDashboardData } from "src/features/dashboard/hooks/useDashboardData";

const DashboardSummaryBoxes = () => {
  const { dashboardResponse } = useDashboardData();
  const dashboardSummary = dashboardResponse?.data?.dashboard_summary;
  const x3Summary = dashboardResponse?.data?.x3_summary;
  const formatAmount = (value?: number) => Number(value ?? 0).toFixed(2);
  const totalBusiness =
    (dashboardSummary?.left_business ?? 0) +
    (dashboardSummary?.right_business ?? 0);
  const totalx2Team =
    (dashboardSummary?.left_team ?? 0) + (dashboardSummary?.right_team ?? 0);
  const x3StakingBusiness =
    (x3Summary?.x3_left_business ?? 0) + (x3Summary?.x3_right_business ?? 0);
  const x3CompoundingBusiness =
    (x3Summary?.x3_compound_left_business ?? 0) +
    (x3Summary?.x3_compound_right_business ?? 0);
  const x3CommonBusiness = Math.min(
    x3Summary?.x3_left_business ?? 0,
    x3Summary?.x3_right_business ?? 0,
  );
  return (
    <div className="content-wrapper">
      <div className="tree-page-header">
        <h1 className="tree-title">
          <i className="fas fa-network-wired" /> Dashboard Summary
        </h1>
        <div className="metric-grid animate__animated animate__fadeInUp">
          <div className="grid-section-title">
            <i className="fas fa-briefcase" /> X2 Business Overview
          </div>
          <div className="metric-card">
            <div className="metric-header">
              <div className="metric-title">X2 Team Business</div>
              <i className="fas fa-hand-holding-usd metric-icon-bg" />
            </div>
            <div className="metric-value">
              ${formatAmount(totalBusiness) ?? 0}
            </div>
          </div>
          <div className="metric-card">
            <div className="metric-header">
              <div className="metric-title">X2 L/R Business</div>
              <i className="fas fa-balance-scale metric-icon-bg" />
            </div>
            <div className="split-container">
              <div className="split-item">
                <div className="split-value">
                ${formatAmount(dashboardSummary?.left_business) ?? 0} 
                </div>
                <span className="split-label">Left</span>
              </div>
              <div className="split-divider" />
              <div className="split-item right">
                <div className="split-value">
                ${formatAmount(dashboardSummary?.right_business) ?? 0}
                </div>
                <span className="split-label">Right</span>
              </div>
            </div>
          </div>
          <div className="metric-card">
            <div className="metric-header">
              <div className="metric-title">X2 Total Team</div>
              <i className="fas fa-user-friends metric-icon-bg" />
            </div>
            <div className="metric-value">{totalx2Team}</div>
          </div>
          <div className="metric-card">
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
                <div className="split-value">
                  {dashboardSummary?.right_team}
                </div>
                <span className="split-label">Right Team</span>
              </div>
            </div>
          </div>
          <div className="grid-section-title">
            <i className="fas fa-coins" /> X3 Staking Business
          </div>
          <div className="metric-card">
            <div className="metric-header">
              <div className="metric-title">X3 Staking Direct Business</div>
              <i className="fa-solid fa-diamond-turn-right metric-icon-bg"></i>
            </div>
            <div className="metric-value">
              ${formatAmount(x3StakingBusiness)}
            </div>
          </div>
          <div className="metric-card">
            <div className="metric-header">
              <div className="metric-title">X3 Staking Biz</div>
              <i className="fas fa-layer-group metric-icon-bg" />
            </div>
            <div className="metric-value">
              ${formatAmount(x3StakingBusiness)}
            </div>
          </div>
          <div className="metric-card">
            <div className="metric-header">
              <div className="metric-title">X3 L/R Business</div>
              <i className="fas fa-columns metric-icon-bg" />
            </div>
            <div className="split-container">
              <div className="split-item">
                <div className="split-value">
                  {formatAmount(x3Summary?.x3_left_business)}
                </div>
                <span className="split-label">Left</span>
              </div>
              <div className="split-divider" />
              <div className="split-item right">
                <div className="split-value">
                  {formatAmount(x3Summary?.x3_right_business)}
                </div>
                <span className="split-label">Right</span>
              </div>
            </div>
          </div>
          <div className="grid-section-title">
            <i className="fas fa-sync" /> X3 Compounding Business
          </div>

          <div className="metric-card">
            <div className="metric-header">
              <div className="metric-title">X3 Compounding Direct Business</div>
              <i className="fa-solid fa-diamond-turn-right metric-icon-bg"></i>
            </div>
            <div className="metric-value">
              ${formatAmount(x3CompoundingBusiness)}
            </div>
          </div>
          <div className="metric-card">
            <div className="metric-header">
              <div className="metric-title">X3 Compounding</div>
              <i className="fas fa-recycle metric-icon-bg" />
            </div>
            <div className="metric-value">
              ${formatAmount(x3CompoundingBusiness)}
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-header">
              <div className="metric-title">X3 Compounding L/R</div>
              <i className="fas fa-random metric-icon-bg" />
            </div>
            <div className="split-container">
              <div className="split-item">
                <div className="split-value">
                  {formatAmount(x3Summary?.x3_compound_left_business)}
                </div>
                <span className="split-label">Left</span>
              </div>
              <div className="split-divider" />
              <div className="split-item right">
                <div className="split-value">
                  {formatAmount(x3Summary?.x3_compound_right_business)}
                </div>
                <span className="split-label">Right</span>
              </div>
            </div>
          </div>
          <div className="grid-section-title">
            <i className="fas fa-sync" /> X3 Combined Business
          </div>
          <div className="metric-card">
            <div className="metric-header">
              <div className="metric-title">X3 Total Direct Business</div>
              <i className="fa-solid fa-diamond-turn-right metric-icon-bg"></i>
            </div>
            <div className="metric-value">
             ${formatAmount(x3CommonBusiness)}
            </div>
          </div>
          <div className="metric-card">
            <div className="metric-header">
              <div className="metric-title">X3 Total Business</div>
              <i className="fas fa-globe metric-icon-bg" />
            </div>
            <div className="metric-value">
              ${formatAmount(x3CommonBusiness)}
            </div>
          </div>
          <div className="metric-card">
            <div className="metric-header">
              <div className="metric-title">X3 Total L/R</div>
              <i className="fas fa-random metric-icon-bg" />
            </div>
            <div className="split-container">
              <div className="split-item">
                <div className="split-value">
                  {formatAmount(x3Summary?.x3_compound_left_business)}
                </div>
                <span className="split-label">Left</span>
              </div>
              <div className="split-divider" />
              <div className="split-item right">
                <div className="split-value">
                  {formatAmount(x3Summary?.x3_compound_right_business)}
                </div>
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
            <div className="metric-title">🔹 X2 Income </div>
          </div>
          <div className="metric-card program-card">
            <div className="metric-header">
              <div className="metric-title">X2 Direct Income (15%)</div>
              <i className="fas fa-hand-holding-usd metric-icon-bg" />
            </div>
            <div className="metric-value">
              ${formatAmount(dashboardSummary?.direct_referral)}{" "}
            </div>
          </div>
          <div className="metric-card program-card">
            <div className="metric-header">
              <div className="metric-title">X2 Hybrid Level Income (20%)</div>
              <i className="fas fa-layer-group metric-icon-bg" />
            </div>
            <div className="metric-value">
              ${formatAmount(dashboardSummary?.hybrid_turbo_bonus)}{" "}
            </div>
          </div>
          <div className="metric-card program-card subsection-title-card">
            <div className="metric-title">🔹 TRC Income</div>
          </div>
          <div className="metric-card program-card">
            <div className="metric-header">
              <div className="metric-title">TRC Special Income (40%)</div>
              <i className="fas fa-star metric-icon-bg" />
            </div>
            <div className="metric-value">
              ${formatAmount(dashboardSummary?.trc_special)}
            </div>
          </div>
          <div className="metric-card program-card">
            <div className="metric-header">
              <div className="metric-title">Royalty Income (10%)</div>
              <i className="fas fa-crown metric-icon-bg" />
            </div>
            <div className="metric-value">
              ${formatAmount(dashboardSummary?.royalty)}
            </div>
          </div>
          <div className="metric-card program-card">
            <div className="metric-header">
              <div className="metric-title">TRC Trainer Income (5%)</div>
              <i className="fa-solid fa-person-chalkboard metric-icon-bg" />
            </div>
            <div className="metric-value">
              ${formatAmount(dashboardSummary?.royalty)}
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
              ${formatAmount(dashboardSummary?.staking_income)}
            </div>
          </div>
          <div className="metric-card program-card">
            <div className="metric-header">
              <div className="metric-title">X3 Direct Income</div>
              <i className="fas fa-user-check metric-icon-bg" />
            </div>
            <div className="metric-value">
              ${formatAmount(dashboardSummary?.direct_referralX3)}{" "}
              
            </div>
          </div>
          <div className="metric-card program-card">
            <div className="metric-header">
              <div className="metric-title">X3 Hybrid Level Income</div>
              <i className="fas fa-project-diagram metric-icon-bg" />
            </div>
            <div className="metric-value">
              ${formatAmount(dashboardSummary?.level_incomeX3)}
            </div>
          </div>
          {/* <div className="metric-card program-card subsection-title-card">
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
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default DashboardSummaryBoxes;
