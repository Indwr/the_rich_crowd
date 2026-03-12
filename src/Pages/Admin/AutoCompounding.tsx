import { useState } from "react";

const AutoCompounding = () => {
  const [amount, setAmount] = useState<number>();
  const [years, setYears] = useState<number>(0);
  const [showCalculator, setShowCalculator] = useState(false);
  const [totalAmount, setTotalAmount] = useState<number | null>(null);
  const [interest, setInterest] = useState<number | null>(null);
  const calculateInterest = () => {
    if (!years || !amount) return;

    const rate = amount <= 500 ? 0.05 : 0.06;
    const result = amount * rate * years;
    const total = amount + result;

    setInterest(result);
    setTotalAmount(total);
  };

  return (
    <>
      <div className="content-wrapper content-wrapper-auto-compound">
        <div className="page-header">
          <h1 className="page-title">Auto Compounding</h1>
          <div className="page-desc">
            Maximize wealth with long-term growth strategies
          </div>
          <div className="auto-compound-calculate-btn">
            <button
              className="btn-update header-btn"
              onClick={() => setShowCalculator(true)}
            >
              <i className="fa-solid fa-calculator"></i>
              Calculate intrest
            </button>
          </div>
        </div>
        <div className="compounding-card">
          <div className="level-badge-container">
            <span className="lb-label">Current X2 Slot</span>
            <span className="lb-value">Slot 0</span>
          </div>
          <div className="locked-overlay">
            <i className="fas fa-lock" />
            <span>
              Not Eligible. Minimum <b>1 X2 Upgrade</b> required to unlock.
            </span>
          </div>
          <div className="limit-section">
            <div className="limit-info">
              <span className="limit-label">Limit Used</span>
              <span className="limit-vals">
                <span>$0</span> / $0{" "}
              </span>
            </div>
            <div className="progress-track">
              <div className="progress-fill" style={{ width: "0%" }} />
            </div>
          </div>
          <div className="stats-container">
            <div className="stat-item">
              <span>Remaining Limit</span>
              <h3 className="highlight-gold">$0</h3>
            </div>
            <div className="stat-item" style={{ textAlign: "right" }}>
              <span>X3 Balance</span>
              <h3>$0.00</h3>
            </div>
          </div>
          <div className="plan-selector-title">Select Duration</div>
          <div className="plan-buttons">
            <div className="plan-btn active" onClick={undefined}>
              <span className="plan-year">3 Years</span>
              <span className="plan-min">Min: $100</span>
            </div>
            <div className="plan-btn" onClick={undefined}>
              <span className="plan-year">5 Years</span>
              <span className="plan-min">Min: $100</span>
            </div>
            <div className="plan-btn" onClick={undefined}>
              <span className="plan-year">10 Years</span>
              <span className="plan-min">Min: $100</span>
            </div>
          </div>
          <div className="input-group">
            <div className="wallet-info">
              <span className="wi-label">Amount to Compound</span>
              <span className="wi-bal" id="minStakeLabel">
                Min: $100
              </span>
            </div>
            <input
              type="number"
              id="compoundAmount"
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
          <div className="summary-box">
            <div>
              <span className="sb-label">Start Date:</span>
              <span className="sb-val">2026-02-28</span>
            </div>
            <div>
              <span className="sb-label">End Date:</span>
              <span className="sb-val" id="endDateDisplay">
                2029-02-28
              </span>
            </div>
          </div>
          <button
            className="btn-submit"
            id="btnConfirm"
            onClick={undefined}
            disabled
          >
            Upgrade X2 to Unlock{" "}
          </button>
          <div className="status-msg" id="statusMsg" />
        </div>
        {showCalculator && (
          <div className="calculator-outer">
            <div className="calculator-inner hero-card links-info link-section">
              <button
                className="close-popup"
                onClick={() => setShowCalculator(false)}
              >
                <i className="fa-solid fa-circle-xmark"></i>
              </button>
              <h2>Interest Calculator</h2>

              {/* Amount Input */}
              <div className="input-group">
                <label>Amount:</label>
                <input
                  type="number"
                  value={amount}
                  onChange={e => setAmount(Number(e.target.value))}
                />
              </div>

              {/* Year Buttons */}
              <div className="calculator-outer-btn plan-buttons">
                <button
                  className={`plan-btn ${years === 3 ? "active" : ""}`}
                  onClick={() => setYears(3)}
                >
                  <span className="plan-year">3 Years</span>
                </button>

                <button
                  className={`plan-btn ${years === 5 ? "active" : ""}`}
                  onClick={() => setYears(5)}
                >
                  <span className="plan-year">5 Years</span>
                </button>

                <button
                  className={`plan-btn ${years === 10 ? "active" : ""}`}
                  onClick={() => setYears(10)}
                >
                  <span className="plan-year">10 Years</span>
                </button>
              </div>

              {/* Calculate Button */}
              <div className="calculator-btn-box">
                <button
                  className="btn-update header-btn"
                  onClick={calculateInterest}
                >
                  <i className="fa-solid fa-calculator"></i>
                  Calculate
                </button>
              </div>

              {/* Result */}
              {interest !== null && (
                <div style={{ marginTop: "50px" }}>
                  <h3><small>Interest Amount: </small> ${interest.toFixed(2)}</h3>
                  <h3><small>Total Amount: </small> ${totalAmount?.toFixed(2)}</h3>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};
export default AutoCompounding;
