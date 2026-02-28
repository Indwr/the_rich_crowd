const X3Staking = () => {
  return (
    <>
      <div className="content-wrapper">
        <div className="page-header">
          <h1 className="page-title">X3 Staking Pool</h1>
          <div className="page-desc">
            Maximize your earnings with secure staking
          </div>
        </div>
        <div className="staking-card">
          <div className="level-badge-container">
            <span className="lb-label">Current X2 Slot</span>
            <span className="lb-value">Slot 0</span>
          </div>
          <div className="locked-overlay">
            <i className="fas fa-lock fa-lg" />
            <span>
              Not Eligible. Minimum <b>35 X2 Upgrades</b> required to unlock.
            </span>
          </div>
          <div className="limit-section">
            <div className="limit-info">
              <span className="limit-label">Staking Limit Used</span>
              <span className="limit-vals">
                <span>$0</span> / $0{" "}
              </span>
            </div>
            <div className="progress-track">
              <div className="progress-fill" style={{ width: "0%" }} />
            </div>
          </div>
          <div className="stats-row">
            <div className="stat-pill">
              <span className="sp-label">Remaining Limit</span>
              <span className="sp-value sp-highlight">$0</span>
            </div>
            <div className="stat-pill">
              <span className="sp-label">Min Stake</span>
              <span className="sp-value">$100</span>
            </div>
            <div className="stat-pill">
              <span className="sp-label">Est. Monthly</span>
              <span className="sp-value sp-highlight">5%</span>
            </div>
          </div>
          <div className="input-group">
            <div className="wallet-info">
              <span className="wi-label">Amount to Stake</span>
              <span className="wi-bal">Balance: $0.00</span>
            </div>
            <input
              type="number"
              id="stakeAmount"
              className="custom-input"
              placeholder={"0.0"}
              disabled
            />
            <div className="input-actions">
              <span className="currency-badge">USDT</span>
              <button className="btn-max" onClick={undefined}>
                MAX
              </button>
            </div>
          </div>
          <button
            className="btn-submit"
            id="btnConfirm"
            onClick={undefined}
            disabled
          >
            Locked{" "}
          </button>
          <div className="status-alert" id="statusMsg" />
        </div>
      </div>
    </>
  );
};
export default X3Staking;
