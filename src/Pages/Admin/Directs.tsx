import AdminTable from "../../Components/AdminComponent/AdminTable";
import { useState } from "react";
import TableSearchBar from "../../Components/AdminComponent/TableSearchBar";
import { useDirects } from "src/features/team/hooks/useDirects";

const Directs = () => {
  const {
    directs,
    totalCount,
    selectedUserId,
    searchType,
    searchText,
    currentPage,
    pageSize,
    isLoading,
    error,
    viewByUserId,
    applySearch,
    setCurrentPage,
    resetToRoot,
  } = useDirects();
  const [searchInput, setSearchInput] = useState(searchText);
  const [searchTypeInput, setSearchTypeInput] = useState<"userId" | "wallet">(searchType);

  const columns = [
    { header: "#", accessor: "id" },
    { header: "Member ID", accessor: "memberId" },
    { header: "Wallet Address", accessor: "wallet" },
    { header: "Directs", accessor: "directs" },
    { header: "Total Package", accessor: "totalPackage" },
    { header: "Action", accessor: "action" },
  ];
  const searchOptions = [
    { value: "userId", label: "User ID" },
    { value: "wallet", label: "Wallet" },
  ];

  const data = directs.map((item, index) => ({
    id: (currentPage - 1) * pageSize + index + 1,
    memberId: item.user_id,
    wallet: item.eth_address,
    directs: item.directs,
    totalPackage: item.total_package,
    action: (
      <button
        type="button"
        className="btn-update"
        style={{ padding: "6px 12px", fontSize: "0.8rem" }}
        onClick={() => viewByUserId(item.user_id)}
      >
        View
      </button>
    ),
  }));

  return (
    <>
      <div className="dashboard-container">
        <div className="glass-panel">
          <h2 className="table-heading">My Direct Referrals</h2>
          <TableSearchBar
            searchType={searchTypeInput}
            searchValue={searchInput}
            searchOptions={searchOptions}
            onSearchTypeChange={(value) => setSearchTypeInput(value as "userId" | "wallet")}
            onSearchValueChange={setSearchInput}
            onSearch={() => applySearch(searchTypeInput, searchInput.trim())}
            onClear={() => {
              setSearchInput("");
              setSearchTypeInput("userId");
              applySearch("userId", "");
            }}
          />
          <div className="directs-toolbar-row">
            <span className="directs-toolbar-text">
              Active userId param: <strong>{selectedUserId || "(empty)"}</strong>
            </span>
            {selectedUserId && (
              <button
                type="button"
                onClick={resetToRoot}
                className="directs-reset-btn"
              >
                <i className="fa-solid fa-rotate-left" />
                Reset
              </button>
            )}
          </div>
        
          <div style={{ marginBottom: 12, color: "#ccc", fontSize: "0.9rem" }}>
            Total Count: {totalCount}
          </div>
          <AdminTable
            columns={columns}
            data={data}
            isLoading={isLoading && data.length === 0}
            error={error}
            emptyMessage="No direct referrals found."
            pagination={{
              enabled: true,
              pageSize,
              totalCount,
              currentPage,
              serverSide: true,
              onPageChange: setCurrentPage,
            }}
          />
        </div>
      </div>
    </>
  );
};
export default Directs;
