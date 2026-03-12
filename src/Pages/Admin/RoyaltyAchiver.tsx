import { Link } from "react-router-dom";
import AdminTable from "src/Components/AdminComponent/AdminTable";

const RoyaltyAchiver = () => {
  const columns = [
    { header: "Royalty Pool", accessor: "royaltyPool" },
    { header: "Total Members", accessor: "totalMembers" },
    { header: "Pool Income", accessor: "poolIncome" },
    { header: "Ryoalty Achiver List", accessor: "ryoaltyAchiverList" },
  ];
  const data =[
    {
        royaltyPool:"1st Pool",
        totalMembers:"2",
        poolIncome:"15%",
        ryoaltyAchiverList:<Link className="btn-update header-btn" to="royalty-achiver-list">Achiver List</Link>,
    },
    {
        royaltyPool:"2st Pool",
        totalMembers:"2",
        poolIncome:"15%",
        ryoaltyAchiverList:<Link className="btn-update header-btn" to="royalty-achiver-list">Achiver List</Link>,
    },
    {
        royaltyPool:"3st Pool",
        totalMembers:"2",
        poolIncome:"15%",
        ryoaltyAchiverList:<Link className="btn-update header-btn" to="royalty-achiver-list">Achiver List</Link>,
    },
    {
        royaltyPool:"4st Pool",
        totalMembers:"2",
        poolIncome:"15%",
        ryoaltyAchiverList:<Link className="btn-update header-btn" to="royalty-achiver-list">Achiver List</Link>,
    },
    {
        royaltyPool:"5st Pool",
        totalMembers:"2",
        poolIncome:"15%",
        ryoaltyAchiverList:<Link className="btn-update header-btn" to="royalty-achiver-list">Achiver List</Link>,
    },
    {
        royaltyPool:"6st Pool",
        totalMembers:"2",
        poolIncome:"15%",
        ryoaltyAchiverList:<Link className="btn-update header-btn" to="royalty-achiver-list">Achiver List</Link>,
    },
    {
        royaltyPool:"7st Pool",
        totalMembers:"2",
        poolIncome:"15%",
        ryoaltyAchiverList:<Link className="btn-update header-btn" to="royalty-achiver-list">Achiver List</Link>,
    },
    {
        royaltyPool:"8st Pool",
        totalMembers:"2",
        poolIncome:"15%",
        ryoaltyAchiverList:<Link className="btn-update header-btn" to="royalty-achiver-list">Achiver List</Link>,
    },


  ]
  return (
    <>
      <div className="content-wrapper">
        <div className="history-card">
          <div className="history-header">
            <h3 className="history-title">
              <i className="fa-solid fa-crown"></i> Royalty Achiver
            </h3>
          </div>
          <AdminTable columns={columns} data={data} />
        </div>
      </div>
    </>
  );
};
export default RoyaltyAchiver;
