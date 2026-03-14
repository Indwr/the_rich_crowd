import { useMemo } from "react";
import { useLocation } from "react-router-dom";
import AdminTable from "src/Components/AdminComponent/AdminTable";
import { useRoyalty } from "src/features/team/hooks/useRoyalty";

const formatPoolName = (pool: string) =>
  pool
    .replaceAll("_", " ")
    .split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

const RoyaltyAchiverList = () => {
  const location = useLocation();
  const { pools, isLoading, error, message } = useRoyalty();
  const selectedPool = (location.state as { pool?: string } | null)?.pool;

  const columns = useMemo(
    () => [
      { header: "#", accessor: "index" },
      { header: "User ID", accessor: "userId" },
    ],
    []
  );

  const filteredPools = useMemo(() => {
    if (!selectedPool) return pools;
    return pools.filter((pool) => pool.pool === selectedPool);
  }, [pools, selectedPool]);

  return (
    <>
      <div className="content-wrapper">
        <div className="history-card">
          <div className="history-header">
            <h3 className="history-title">
              <i className="fa-solid fa-clipboard-list"></i> Royalty Achiver List
            </h3>
          </div>
          {message ? <p style={{ marginBottom: 14 }}>{message}</p> : null}

          {filteredPools.map((pool) => {
            const tableRows = (pool.users ?? [])
              .filter((user) => user?.user_id !== null)
              .map((user, index) => ({
                index: index + 1,
                userId: user.user_id,
              }));

            return (
              <div key={pool.pool} style={{ marginBottom: 18 }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 8,
                  }}
                >
                  <h4 style={{ margin: 0 }}>
                    {formatPoolName(pool.pool)}
                  </h4>
                  <span className="total-pill">
                    <i className="fas fa-users" /> Total Users: {pool.total_users}
                  </span>
                </div>

                <AdminTable
                  columns={columns}
                  data={tableRows}
                  isLoading={isLoading}
                  error={error}
                  emptyMessage="No users found in this pool."
                  pagination={{ enabled: true, pageSize: 10 }}
                />
              </div>
            );
          })}

          {!isLoading && !error && filteredPools.length === 0 ? (
            <AdminTable
              columns={columns}
              data={[]}
              emptyMessage={
                selectedPool
                  ? `No users found for ${formatPoolName(selectedPool)}.`
                  : "No royalty pools found."
              }
              pagination={{ enabled: false }}
            />
          ) : null}
        </div>
      </div>
    </>
  );
};
export default RoyaltyAchiverList;
