import AdminTable from "../../Components/AdminComponent/AdminTable";
import { useState } from "react";
import { useHistoryList } from "src/features/history/hooks/useHistoryList";
import { formatDateToLongString } from "src/utils";

const X3CompoundingHistory = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const { rows, totalCount, isLoading, isFetching, error } = useHistoryList({
    endpoint: "user/x3/compounding/history",
    currentPage,
    pageSize,
  });

  const columns = [
    { header: "#", accessor: "srNo" },
    { header: "User ID", accessor: "userId" },
    { header: "Amount", accessor: "amount" },
    { header: "With Compound", accessor: "withCompound" },
    { header: "Holding Time", accessor: "holdingTime" },
    { header: "Percent", accessor: "percent" },
    { header: "Status", accessor: "status" },
    { header: "Date", accessor: "createdAt" },
  ];

  const data = rows.map((item, index) => ({
    srNo: (currentPage - 1) * pageSize + index + 1,
    userId: item.user_id ?? "-",
    amount: item.amount ?? "-",
    withCompound: item.withCompound ? "Yes" : "No",
    holdingTime: item.holding_time ?? "-",
    percent: item.percent ?? "-",
    status: item.status ?? "-",
    createdAt: item.created_at ? formatDateToLongString(item.created_at) : "-",
  }));

  const totalAmount = rows.reduce((sum, item) => sum + Number(item.amount ?? 0), 0);

  return (
    <>
      <div className="content-wrapper">
        <div className="history-card">
            <div className="history-header">
            <h3 className="history-title">
              <i className="fas fa-chart-line" /> Auto Compounding History
            </h3>
            <div>
                <span className="total-pill">
                    <i className="fas fa-coins"></i>
                    Total: ${totalAmount.toFixed(2)}                </span>
            </div>
          </div>
          <AdminTable
            columns={columns}
            data={data}
            isLoading={isLoading && !isFetching}
            error={error}
            emptyMessage="No auto compounding history found."
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
    </>
  );
};
export default X3CompoundingHistory;
