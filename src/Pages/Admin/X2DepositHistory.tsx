import AdminTable from "../../Components/AdminComponent/AdminTable";
import { useState } from "react";
import { useHistoryList } from "src/features/history/hooks/useHistoryList";

const X2DepositHistory = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const { rows, totalCount, isLoading, isFetching, error } = useHistoryList({
    endpoint: "user/x2/deposit/history",
    currentPage,
    pageSize,
  });

  const columns = [
    { header: "#", accessor: "srNo" },
    { header: "Amount", accessor: "amount" },
    { header: "Type", accessor: "type" },
    { header: "Date", accessor: "createdAt" },
  ];

  const data = rows.map((item, index) => ({
    srNo: (currentPage - 1) * pageSize + index + 1,
    amount: item.amount ?? "-",
    type: item.type ?? "-",
    createdAt: item.created_at ?? "-",
  }));

  return (
    <>
      <div className="content-wrapper">
        <div className="history-card">
            <div className="history-header">
            <h3 className="history-title">
              <i className="fas fa-history" /> X2 Deposit History
            </h3>
          </div>
          <AdminTable
            columns={columns}
            data={data}
            isLoading={isLoading && !isFetching}
            error={error}
            emptyMessage="No X2 deposit history found."
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
export default X2DepositHistory;
