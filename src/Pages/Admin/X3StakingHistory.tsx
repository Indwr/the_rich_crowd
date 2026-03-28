import AdminTable from "../../Components/AdminComponent/AdminTable";
import { useState } from "react";
import type { ReactNode } from "react";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import { useDashboardData } from "src/features/dashboard/hooks/useDashboardData";
import { useConvertAutoCompounding } from "src/features/history/hooks/useConvertAutoCompounding";
import { HISTORY_ENDPOINT_X3_STAKING } from "src/features/history/services/historyAPI";
import { useHistoryList } from "src/features/history/hooks/useHistoryList";
import { formatDateToLongString } from "src/utils";
import { tokenKey, userKey } from "src/utils/constants";

const YEAR_OPTIONS = [3, 5, 10] as const;

function x3StakingStatusLabel(isActive: unknown): ReactNode {
  const n = Number(isActive);
  if (n === 1) return <span style={{ color: "green" }}>Running</span>;
  if (n === 0) return <span style={{ color: "red" }}>Stopped</span>;
  if (n === 2) {
    return (
      <span style={{ color: "blue" }}>Converted to Auto Compounding</span>
    );
  }
  return "-";
}

const X3StakingHistory = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const { rows, totalCount, totalSum, isLoading, isFetching, error } = useHistoryList({
    endpoint: HISTORY_ENDPOINT_X3_STAKING,
    currentPage,
    pageSize,
  });
  const { dashboardResponse } = useDashboardData();

  const convertMutation = useConvertAutoCompounding();
  const isConverting = convertMutation.isPending;

  const [convertModalOpen, setConvertModalOpen] = useState(false);
  const [convertYear, setConvertYear] = useState<(typeof YEAR_OPTIONS)[number]>(3);
  const [convertAmount, setConvertAmount] = useState("");
  const dashboardUser = dashboardResponse?.data?.user;
  const usedIncome = Number(dashboardUser?.incomeLimit ?? 0);
  const totalIncomeLimit = Number(dashboardUser?.incomeLimit2 ?? 0);
  const totalStaked = Number(totalSum ?? 0);
  const availableToConvert = Math.max(0, totalStaked - usedIncome / 3);

  const columns = [
    { header: "#", accessor: "srNo" },
    { header: "User ID", accessor: "userId" },
    { header: "Amount", accessor: "amount" },
    { header: "Percent", accessor: "percent" },
    { header: "Status", accessor: "status" },
    { header: "Date", accessor: "createdAt" },
  ];

  const data = rows.map((item, index) => ({
    srNo: (currentPage - 1) * pageSize + index + 1,
    userId: item.user_id ?? "-",
    amount: item.amount ?? "-",
    percent: item.percent ?? "-",
    status: x3StakingStatusLabel(item.isActive),
    createdAt: item.created_at ? formatDateToLongString(item.created_at) : "-",
  }));

  const openConvertModal = () => {
    const profileRaw = Cookies.get(userKey);
    if (profileRaw) {
      try {
        const profile = JSON.parse(profileRaw) as { previewUserId?: string };
        if (profile?.previewUserId) {
          toast.error("This feature is not available in preview mode.");
          return;
        }
      } catch (_error) {
        // Ignore invalid cookie and continue normal behavior.
      }
    }

    setConvertYear(3);
    setConvertAmount("");
    setConvertModalOpen(true);
  };

  const closeConvertModal = () => {
    if (!isConverting) setConvertModalOpen(false);
  };

  const handleConvertSubmit = () => {
    if (!Cookies.get(tokenKey)) {
      toast.error("Session expired. Please login again.");
      return;
    }

    const raw = convertAmount.trim();
    const amountNum = Number(raw);
    if (!raw || Number.isNaN(amountNum) || amountNum <= 0) {
      toast.error("Enter a valid amount.");
      return;
    }
    if (amountNum < 100) {
      toast.error("Minimum amount is 100 USDT.");
      return;
    }
    if (amountNum % 100 !== 0) {
      toast.error("Amount must be a multiple of 100.");
      return;
    }
    if (amountNum > availableToConvert) {
      toast.error(
        `Maximum convertible amount is ${availableToConvert.toFixed(2)} USDT.`
      );
      return;
    }

    convertMutation.mutate(
      { year: convertYear, amount: amountNum },
      {
        onSuccess: (envelope) => {
          toast.success(envelope.message);
          setConvertModalOpen(false);
          setConvertAmount("");
        },
        onError: (err) => {
          toast.error(err instanceof Error ? err.message : "Conversion failed.");
        },
      }
    );
  };

  return (
    <>
      <div className="content-wrapper">
        <div className="history-card">
          <div className="history-header">
            <h3 className="history-title">
              <i className="fas fa-history" /> X3 Staking History
            </h3>
            <div className="history-header-actions">
              <span className="total-pill">
                <i className="fas fa-coins"></i>
                Total Used Limit: ${Number(totalSum ?? 0).toFixed(2)}
              </span>
              <button
                type="button"
                className="btn-update header-btn x3-staking-convert-open"
                onClick={openConvertModal}
              >
                <i className="fas fa-exchange-alt" aria-hidden />
                Convert to auto compounding
              </button>
            </div>
          </div>
          <AdminTable
            columns={columns}
            data={data}
            isLoading={isLoading && !isFetching}
            error={error}
            emptyMessage="No X3 staking history found."
            pagination={{
              enabled: true,
              pageSize,
              totalCount,
              currentPage,
              serverSide: true,
              onPageChange: setCurrentPage,
            }}
          />
        </div>
      </div>

      {convertModalOpen && (
        <div
          className="x3-convert-modal-overlay"
          role="presentation"
          onClick={closeConvertModal}
        >
          <div
            className="x3-convert-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="convert-modal-title"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="x3-convert-modal__accent" aria-hidden />
            <div className="x3-convert-modal__body">
              <button
                type="button"
                className="x3-convert-modal__close"
                onClick={closeConvertModal}
                disabled={isConverting}
                aria-label="Close"
              >
                <i className="fa-solid fa-xmark" />
              </button>

              <div className="x3-convert-modal__header">
                <div className="x3-convert-modal__icon-wrap" aria-hidden>
                  <i className="fas fa-layer-group" />
                </div>
                <h2 id="convert-modal-title">Convert to auto compounding</h2>
                <p className="x3-convert-modal__subtitle">
                  Enter the amount to convert and choose a lock-in period.
                </p>
              </div>

              <div className="x3-convert-modal__metrics">
                <div className="x3-convert-modal__metric">
                  <span className="x3-convert-modal__metric-label">Total Received Income</span>
                  <span className="x3-convert-modal__metric-value">
                    ${usedIncome.toFixed(2)}
                  </span>
                </div>
                <div className="x3-convert-modal__metric">
                  <span className="x3-convert-modal__metric-label">Total Max Limit</span>
                  <span className="x3-convert-modal__metric-value">
                    ${totalIncomeLimit.toFixed(2)}
                  </span>
                </div>
                <div className="x3-convert-modal__metric">
                  <span className="x3-convert-modal__metric-label">Total Staked</span>
                  <span className="x3-convert-modal__metric-value">
                    ${totalStaked.toFixed(2)}
                  </span>
                </div>
                <div className="x3-convert-modal__metric">
                  <span className="x3-convert-modal__metric-label">Available to convert</span>
                  <span className="x3-convert-modal__metric-value x3-convert-modal__metric-value--gold">
                    ${availableToConvert.toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="x3-convert-modal__amount-wrap">
                <label className="x3-convert-modal__section-label" htmlFor="convert-amount">
                  Amount (USDT)
                </label>
                <input
                  id="convert-amount"
                  type="number"
                  inputMode="decimal"
                  min={100}
                  step={100}
                  className="x3-convert-modal__amount-input"
                  placeholder="e.g. 500"
                  value={convertAmount}
                  onChange={(e) => setConvertAmount(e.target.value)}
                  disabled={isConverting}
                  autoComplete="off"
                />
                <p className="x3-convert-modal__amount-hint">
                  Total Staked Available: $
                  {availableToConvert.toFixed(2)}.
                </p>
              </div>

              <div>
                <span className="x3-convert-modal__section-label">Lock-in period</span>
                <div className="plan-buttons x3-convert-modal__year-buttons">
                  {YEAR_OPTIONS.map((y) => (
                    <button
                      key={y}
                      type="button"
                      className={`plan-btn ${convertYear === y ? "active" : ""}`}
                      onClick={() => setConvertYear(y)}
                      disabled={isConverting}
                    >
                      <span className="plan-year">{y} yr</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="x3-convert-modal__footer">
                <button
                  type="button"
                  className="x3-convert-modal__btn-cancel"
                  onClick={closeConvertModal}
                  disabled={isConverting}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="x3-convert-modal__btn-confirm"
                  onClick={handleConvertSubmit}
                  disabled={isConverting || availableToConvert < 100}
                >
                  {isConverting ? (
                    <>
                      <i className="fas fa-circle-notch fa-spin" aria-hidden />
                      Submitting…
                    </>
                  ) : (
                    "Confirm conversion"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
export default X3StakingHistory;
