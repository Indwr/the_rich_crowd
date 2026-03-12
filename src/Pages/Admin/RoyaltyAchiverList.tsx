import AdminTable from "src/Components/AdminComponent/AdminTable";

const RoyaltyAchiverList = () => {
  const columns = [
    { header: "#", accessor: "id" },
    { header: "User Id", accessor: "userId" },
    { header: "Name", accessor: "name" },
  ];
  const data =[
    {
        id:"1",
        userId:"2",
        name:"15%",
    }

  ]
  return (
    <>
      <div className="content-wrapper">
        <div className="history-card">
          <div className="history-header">
            <h3 className="history-title">
              <i className="fa-solid fa-clipboard-list"></i> Royalty Achiver List
            </h3>
          </div>
          <AdminTable columns={columns} data={data} />
        </div>
      </div>
    </>
  );
};
export default RoyaltyAchiverList;
