import { useMemo, useState } from "react";
import { useDashboardData } from "src/features/dashboard/hooks/useDashboardData";
import { useLegacyX2Deposit } from "src/hooks/useLegacyX2Deposit";
import { useTokenPrice } from "src/hooks/useTokenPrice";

const X2Deposit = () => {
  const [amount, setAmount] = useState("");
  const { dashboardResponse } = useDashboardData();
  const { selectedAccount, ksnBalance, connectWallet, deposit } = useLegacyX2Deposit();

  const userId = dashboardResponse?.data?.user?.user_id ?? "";
  const profileEthAddress =
    dashboardResponse?.data?.user?.eth_address ??
    dashboardResponse?.data?.user?.wallet_address ??
    "";
  const fallbackRate = Number(import.meta.env.VITE_X2_TOKEN_PRICE ?? "1");
  const { tokenPrice: rate } = useTokenPrice(fallbackRate);
  const ksnValue = useMemo(() => {
    const value = Number(amount || 0) / (rate || 1);
    return Number.isFinite(value) ? value : 0;
  }, [amount, rate]);
  const isWalletConnected = Boolean(selectedAccount);

  return (
    <>
      <div className="content-wrapper">
        <div className="deposit-container">
          <div className="deposit-card">
            <div className="deposit-header-row">
              <div className="card-icon">
                <i className="fas fa-wallet" />
              </div>
              <span className="deposit-plan-badge">X2 Matrix</span>
            </div>
            <h2 className="card-title">X2 Deposit</h2>
            <p className="card-subtitle">
              Pay with KSN value equivalent to USDT
            </p>
            <div className="deposit-meta">
              <div className="deposit-meta-item">
                <span>Token Rate</span>
                <strong>${rate.toFixed(6)}</strong>
              </div>
              <div className="deposit-meta-item">
                <span>Wallet</span>
                <strong className={isWalletConnected ? "wallet-on" : "wallet-off"}>
                  {isWalletConnected ? "Connected" : "Not Connected"}
                </strong>
              </div>
            </div>
            <div className="steps-indicator">
              <div className="step-dot active" id="step1" />
              <div className="step-dot" id="step2" />
              <div className="step-dot" id="step3" />
            </div>
            <div id="connectSection" style={{ display: isWalletConnected ? "none" : "block" }}>
              <button className="action-btn btn-connect" onClick={connectWallet}>
                <i className="fas fa-link" /> Connect Wallet
              </button>
            </div>
            <div id="actionSection" style={{ display: "block" }}>
              <form id="x2DepositForm">
                <input type="hidden" id="user_id" value={userId} />
                <input type="hidden" id="eth_address" value={profileEthAddress} />
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
                  <div className="balance-info">
                    <span>Available KSN:</span>
                    <span className="balance-val">
                      {isWalletConnected && ksnBalance !== null
                        ? `${ksnBalance.toFixed(4)} KSN`
                        : "--"}
                    </span>
                  </div>
                </div>
                <div id="btnContainer" className="btn-stack">
                  <button
                    className="action-btn btn-gold"
                    id="btnApprove"
                    onClick={(evt) => void deposit(evt, rate)}
                    style={{ display: "flex" }}
                  >
                    <i className="fas fa-check-circle" /> Approve KSN
                  </button>
                  <button
                    className="action-btn btn-gold"
                    id="btnDeposit"
                    onClick={(evt) => void deposit(evt, rate)}
                    style={{ display: "none" }}
                  >
                    <i className="fas fa-arrow-down" /> Deposit KSN
                  </button>
                </div>
                <div id="statusMsg" className="deposit-status-msg">
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
