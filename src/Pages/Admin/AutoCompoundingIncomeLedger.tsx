import IncomeHistoryTable from "src/features/income/components/IncomeHistoryTable";

const AutoCompoundingIncomeLedger = () => (
  <IncomeHistoryTable
    title="Auto Compounding Income Ledger"
    iconClassName="fas fa-calendar-check"
    endpointPath="income/auto-compounding"
    incomeType=""
  />
);

export default AutoCompoundingIncomeLedger;
