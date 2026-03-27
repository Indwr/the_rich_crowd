import IncomeHistoryTable from "src/features/income/components/IncomeHistoryTable";

const AutoCompoundingIncome = () => (
  <IncomeHistoryTable
    title="Auto Compounding Hybrid Level Income"
    iconClassName="fas fa-sync-alt"
    endpointPath="income/auto-compounding"
    incomeType="level_income"
  />
);

export default AutoCompoundingIncome;
