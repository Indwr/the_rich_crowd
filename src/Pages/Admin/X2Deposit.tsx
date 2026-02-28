const X2Deposit = () => {
  return (
    <>
      <div className="content-wrapper">
        <div className="deposit-container">
          <div className="deposit-card">
            <div className="card-icon">
              <i className="fas fa-wallet" />
            </div>
            <h2 className="card-title">X2 Deposit</h2>
            <p className="card-subtitle">
              Pay with KSN value equivalent to USDT
            </p>
            <div className="steps-indicator">
              <div className="step-dot active" id="step1" />{" "}
              <div className="step-dot" id="step2" />{" "}
              <div className="step-dot" id="step3" />
            </div>
            <div id="connectSection" style={{ display: "block" }}>
              <button
                className="action-btn btn-connect"
                onClick={undefined}
              >
                <i className="fas fa-link" /> Connect Wallet
              </button>
            </div>
            <div id="actionSection" style={{ display: "block" }}>
              <div className="amount-group">
                <label className="amount-label">Enter Amount (USDT)</label>
                <div className="input-wrapper">
                  <input
                    type="number"
                    id="usdtInput"
                    className="deposit-input"
                    placeholder={"0.0"}
                    onInput={undefined}
                  />
                  <span className="input-suffix">USDT</span>
                </div>
                <div className="conversion-box">
                  <span className="conv-label">Equivalent KSN to Deduct</span>
                  <div className="conv-value" id="ksnDisplay">
                    105.0429 KSN
                  </div>
                  <div className="conv-rate" id="rateDisplay">
                    1 KSN ≈ $0.019040
                  </div>
                </div>
                <div className="balance-info">
                  <span>Your Balance:</span>
                  <span className="balance-val" id="ksnBalance">
                    565.4401 KSN
                  </span>
                </div>
              </div>
              <div id="btnContainer">
                <button
                  className="action-btn btn-gold"
                  id="btnApprove"
                  onClick={undefined}
                  style={{ display: "flex" }}
                >
                  <i className="fas fa-check-circle" /> Approve KSN
                </button>
                <button
                  className="action-btn btn-gold"
                  id="btnDeposit"
                  onClick={undefined}
                  style={{ display: "none" }}
                >
                  <i className="fas fa-arrow-down" /> Deposit KSN
                </button>
              </div>
              <div
                id="statusMsg"
                style={{ marginTop: 15, color: "#888", fontSize: "0.9rem" }}
              >
                Approval Required.
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default X2Deposit;
