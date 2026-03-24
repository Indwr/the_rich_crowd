import AdminTable from "../../Components/AdminComponent/AdminTable";
import { useState } from "react";
import type { ReactNode } from "react";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import { useConvertAutoCompounding } from "src/features/history/hooks/useConvertAutoCompounding";
import { HISTORY_ENDPOINT_X3_STAKING } from "src/features/history/services/historyAPI";
import { useHistoryList } from "src/features/history/hooks/useHistoryList";
import { formatDateToLongString } from "src/utils";
import { tokenKey } from "src/utils/constants";
import { stakingPendingIncomeCalculator } from "src/utils/constants/convertAutoCompound";

const YEAR_OPTIONS = [3, 5, 10] as const;

const formatMoney = (value: number) => Number(value ?? 0).toFixed(2);

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

  const convertMutation = useConvertAutoCompounding();
  const isConverting = convertMutation.isPending;

  const [convertModal, setConvertModal] = useState<{
    stakeId: number;
    amount: number;
    createdAt: string;
  } | null>(null);
  const [convertYear, setConvertYear] = useState<(typeof YEAR_OPTIONS)[number]>(3);

  const columns = [
    { header: "#", accessor: "srNo" },
    { header: "User ID", accessor: "userId" },
    { header: "Amount", accessor: "amount" },
    // { header: "Holding Time", accessor: "holdingTime" },
    { header: "Percent", accessor: "percent" },
    { header: "Status", accessor: "status" },
    { header: "Date", accessor: "createdAt" },
    { header: "Action", accessor: "action" },
  ];

  const data = rows.map((item, index) => {
    const stakeId = Number(item.id);
    const amountNum = Number(item.amount ?? 0);
    const createdAt = item.created_at ?? "";
    const isRunning = Number(item.isActive) === 1;

    return {
      srNo: (currentPage - 1) * pageSize + index + 1,
      userId: item.user_id ?? "-",
      amount: item.amount ?? "-",
      percent: item.percent ?? "-",
      status: x3StakingStatusLabel(item.isActive),
      createdAt: item.created_at ? formatDateToLongString(item.created_at) : "-",
      action: isRunning ? (
        <button
          type="button"
          className="btn-update header-btn"
          style={{ padding: "0.35rem 0.75rem", fontSize: "0.85rem" }}
          onClick={() => {
            setConvertYear(3);
            setConvertModal({ stakeId, amount: amountNum, createdAt: createdAt });
          }}
        >
          Convert
        </button>
      ) : (
        "—"
      ),
    };
  });

  const closeConvertModal = () => {
    if (!isConverting) setConvertModal(null);
  };

  const handleConvertSubmit = () => {
    if (!convertModal) return;
    if (!Cookies.get(tokenKey)) {
      toast.error("Session expired. Please login again.");
      return;
    }

    convertMutation.mutate(
      { year: convertYear, stakeId: convertModal.stakeId },
      {
        onSuccess: (envelope) => {
          toast.success(envelope.message);
          setConvertModal(null);
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
            <div>
              <span className="total-pill">
                <i className="fas fa-coins"></i>
                Total Used Limit: ${Number(totalSum ?? 0).toFixed(2)}
              </span>
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

      {convertModal && (
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
                  Confirm your stake details and choose a lock-in period. This will move
                  this position into auto compounding.
                </p>
              </div>

              <div className="x3-convert-modal__metrics">
                <div className="x3-convert-modal__metric">
                  <span className="x3-convert-modal__metric-label">Stake ID</span>
                  <span className="x3-convert-modal__metric-value">
                    #{convertModal.stakeId}
                  </span>
                </div>
                <div className="x3-convert-modal__metric">
                  <span className="x3-convert-modal__metric-label">Amount</span>
                  <span className="x3-convert-modal__metric-value x3-convert-modal__metric-value--gold">
                    ${formatMoney(Number(convertModal.amount)-Number(stakingPendingIncomeCalculator(convertModal.createdAt, convertModal.amount).income/3))}
                    <span className="x3-convert-modal__metric-suffix">USDT</span>
                  </span>
                </div>
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
                  disabled={isConverting}
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
