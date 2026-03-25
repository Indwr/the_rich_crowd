import IncomeHistoryTable from "src/features/income/components/IncomeHistoryTable";

const AutoCompoundingDirectIncome = () => (
  <IncomeHistoryTable
    title="Auto Compounding Direct Income"
    iconClassName="fas fa-hand-holding-usd"
    endpointPath="income/auto-compounding"
    incomeType="direct_referral"
  />
);

export default AutoCompoundingDirectIncome;
