import IncomeHistoryTable from "src/features/income/components/IncomeHistoryTable";

const BiMonthly = () => (
  <IncomeHistoryTable
    title="Bi-Monthly ROI (MPR)"
    iconClassName="fas fa-calendar-check"
    incomeId="X3"
    incomeType="staking_income"
  />
);

export default BiMonthly;
