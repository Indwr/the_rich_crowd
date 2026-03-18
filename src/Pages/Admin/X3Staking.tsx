import { useMemo, useState } from "react";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import { useDashboardData } from "src/features/dashboard/hooks/useDashboardData";
import { tokenKey } from "src/utils/constants";
import { env } from "src/utils/env";

const MIN_STAKE_AMOUNT = 100;
const MAX_STAKE_LIMIT = 50000;

const getBaseApiUrl = () => {
  const raw = env.API_URL ?? "/v1/";
  return raw.endsWith("/") ? raw : `${raw}/`;
};

const formatAmount = (value?: number) => Number(value ?? 0).toFixed(2);

const X3Staking = () => {
  const [amountInput, setAmountInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [statusType, setStatusType] = useState<"success" | "error" | "">("");

  const { dashboardResponse, userPackages, isDashboardLoading, refetchDashboard } =
    useDashboardData();

  const dashboardSummary = dashboardResponse?.data?.dashboard_summary;
  const x3WalletBalance = Number(dashboardSummary?.holdingWalletx3 ?? 0);
  const usedLimit = Number(dashboardSummary?.totalStaked ?? 0);
  const remainingLimit = Math.max(0, MAX_STAKE_LIMIT - usedLimit);
  const progressPercent = Math.min(100, (usedLimit / MAX_STAKE_LIMIT) * 100);

  const activeSlotsCount = useMemo(
    () => userPackages.filter((slot) => Number(slot.status) === 1).length,
    [userPackages]
  );
  const firstSlotStatus = Number(userPackages?.[0]?.status ?? 0);
  const isFirstSlotActive = firstSlotStatus === 1;

  const maxStakeByConditions = Math.max(0, Math.min(x3WalletBalance, remainingLimit));
  const canStake = isFirstSlotActive && remainingLimit >= MIN_STAKE_AMOUNT;
  const parsedAmount = Number(amountInput || 0);

  const setError = (message: string) => {
    setStatusType("error");
    setStatusMessage(message);
    toast.error(message);
  };

  const setSuccess = (message: string) => {
    setStatusType("success");
    setStatusMessage(message);
    toast.success(message);
  };

  const handleMax = () => {
    if (!canStake || maxStakeByConditions < MIN_STAKE_AMOUNT) {
      setError("No stakeable balance available right now.");
      return;
    }
    // Keep amount in whole dollars; backend also validates stake rules.
    setAmountInput(String(Math.floor(maxStakeByConditions)));
  };

  const handleStake = async () => {
    setStatusMessage("");
    setStatusType("");

    if (!isFirstSlotActive) {
      setError("You must activate X2 Slot 1 before staking.");
      return;
    }
    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      setError("Please enter a valid stake amount.");
      return;
    }
    if (parsedAmount < MIN_STAKE_AMOUNT) {
      setError(`Minimum stake amount is $${MIN_STAKE_AMOUNT}.`);
      return;
    }
    if (parsedAmount > MAX_STAKE_LIMIT) {
      setError(`Maximum stake amount allowed is $${MAX_STAKE_LIMIT}.`);
      return;
    }
    if (parsedAmount > remainingLimit) {
      setError(`You can stake up to $${formatAmount(remainingLimit)} based on your remaining limit.`);
      return;
    }
    if (parsedAmount > x3WalletBalance) {
      setError("Insufficient X3 wallet balance.");
      return;
    }
    if (parsedAmount % 100 !== 0) {
      setError("Amount must be a multiple of 100.");
      return;
    }

    const token = Cookies.get(tokenKey);
    if (!token) {
      setError("Session expired. Please login again.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(`${getBaseApiUrl()}user/xthree-staking`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ amount: parsedAmount }),
      });

      const payload = (await response.json().catch(() => ({}))) as {
        message?: string;
      };
      if (!response.ok) {
        throw new Error(payload?.message ?? "Failed to submit stake.");
      }

      setAmountInput("");
      setSuccess(payload?.message ?? "Stake submitted successfully.");
      await refetchDashboard();
    } catch (error: any) {
      setError(error?.message ?? "Failed to submit stake.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="content-wrapper">
        <div className="page-header">
          <h1 className="page-title">X3 Staking Pool</h1>
          <div className="page-desc">Maximize your earnings with secure staking</div>
        </div>
        <div className="staking-card">
          <div className="level-badge-container">
            <span className="lb-label">Current X2 Slot</span>
            <span className="lb-value">Slot {activeSlotsCount}</span>
          </div>

          {!isFirstSlotActive ? (
            <div className="locked-overlay">
              <i className="fas fa-lock fa-lg" />
              <span>
                Not Eligible. Activate <b>X2 Slot 1</b> to unlock staking.
              </span>
            </div>
          ) : null}

          <div className="limit-section">
            <div className="limit-info">
              <span className="limit-label">Staking Limit Used</span>
              <span className="limit-vals">
                <span>${formatAmount(usedLimit)}</span> / ${MAX_STAKE_LIMIT}
              </span>
            </div>
            <div className="progress-track">
              <div className="progress-fill" style={{ width: `${progressPercent}%` }} />
            </div>
          </div>

          <div className="stats-row">
            <div className="stat-pill">
              <span className="sp-label">Remaining Limit</span>
              <span className="sp-value sp-highlight">${formatAmount(remainingLimit)}</span>
            </div>
            <div className="stat-pill">
              <span className="sp-label">Min Stake</span>
              <span className="sp-value">${MIN_STAKE_AMOUNT}</span>
            </div>
            <div className="stat-pill">
              <span className="sp-label">Max Stake</span>
              <span className="sp-value">$50,000</span>
            </div>
          </div>

          <div className="input-group">
            <div className="wallet-info">
              <span className="wi-label">Amount to Stake</span>
              <span className="wi-bal">Balance: ${formatAmount(x3WalletBalance)}</span>
            </div>
            <input
              type="number"
              id="stakeAmount"
              className="custom-input"
              placeholder="0.0"
              value={amountInput}
              onChange={(event) => setAmountInput(event.target.value)}
              disabled={isDashboardLoading || !canStake || isSubmitting}
            />
            <div className="input-actions">
              <span className="currency-badge">USDT</span>
              <button
                type="button"
                className="btn-max"
                onClick={handleMax}
                disabled={isDashboardLoading || !canStake || isSubmitting}
              >
                MAX
              </button>
            </div>
          </div>

          <button
            className="btn-submit"
            id="btnConfirm"
            onClick={handleStake}
            disabled={isDashboardLoading || !canStake || isSubmitting}
          >
            {isSubmitting ? "Submitting..." : canStake ? "Stake Now" : "Locked"}
          </button>
          <div className={`status-alert ${statusType ? `text-${statusType}` : ""}`} id="statusMsg">
            {statusMessage}
          </div>
        </div>
      </div>
    </>
  );
};

export default X3Staking;
