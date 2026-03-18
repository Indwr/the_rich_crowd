import AdminTable from "../../Components/AdminComponent/AdminTable";
import { useState } from "react";
import { useHistoryList } from "src/features/history/hooks/useHistoryList";
import { formatDateToLongString } from "src/utils";

const X3StakingHistory = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const { rows, totalCount, isLoading, isFetching, error } = useHistoryList({
    endpoint: "user/x3/staking/history",
    currentPage,
    pageSize,
  });

  const columns = [
    { header: "#", accessor: "srNo" },
    { header: "User ID", accessor: "userId" },
    { header: "Amount", accessor: "amount" },
    // { header: "Holding Time", accessor: "holdingTime" },
    { header: "Percent", accessor: "percent" },
    { header: "Status", accessor: "status" },
    { header: "Date", accessor: "createdAt" },
  ];

  const data = rows.map((item, index) => ({
    srNo: (currentPage - 1) * pageSize + index + 1,
    userId: item.user_id ?? "-",
    amount: item.amount ?? "-",
    // holdingTime: item.holding_time ?? "-",
    percent: item.percent ?? "-",
    status: item.status ?? "-",
    createdAt: item.created_at ? formatDateToLongString(item.created_at) : "-",
  }));

  return (
    <>
      <div className="content-wrapper">
        <div className="history-card">
            <div className="history-header">
            <h3 className="history-title">
              <i className="fas fa-history" /> X3 Staking History
            </h3>
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
    </>
  );
};
export default X3StakingHistory;
