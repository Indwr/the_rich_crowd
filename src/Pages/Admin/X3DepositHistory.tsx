import AdminTable from "../../Components/AdminComponent/AdminTable";

const X3DepositHistory = () => {
  const columns = [
    { header: "User ID", accessor: "id" },
    { header: "Amount", accessor: "amount" },
    { header: "Type", accessor: "type" },
    { header: "Remark", accessor: "remark" },
    { header: "Date", accessor: "date" },
  ];

  const data = [
    {
      id: 1111,
      amount: "1",
      type: "deposit",
      remark: "",
      date: "2025-12-25 16:19:11",
    },
    {
      id: 1111,
      amount: "1",
      type: "deposit",
      remark: "",
      date: "2025-12-25 16:19:11",
    },
  ];
  return (
    <>
      <div className="content-wrapper">
        <div className="history-card">
            <div className="history-header">
            <h3 className="history-title">
              <i className="fas fa-history" /> X3 Deposit History
            </h3>
          </div>
          <AdminTable columns={columns} data={data} />
        </div>
      </div>
    </>
  );
};
export default X3DepositHistory;
