import AdminTable from "../../Components/AdminComponent/AdminTable";
import { useNavigate } from "react-router-dom";
import { useGeneration } from "src/features/team/hooks/useGeneration";

const Generation = () => {
  const navigate = useNavigate();
  const { rows, levelCount, isLoading, error } = useGeneration();

  const columns = [
    { header: "Level", accessor: "level" },
    { header: "Team Required", accessor: "teamRequired" },
    { header: "Team", accessor: "team" },
    { header: "Action", accessor: "action" },
  ];

  const data = rows.map((row) => ({
    level: `Level ${row.level}`,
    teamRequired: row.teamRequired,
    team: row.team/2,
    action:
      row.users.length > 0 ? (
        <button
          type="button"
          className="btn-update"
          style={{ padding: "6px 12px", fontSize: "0.8rem" }}
          onClick={() =>
            navigate(`/generation/${row.level}`, {
              state: { users: row.users, level: row.level },
            })
          }
        >
          View More
        </button>
      ) : (
        "-"
      ),
  }));

  return (
    <>
      <div className="content-wrapper">
        <div className="history-card">
          <div className="history-header">
            <h3 className="history-title">
              <i className="fas fa-network-wired" /> Generation Summary
            </h3>
            <div>
              <span className="total-pill">
                <i className="fas fa-users" />
                Levels: {levelCount}
              </span>
            </div>
          </div>

          <AdminTable
            columns={columns}
            data={data}
            isLoading={isLoading}
            error={error}
            emptyMessage="No generation data found."
            pagination={{ enabled: true, pageSize: 10 }}
          />
        </div>
      </div>
    </>
  );
};
export default Generation;
