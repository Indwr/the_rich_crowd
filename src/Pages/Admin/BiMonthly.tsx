import AdminTable from "../../Components/AdminComponent/AdminTable";

const BiMonthly = () => {
  const columns = [
    { header: "#", accessor: "id" },
    { header: "Date & Time", accessor: "dateTime" },
    { header: "Wallet", accessor: "wallet" },
    { header: "Amount", accessor: "amount" },
    { header: "Description", accessor: "description" },
  ];

  const data = [
    {
      id: 1,
      dateTime: "12-06-2025",
      wallet: "deposit",
      amount: "USD 452",
      description: "Lorem ipsum ",
    },
  ];
  return (
    <>
      <div className="content-wrapper">
        <div className="history-card">
          <div className="history-header">
            <h3 className="history-title">
              <i className="fas fa-calendar-check" />
               Bi-Monthly ROI (MPR)
            </h3>
            <div>
              <span className="total-pill">
                <i className="fas fa-coins"></i>
                Total: $0.00{" "}
              </span>
            </div>
          </div>
          <AdminTable columns={columns} data={data} />
        </div>
      </div>
    </>
  );
};
export default BiMonthly;
