import AdminTable from "../../Components/AdminComponent/AdminTable";

const Directs = () => {
  const columns = [
    { header: "#", accessor: "id" },
    { header: "Member ID", accessor: "memberId" },
    { header: "Wallet Address", accessor: "wallet" },
    { header: "Upgrade", accessor: "upgrade" },
    { header: "Status", accessor: "status" },
    { header: "Join Date", accessor: "joinDate" },
  ];

  const data = [
    {
      id: 1,
      memberId: "3869766",
      wallet: "0x81f7...77C7",
      upgrade: "Slot 1",
      status: "Active",
      joinDate: "12-02-2025",
    },
  ];
  return (
    <>
    <div className="dashboard-container">
      <div className="glass-panel">
        <h2 className="table-heading">My Direct Referrals</h2>
        <AdminTable columns={columns} data={data}  />
      </div>
    </div>
    </>
  );
};
export default Directs;
