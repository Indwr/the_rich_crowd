import { useMemo, useState } from "react";
import AdminTable from "src/Components/AdminComponent/AdminTable";
import { useIncomeHistory } from "../hooks/useIncomeHistory";
import { type IncomeId } from "../services/incomeAPI";

interface IncomeHistoryTableProps {
  title: string;
  iconClassName: string;
  incomeId: IncomeId;
  incomeType?: string;
  totalLabel?: string;
}

const PAGE_SIZE = 10;

const formatDate = (dateValue?: string) => {
  if (!dateValue) return "-";
  const parsed = new Date(dateValue);
  if (Number.isNaN(parsed.getTime())) return dateValue;
  return parsed.toLocaleString("en-GB");
};

const formatAmount = (value?: string | number) => {
  return Number(value ?? 0).toFixed(2);
};

const IncomeHistoryTable = ({
  title,
  iconClassName,
  incomeId,
  incomeType,
  totalLabel = "Total",
}: IncomeHistoryTableProps) => {
  const [currentPage, setCurrentPage] = useState(1);

  const { rows, totalCount, totalAmount, isLoading, isFetching, error } = useIncomeHistory({
    incomeId,
    incomeType,
    currentPage,
    pageSize: PAGE_SIZE,
  });

  const columns = [
    { header: "#", accessor: "index" },
    { header: "Date & Time", accessor: "dateTime" },
    { header: "User Id", accessor: "user_id" },
    { header: "Slot", accessor: "slot" },
    { header: "Amount", accessor: "amount" },
    { header: "Description", accessor: "description" },
  ];

  const data = useMemo(
    () =>
      rows.map((item, index) => ({
        index: (currentPage - 1) * PAGE_SIZE + index + 1,
        dateTime: formatDate(item.created_at),
        user_id: item.user_id || "-",
        slot: item.type || "-",
        amount: `USDT ${formatAmount(item.amount)}`,
        description: item.description || item.type || "-",
      })),
    [currentPage, rows]
  );

  return (
    <div className="content-wrapper">
      <div className="history-card">
        <div className="history-header">
          <h3 className="history-title">
            <i className={iconClassName} /> {title}
          </h3>
          <div>
            <span className="total-pill">
              <i className="fas fa-coins" />
              {totalLabel}: ${formatAmount(totalAmount)}
            </span>
          </div>
        </div>

        <AdminTable
          columns={columns}
          data={data}
          isLoading={isLoading || isFetching}
          error={error}
          emptyMessage="No income history found."
          pagination={{
            enabled: true,
            pageSize: PAGE_SIZE,
            totalCount,
            currentPage,
            serverSide: true,
            onPageChange: setCurrentPage,
          }}
        />
      </div>
    </div>
  );
};

export default IncomeHistoryTable;
