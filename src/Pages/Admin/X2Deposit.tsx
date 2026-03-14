import { useMemo, useState } from "react";
import { useDashboardData } from "src/features/dashboard/hooks/useDashboardData";
import { useLegacyX2Deposit } from "src/hooks/useLegacyX2Deposit";

const X2Deposit = () => {
  const [amount, setAmount] = useState("");
  const { dashboardResponse } = useDashboardData();
  const { selectedAccount, connectWallet, deposit } = useLegacyX2Deposit();

  const userId = dashboardResponse?.data?.user?.user_id ?? "";
  const rate = Number(import.meta.env.VITE_X2_TOKEN_PRICE ?? "1");
  const ksnValue = useMemo(() => {
    const value = Number(amount || 0) / (rate || 1);
    return Number.isFinite(value) ? value : 0;
  }, [amount, rate]);

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
              <button className="action-btn btn-connect" onClick={connectWallet}>
                <i className="fas fa-link" /> Connect Wallet
              </button>
            </div>
            <div id="actionSection" style={{ display: "block" }}>
              <form id="x2DepositForm">
                <input type="hidden" id="user_id" value={userId} />
                <div className="amount-group">
                  <label className="amount-label">Enter Amount (USDT)</label>
                  <div className="input-wrapper">
                    <input
                      type="number"
                      id="amount"
                      name="amount"
                      className="deposit-input"
                      placeholder={"0.0"}
                      value={amount}
                      onInput={(event) => setAmount((event.target as HTMLInputElement).value)}
                    />
                    <span className="input-suffix">USDT</span>
                  </div>
                  <div className="conversion-box">
                    <span className="conv-label">Equivalent KSN to Deduct</span>
                    <div className="conv-value" id="ksnDisplay">
                      {ksnValue.toFixed(4)} KSN
                    </div>
                    <div className="conv-rate" id="rateDisplay">
                      1 KSN ≈ ${rate.toFixed(6)}
                    </div>
                  </div>
                  <div className="balance-info">
                    <span>Your Wallet:</span>
                    <span className="balance-val" id="ksnBalance">
                      {selectedAccount || "Not connected"}
                    </span>
                  </div>
                </div>
                <div id="btnContainer">
                  <button
                    className="action-btn btn-gold"
                    id="btnApprove"
                    onClick={(evt) => void deposit(evt, "x2DepositForm")}
                    style={{ display: "flex" }}
                  >
                    <i className="fas fa-check-circle" /> Approve KSN
                  </button>
                  <button
                    className="action-btn btn-gold"
                    id="btnDeposit"
                    onClick={(evt) => void deposit(evt, "x2DepositForm")}
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
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default X2Deposit;
