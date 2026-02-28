import AdminTable from "../../Components/AdminComponent/AdminTable";

const Downlines = () => {
  const columns = [
    { header: "#", accessor: "id" },
    { header: "Member ID", accessor: "memberId" },
    { header: "Sponsor ID", accessor: "sponsorID" },
    { header: "Total Business", accessor: "totalBusiness" },
    { header: "Level", accessor: "level" },
    { header: "Status", accessor: "status" },
    { header: "Join Date", accessor: "joinDate" },
  ];

  const data = [
    {
      id: 1,
      memberId: "3869766",
      sponsorID: "0x81f7...77C7",
      totalBusiness: "Slot 1",
      level: "Active",
      status: "Active",
      joinDate: "12-02-2025",
    },
  ];
  return (
    <>
      <div className="content-wrapper">
        <div className="history-card">
          <div className="history-header">
            <h3 className="history-title">
              <i className="fas fa-network-wired" /> My Downline Team
            </h3>
            <div>
              <span className="total-pill">
                <i className="fas fa-users" />
                Total: 0{" "}
              </span>
            </div>
          </div>

          <AdminTable columns={columns} data={data} />
        </div>
      </div>
    </>
  );
};
export default Downlines;
