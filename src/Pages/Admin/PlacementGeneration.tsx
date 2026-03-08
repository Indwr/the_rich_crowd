import { useMemo, useState } from "react";
import AdminTable from "../../Components/AdminComponent/AdminTable";
import { usePlacementGeneration } from "src/features/team/hooks/usePlacementGeneration";

const PAGE_SIZE = 10;

const formatDate = (dateValue: string) => {
  const parsed = new Date(dateValue);
  if (Number.isNaN(parsed.getTime())) return dateValue;
  return parsed.toLocaleDateString("en-GB");
};

const PlacementGeneration = () => {
  const [selectedLevel, setSelectedLevel] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  const { users, totalCount, isLoading, isFetching, error } = usePlacementGeneration({
    level: selectedLevel,
    page: currentPage,
    limit: PAGE_SIZE,
  });

  const columns = [
    { header: "#", accessor: "index" },
    { header: "User ID", accessor: "downlineId" },
    { header: "Name", accessor: "name" },
    { header: "Level", accessor: "level" },
    { header: "Total Package", accessor: "totalPackage" },
    { header: "Created At", accessor: "createdAt" },
  ];

  const data = useMemo(
    () =>
      users.map((user, index) => ({
        index: (currentPage - 1) * PAGE_SIZE + index + 1,
        downlineId: user.downline_id,
        name: user.first_name ?? "-",
        level: user.level,
        totalPackage: user.total_package,
        createdAt: formatDate(user.created_at),
      })),
    [currentPage, users]
  );

  return (
    <div className="content-wrapper">
      <div className="history-card">
        <div className="history-header">
          <h3 className="history-title">
            <i className="fas fa-project-diagram" /> Placement Generation
          </h3>
          <div className="placement-generation-controls">
            <label htmlFor="placement-level-filter" className="placement-generation-label">
              Select Level
            </label>
            <select
              id="placement-level-filter"
              className="placement-generation-select admin-select"
              value={selectedLevel}
              onChange={(event) => {
                setSelectedLevel(Number(event.target.value));
                setCurrentPage(1);
              }}
            >
              {Array.from({ length: 10 }, (_, index) => index + 1).map((level) => (
                <option key={level} value={level}>
                  Level {level}
                </option>
              ))}
            </select>
            <span className="total-pill">
              <i className="fas fa-users" />
              Total: {totalCount}
            </span>
          </div>
        </div>

        <AdminTable
          columns={columns}
          data={data}
          isLoading={isLoading || isFetching}
          error={error}
          emptyMessage="No placement generation users found."
          pagination={{
            enabled: true,
            pageSize: PAGE_SIZE,
            serverSide: true,
            totalCount,
            currentPage,
            onPageChange: setCurrentPage,
          }}
        />
      </div>
    </div>
  );
};

export default PlacementGeneration;
