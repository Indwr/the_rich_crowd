import AdminTable from "../../Components/AdminComponent/AdminTable";

const X3IncomeLedger = () => {
  const columns = [
    { header: "Date & Time", accessor: "dateTime" },
    { header: "From User", accessor: "fromUser" },
    { header: "Wallet", accessor: "wallet" },
    { header: "Amount", accessor: "amount" },
    { header: "Description", accessor: "description" },
  ];

  const data = [
    {
      dateTime: "12-06-2025",
      fromUser: "1",
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
              <i className="fas fa-file-invoice-dollar" />
              X3 Income Ledger
            </h3>
            <div>
              <span className="total-pill">
                <i className="fas fa-wallet"></i>
                Total Profit: $0.00{" "}
              </span>
            </div>
          </div>
          <AdminTable columns={columns} data={data} />
        </div>
      </div>
    </>
  );
};
export default X3IncomeLedger;
