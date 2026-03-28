import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { useQueryClient } from "@tanstack/react-query";
import AdminTable from "../../Components/AdminComponent/AdminTable";
import { useNotificationList } from "src/features/history/hooks/useNotificationList";
import { NOTIFICATION_UNREAD_QUERY_KEY } from "src/features/history/hooks/useNotificationUnread";
import { markNotificationsSeen } from "src/features/history/services/historyAPI";
import { formatDateToLongString } from "src/utils";

const Notifications = () => {
  const queryClient = useQueryClient();
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    let cancelled = false;
    markNotificationsSeen()
      .then(() => {
        if (!cancelled) {
          queryClient.invalidateQueries({ queryKey: NOTIFICATION_UNREAD_QUERY_KEY });
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [queryClient]);
  const pageSize = 10;
  const { rows, totalCount, isLoading, isFetching, error } = useNotificationList({
    currentPage,
    pageSize,
  });

  const [viewOpen, setViewOpen] = useState<{
    id: number | string;
    subject: string;
    text: string;
    dateLabel: string;
  } | null>(null);

  const columns = [
    { header: "#", accessor: "srNo" },
    { header: "ID", accessor: "id" },
    { header: "Subject", accessor: "subject" },
    { header: "Date", accessor: "createdAt" },
    { header: "Action", accessor: "action" },
  ];

  const data = rows.map((item, index) => {
    const id = item.id;
    const subject = item.subject ?? "—";
    const body = String(item.text ?? "");
    const createdAt = item.created_at
      ? formatDateToLongString(item.created_at)
      : "—";

    return {
      srNo: (currentPage - 1) * pageSize + index + 1,
      id,
      subject: truncateText(subject, 64),
      createdAt,
      action: (
        <button
          type="button"
          className="btn-update header-btn"
          style={{ padding: "0.35rem 0.75rem", fontSize: "0.85rem" }}
          onClick={() =>
            setViewOpen({
              id,
              subject: String(subject),
              text: body,
              dateLabel: createdAt,
            })
          }
        >
          View
        </button>
      ),
    };
  });

  return (
    <>
      <div className="content-wrapper">
        <div className="history-card">
          <div className="history-header">
            <h3 className="history-title">
              <i className="fas fa-bell" /> Notifications
            </h3>
          </div>
          <AdminTable
            columns={columns}
            data={data}
            isLoading={isLoading && !isFetching}
            error={error}
            emptyMessage="No notifications yet."
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

      {viewOpen && (
        <div
          className="x3-convert-modal-overlay notification-view-overlay"
          role="presentation"
          onClick={() => setViewOpen(null)}
        >
          <div
            className="x3-convert-modal notification-view-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="notification-view-title"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="x3-convert-modal__accent" aria-hidden />
            <div className="x3-convert-modal__body notification-view-modal__body">
              <button
                type="button"
                className="x3-convert-modal__close"
                onClick={() => setViewOpen(null)}
                aria-label="Close"
              >
                <i className="fa-solid fa-xmark" />
              </button>

              <div className="notification-view-head">
                <div className="notification-view-meta">
                  <span className="notification-view-pill notification-view-pill--id">
                    <i className="fas fa-hashtag" aria-hidden />
                    {viewOpen.id}
                  </span>
                  <span className="notification-view-pill notification-view-pill--date">
                    <i className="far fa-clock" aria-hidden />
                    {viewOpen.dateLabel}
                  </span>
                </div>
                <h2 id="notification-view-title" className="notification-view-title">
                  {viewOpen.subject}
                </h2>
              </div>

              <div className="notification-view-section">
                <div className="notification-view-section-head">
                  <span className="notification-view-icon" aria-hidden>
                    <i className="fas fa-envelope-open-text" />
                  </span>
                  <span className="notification-view-section-label">Message</span>
                </div>
                <div className="notification-view-body">
                  {viewOpen.text ? (
                    <p className="notification-view-text">{viewOpen.text}</p>
                  ) : (
                    <p className="notification-view-empty">No message body.</p>
                  )}
                </div>
              </div>

              <div className="notification-view-footer">
                <button
                  type="button"
                  className="notification-view-close-btn"
                  onClick={() => setViewOpen(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

function truncateText(s: string, max: number): string | ReactNode {
  if (s.length <= max) return s;
  return `${s.slice(0, max)}…`;
}

export default Notifications;
