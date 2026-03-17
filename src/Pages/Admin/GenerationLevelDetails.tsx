import { useMemo } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import AdminTable from "../../Components/AdminComponent/AdminTable";
import { useGeneration } from "src/features/team/hooks/useGeneration";
import { type GenerationUser } from "src/features/team/services/generationAPI";

const formatDate = (dateValue: string) => {
  const parsed = new Date(dateValue);
  if (Number.isNaN(parsed.getTime())) return dateValue;
  return parsed.toLocaleDateString("en-GB");
};

const GenerationLevelDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams<{ level: string }>();
  const { getUsersForLevel } = useGeneration();

  const level = Number(params.level || 0);
  const usersFromState = (location.state as { users?: GenerationUser[] } | null)?.users ?? [];
  const users = usersFromState.length > 0 ? usersFromState : getUsersForLevel(level);

  const columns = [
    { header: "#", accessor: "index" },
    { header: "Node ID", accessor: "nodeId" },
    { header: "Total Package", accessor: "totalPackage" },
    { header: "Created At", accessor: "createdAt" },
  ];

  const data = useMemo(() => {
    const sortedUsers = [...users].sort((a, b) => {
      const aTime = new Date(a.created_at).getTime();
      const bTime = new Date(b.created_at).getTime();
      const safeATime = Number.isNaN(aTime) ? 0 : aTime;
      const safeBTime = Number.isNaN(bTime) ? 0 : bTime;
      return safeBTime - safeATime;
    });

    return sortedUsers.map((user, index) => ({
      index: index + 1,
      nodeId: user.node_id,
      totalPackage: user.total_package,
      createdAt: formatDate(user.created_at),
    }));
  }, [users]);

  return (
    <div className="content-wrapper">
      <div className="history-card">
        <div className="history-header">
          <h3 className="history-title">
            <i className="fas fa-layer-group" /> Generation Level {level} Details
          </h3>
          <button
            type="button"
            className="btn-update"
            style={{ padding: "8px 12px", fontSize: "0.8rem" }}
            onClick={() => navigate("/generation")}
          >
            Back
          </button>
        </div>

        <AdminTable
          columns={columns}
          data={data}
          emptyMessage="No users found for this level."
          pagination={{ enabled: true, pageSize: 10 }}
        />
      </div>
    </div>
  );
};

export default GenerationLevelDetails;

