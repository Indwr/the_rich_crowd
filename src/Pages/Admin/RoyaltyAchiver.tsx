import { Link } from "react-router-dom";
import AdminTable from "src/Components/AdminComponent/AdminTable";
import { useRoyalty } from "src/features/team/hooks/useRoyalty";

const formatPoolName = (pool: string) =>
  pool
    .replaceAll("_", " ")
    .split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

const RoyaltyAchiver = () => {
  const { pools, isLoading, error } = useRoyalty();

  const columns = [
    { header: "Royalty Pool", accessor: "royaltyPool" },
    { header: "Total Members", accessor: "totalMembers" },
    { header: "Pool Income", accessor: "poolIncome" },
    { header: "Ryoalty Achiver List", accessor: "ryoaltyAchiverList" },
  ];

  const checkPoolIncome = (index: number) => {
    if(index === 0) {
      return "15%";
    }else if(index === 1) {
      return "15%";
    }else if(index === 2) {
      return "15%";
    }else if(index === 3) {
      return "10%";
    }else if(index === 4) {
      return "10%";
    }else if(index === 5) {
      return "10%";
    }else if(index === 6) {
      return "10%";
    }else if(index === 7) {
      return "15%";
    }
  }

  const data = pools.map((pool,index) => ({
    royaltyPool: formatPoolName(pool.pool),
    totalMembers: pool.total_users,
    poolIncome: checkPoolIncome(index),
    ryoaltyAchiverList: (
      <Link
        className="btn-update header-btn"
        to="royalty-achiver-list"
        state={{ pool: pool.pool }}
      >
        Achiver List
      </Link>
    ),
  }));


  return (
    <>
      <div className="content-wrapper">
        <div className="history-card">
          <div className="history-header">
            <h3 className="history-title">
              <i className="fa-solid fa-crown"></i> Royalty Achiver
            </h3>
          </div>
          <AdminTable
            columns={columns}
            data={data}
            isLoading={isLoading}
            error={error}
            emptyMessage="No royalty pools found."
            pagination={{ enabled: true, pageSize: 10 }}
          />
        </div>
      </div>
    </>
  );
};
export default RoyaltyAchiver;
