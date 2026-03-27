import IncomeHistoryTable from "src/features/income/components/IncomeHistoryTable";

const AutoCompoundingMprIncome = () => (
  <IncomeHistoryTable
    title="Auto Compounding MPR (Monthly Return) Income"
    iconClassName="fas fa-calendar-check"
    endpointPath="income/auto-compounding"
    incomeType="auto_compounding_income"
  />
);

export default AutoCompoundingMprIncome;
