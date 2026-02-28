import AdminTable from "../../Components/AdminComponent/AdminTable";

const X3StakingHistory = () => {
  const columns = [
    { header: "User ID", accessor: "id" },
    { header: "Staked Date", accessor: "stakedDate" },
    { header: "Amount (USDT)", accessor: "amount" },
    { header: "Status", accessor: "status" },
  ];

  const data = [
    {
      id: 1111,
      stakedDate: "1",
      type: "deposit",
      status: "",
    },
  ];
  return (
    <>
      <div className="content-wrapper">
        <div className="history-card">
            <div className="history-header">
            <h3 className="history-title">
              <i className="fas fa-history" /> X3 Staking History
            </h3>
          </div>
          <AdminTable columns={columns} data={data} />
        </div>
      </div>
    </>
  );
};
export default X3StakingHistory;
