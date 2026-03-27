import { useState } from "react";
import { Link } from "react-router-dom";
import AdminTable from "src/Components/AdminComponent/AdminTable";
import { useRoyalty } from "src/features/team/hooks/useRoyalty";
import { calculatePercentage } from "src/utils";

const formatPoolName = (pool: string) =>
  pool
    .replaceAll("_", " ")
    .split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

const RoyaltyAchiver = () => {
  const now = new Date();
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const { pools, totalIncome, isLoading, error } = useRoyalty({ month, year });


  const yearOptions = Array.from({ length: 6 }, (_, index) =>
    String(now.getFullYear() - index)
  );
  const hasAnyFilter = Boolean(month || year);

  const columns = [
    { header: "Royalty Pool", accessor: "royaltyPool" },
    { header: "Total Members", accessor: "totalMembers" },
    { header: "Pool Income", accessor: "poolIncome" },
    { header: "Pool Amount", accessor: "poolAmount" },
    { header: "Ryoalty Achiver List", accessor: "ryoaltyAchiverList" },
  ];

  const checkPoolIncome = (index: number): string => {
    const poolIncomeByIndex = ["15%", "15%", "15%", "10%", "10%", "10%", "10%", "15%"];
    return poolIncomeByIndex[index] ?? "0%";
  };

  const checkPoolAmount = (index: number) => {
    return (
      calculatePercentage(
        parseFloat(checkPoolIncome(index).replace("%", "")),
        Number(totalIncome[0]?.total_amount ?? 0)
      ) ?? 0
    );
  };

  const selectedYear = Number(year);
  const selectedMonth = Number(month);
  const hasValidYear = Number.isInteger(selectedYear) && selectedYear > 0;
  const hasValidMonth = Number.isInteger(selectedMonth) && selectedMonth >= 1 && selectedMonth <= 12;

  const shouldShowPoolAmount =
    hasValidYear &&
    (selectedYear > 2026 || (selectedYear === 2026 && hasValidMonth && selectedMonth >= 3));

  const data = pools.map((pool,index) => ({
    royaltyPool: formatPoolName(pool.pool),
    totalMembers: pool.total_users,
    poolIncome: checkPoolIncome(index),
    poolAmount: shouldShowPoolAmount ? checkPoolAmount(index) : 0,
    ryoaltyAchiverList: (
      <Link
        className="btn-update header-btn"
        to="royalty-achiver-list"
        state={{ pool: pool.pool, month, year }}
      >
        Achiver List
      </Link>
    ),
  }));

  const monthLabel =
    [
      { value: "01", label: "January" },
      { value: "02", label: "February" },
      { value: "03", label: "March" },
      { value: "04", label: "April" },
      { value: "05", label: "May" },
      { value: "06", label: "June" },
      { value: "07", label: "July" },
      { value: "08", label: "August" },
      { value: "09", label: "September" },
      { value: "10", label: "October" },
      { value: "11", label: "November" },
      { value: "12", label: "December" },
    ].find((item) => item.value === month)?.label ?? month;
  const selectedPeriodText =
    month && year
      ? `${monthLabel} ${year}`
      : month
        ? `${monthLabel} (All Years)`
        : year
          ? `All Months (${year})`
          : "All Time";

  return (
    <>
      <div className="content-wrapper">
        <div className="history-card">
          <div className="history-header">
            <h3 className="history-title">
              <i className="fa-solid fa-crown"></i> Royalty Achiver
            </h3>
          </div>
          <div className="royalty-filter-bar">
            <div className="placement-generation-controls">
              <div>
                <label htmlFor="royalty-month" className="placement-generation-label">
                  Month
                </label>
                <select
                  id="royalty-month"
                  value={month}
                  onChange={(event) => setMonth(event.target.value)}
                  className="admin-select"
                >
                  <option value="">All Months</option>
                  {[
                    { value: "01", label: "January" },
                    { value: "02", label: "February" },
                    { value: "03", label: "March" },
                    { value: "04", label: "April" },
                    { value: "05", label: "May" },
                    { value: "06", label: "June" },
                    { value: "07", label: "July" },
                    { value: "08", label: "August" },
                    { value: "09", label: "September" },
                    { value: "10", label: "October" },
                    { value: "11", label: "November" },
                    { value: "12", label: "December" },
                  ].map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="royalty-year" className="placement-generation-label">
                  Year
                </label>
                <select
                  id="royalty-year"
                  value={year}
                  onChange={(event) => setYear(event.target.value)}
                  className="admin-select"
                >
                  <option value="">All Years</option>
                  {yearOptions.map((yearOption) => (
                    <option key={yearOption} value={yearOption}>
                      {yearOption}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="royalty-filter-meta">
              <span className="total-pill royalty-period-pill">
                <i className="fa-regular fa-calendar" />
                {selectedPeriodText}
              </span>
              {hasAnyFilter ? (
                <button
                  type="button"
                  className="directs-reset-btn"
                  onClick={() => {
                    setMonth("");
                    setYear("");
                  }}
                >
                  <i className="fa-solid fa-rotate-left" />
                  Clear Filter
                </button>
              ) : null}
            </div>
          </div>
          <AdminTable
            columns={columns}
            data={data}
            isLoading={isLoading}
            error={error}
            emptyMessage="No royalty pools found."
            pagination={{ enabled: true, pageSize: 10 }}
          />
        </div>
      </div>
    </>
  );
};
export default RoyaltyAchiver;
