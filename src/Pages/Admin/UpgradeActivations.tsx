import AdminTable from "../../Components/AdminComponent/AdminTable";

const UpgradeActivations = () => {
  const columns = [
    { header: "User ID", accessor: "id" },
    { header: "Upgrade", accessor: "upgrade" },
    { header: "Amount Paid", accessor: "amountPaid" },
    { header: "Status", accessor: "status" },
    { header: "Date Activated", accessor: "dateActivated" },
  ];

  const data = [
    {
      id: 1111,
      upgrade: "1",
      amountPaid: "deposit",
      status: "x2",
      dateActivated: "2025-12-25 16:19:11",
    },
    {
      id: 1111,
      upgrade: "1",
      amountPaid: "deposit",
      status: "x2",
      dateActivated: "2025-12-25 16:19:11",
    },
  ];
  return (
    <>
      <div className="content-wrapper">
        <div className="history-card">
          <div className="history-header">
            <h3 className="history-title">
              <i className="fas fa-layer-group"></i> X2 Activate & Upgrade history
            </h3>
          </div>
          <AdminTable columns={columns} data={data} />
        </div>
      </div>
    </>
  );
};
export default UpgradeActivations;
