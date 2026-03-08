import IncomeHistoryTable from "src/features/income/components/IncomeHistoryTable";

const RoyaltyIncome = () => (
  <IncomeHistoryTable
    title="Royalty Income"
    iconClassName="fas fa-crown"
    incomeId="X2"
    incomeType="royalty_for_user"
  />
);

export default RoyaltyIncome;
