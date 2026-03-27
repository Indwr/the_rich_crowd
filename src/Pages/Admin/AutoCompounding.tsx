import { useMemo, useState } from "react";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import { useDashboardData } from "src/features/dashboard/hooks/useDashboardData";
import { tokenKey } from "src/utils/constants";
import { env } from "src/utils/env";

const MIN_COMPOUND_AMOUNT = 100;
const MAX_COMBINED_LIMIT = 50000;
const DURATION_OPTIONS = [3, 5, 10];
const CALCULATOR_MONTHLY_RATE = 0.05;

const getBaseApiUrl = () => {
  const raw = env.API_URL ?? "/v1/";
  return raw.endsWith("/") ? raw : `${raw}/`;
};

const formatAmount = (value?: number) => Number(value ?? 0).toFixed(2);

const AutoCompounding = () => {
  const [amountInput, setAmountInput] = useState("");
  const [selectedYears, setSelectedYears] = useState(3);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [statusType, setStatusType] = useState<"success" | "error" | "">("");
  const [showCalculator, setShowCalculator] = useState(false);
  const [calculatorAmount, setCalculatorAmount] = useState<number>();
  const [calculatorYears, setCalculatorYears] = useState<number>(0);
  const [totalAmount, setTotalAmount] = useState<number | null>(null);
  const [interest, setInterest] = useState<number | null>(null);
  const [calculatorRate, setCalculatorRate] = useState<number | null>(null);

  const { dashboardResponse, userPackages, isDashboardLoading, refetchDashboard } =
    useDashboardData();

  const dashboardSummary = dashboardResponse?.data?.dashboard_summary;
  const x3WalletBalance = Number(dashboardSummary?.holdingWalletx3 ?? 0);
  const usedLimit = Number(dashboardSummary?.totalStaked ?? 0);
  const remainingLimit = Math.max(0, MAX_COMBINED_LIMIT - usedLimit);
  const progressPercent = Math.min(100, (usedLimit / MAX_COMBINED_LIMIT) * 100);

  const activeSlotsCount = useMemo(
    () => userPackages.filter((slot) => Number(slot.status) === 1).length,
    [userPackages]
  );
  const firstSlotStatus = Number(userPackages?.[0]?.status ?? 0);
  const isFirstSlotActive = firstSlotStatus === 1;
  const parsedAmount = Number(amountInput || 0);
  const maxCompoundByConditions = Math.max(0, Math.min(x3WalletBalance, remainingLimit));
  const canCompound = isFirstSlotActive && remainingLimit >= MIN_COMPOUND_AMOUNT;

  const getRateByCombinedAmount = (amount: number) => (usedLimit + amount > 5000 ? 0.05 : 0.05);
  const calculateInterest = () => {
    if (!calculatorYears || !calculatorAmount) return;
    const totalMonths = calculatorYears * 12;
    const total = calculatorAmount * Math.pow(1 + CALCULATOR_MONTHLY_RATE, totalMonths);
    const result = total - calculatorAmount;
    setInterest(result);
    setTotalAmount(total);
    setCalculatorRate(CALCULATOR_MONTHLY_RATE * 12);
  };

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
    if (!canCompound || maxCompoundByConditions < MIN_COMPOUND_AMOUNT) {
      setError("No compounding balance available right now.");
      return;
    }
    setAmountInput(String(Math.floor(maxCompoundByConditions)));
  };

  const getEndDate = () => {
    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setFullYear(startDate.getFullYear() + selectedYears);
    return endDate.toISOString().split("T")[0];
  };

  const getStartDate = () => new Date().toISOString().split("T")[0];

  const handleCompound = async () => {
    setStatusMessage("");
    setStatusType("");

    if (!isFirstSlotActive) {
      setError("You must activate X2 Slot 1 before auto compounding.");
      return;
    }
    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      setError("Please enter a valid compound amount.");
      return;
    }
    if (parsedAmount < MIN_COMPOUND_AMOUNT) {
      setError(`Minimum compound amount is $${MIN_COMPOUND_AMOUNT}.`);
      return;
    }
    if (parsedAmount > MAX_COMBINED_LIMIT) {
      setError(`Maximum compound amount allowed is $${MAX_COMBINED_LIMIT}.`);
      return;
    }
    if (parsedAmount > remainingLimit) {
      setError(`You can compound up to $${formatAmount(remainingLimit)} based on your remaining limit.`);
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
    if (!DURATION_OPTIONS.includes(selectedYears)) {
      setError("Please select a valid duration.");
      return;
    }

    const token = Cookies.get(tokenKey);
    if (!token) {
      setError("Session expired. Please login again.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(`${getBaseApiUrl()}user/auto-compounding`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        // Backend expects this field as `months`; selected value is year duration.
        body: JSON.stringify({ amount: parsedAmount, months: selectedYears }),
      });

      const payload = (await response.json().catch(() => ({}))) as {
        message?: string;
      };
      if (!response.ok) {
        throw new Error(payload?.message ?? "Failed to submit auto compounding.");
      }

      setAmountInput("");
      setSuccess(payload?.message ?? "Auto compounding submitted successfully.");
      await refetchDashboard();
    } catch (error: any) {
      setError(error?.message ?? "Failed to submit auto compounding.");
    } finally {
      setIsSubmitting(false);
    }
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
            <span className="lb-value">Slot {activeSlotsCount}</span>
          </div>
          {!isFirstSlotActive ? (
            <div className="locked-overlay">
              <i className="fas fa-lock" />
              <span>
                Not Eligible. Activate <b>X2 Slot 1</b> to unlock auto compounding.
              </span>
            </div>
          ) : null}
          <div className="limit-section">
            <div className="limit-info">
              <span className="limit-label">Limit Used</span>
              <span className="limit-vals">
                <span>${formatAmount(usedLimit)}</span> / ${MAX_COMBINED_LIMIT}
              </span>
            </div>
            <div className="progress-track">
              <div className="progress-fill" style={{ width: `${progressPercent}%` }} />
            </div>
          </div>
          <div className="stats-container">
            <div className="stat-item">
              <span>Remaining Limit</span>
              <h3 className="highlight-gold">${formatAmount(remainingLimit)}</h3>
            </div>
            <div className="stat-item" style={{ textAlign: "right" }}>
              <span>X3 Balance</span>
              <h3>${formatAmount(x3WalletBalance)}</h3>
            </div>
          </div>
          <div className="plan-selector-title">Select Duration</div>
          <div className="plan-buttons">
            {DURATION_OPTIONS.map((year) => (
              <button
                key={year}
                type="button"
                className={`plan-btn ${selectedYears === year ? "active" : ""}`}
                onClick={() => setSelectedYears(year)}
                disabled={isDashboardLoading || !canCompound || isSubmitting}
              >
                <span className="plan-year">{year} Years</span>
                <span className="plan-min">
                  {(getRateByCombinedAmount(parsedAmount || MIN_COMPOUND_AMOUNT) * 100).toFixed(0)}% APY
                </span>
              </button>
            ))}
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
              value={amountInput}
              onChange={(event) => setAmountInput(event.target.value)}
              disabled={isDashboardLoading || !canCompound || isSubmitting}
            />
            <div className="input-actions">
              <span className="currency-badge">USDT</span>
              <button
                type="button"
                className="btn-max"
                onClick={handleMax}
                disabled={isDashboardLoading || !canCompound || isSubmitting}
              >
                MAX
              </button>
            </div>
          </div>
          <div className="summary-box">
            <div>
              <span className="sb-label">Start Date:</span>
              <span className="sb-val">{getStartDate()}</span>
            </div>
            <div>
              <span className="sb-label">End Date:</span>
              <span className="sb-val" id="endDateDisplay">
                {getEndDate()}
              </span>
            </div>
          </div>
          <button
            className="btn-submit"
            id="btnConfirm"
            onClick={handleCompound}
            disabled={isDashboardLoading || !canCompound || isSubmitting}
          >
            {isSubmitting ? "Submitting..." : canCompound ? "Compound Now" : "Upgrade X2 to Unlock"}
          </button>
          <div className={`status-alert ${statusType ? `text-${statusType}` : ""}`} id="statusMsg">
            {statusMessage}
          </div>
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
                  value={calculatorAmount}
                  onChange={(e) => setCalculatorAmount(Number(e.target.value))}
                />
              </div>

              {/* Year Buttons */}
              <div className="calculator-outer-btn plan-buttons">
                <button
                  className={`plan-btn ${calculatorYears === 3 ? "active" : ""}`}
                  onClick={() => setCalculatorYears(3)}
                >
                  <span className="plan-year">3 Years</span>
                  <span className="plan-min">
                    {(CALCULATOR_MONTHLY_RATE * 100).toFixed(0)}% monthly
                  </span>
                </button>

                <button
                  className={`plan-btn ${calculatorYears === 5 ? "active" : ""}`}
                  onClick={() => setCalculatorYears(5)}
                >
                  <span className="plan-year">5 Years</span>
                  <span className="plan-min">
                    {(CALCULATOR_MONTHLY_RATE * 100).toFixed(0)}% monthly
                  </span>
                </button>

                <button
                  className={`plan-btn ${calculatorYears === 10 ? "active" : ""}`}
                  onClick={() => setCalculatorYears(10)}
                >
                  <span className="plan-year">10 Years</span>
                  <span className="plan-min">
                    {(CALCULATOR_MONTHLY_RATE * 100).toFixed(0)}% monthly
                  </span>
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
                  <h3>
                    <small>Applied Rate: </small>
                    {(CALCULATOR_MONTHLY_RATE * 100).toFixed(0)}% monthly
                    {" "}({((calculatorRate ?? 0) * 100).toFixed(0)}% yearly) for{" "}
                    {calculatorYears * 12} months
                  </h3>
                  <h3><small>Total Auto-Compounded Bonus: </small> ${interest.toFixed(2)}</h3>
                  {/* <h3><small>Total Amount: </small> ${totalAmount?.toFixed(2)}</h3> */}
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
