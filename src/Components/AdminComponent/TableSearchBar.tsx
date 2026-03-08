interface SearchOption {
  value: string;
  label: string;
}

interface TableSearchBarProps {
  searchType: string;
  searchValue: string;
  searchOptions: SearchOption[];
  onSearchTypeChange: (value: string) => void;
  onSearchValueChange: (value: string) => void;
  onSearch: () => void;
  onClear: () => void;
}

const TableSearchBar = ({
  searchType,
  searchValue,
  searchOptions,
  onSearchTypeChange,
  onSearchValueChange,
  onSearch,
  onClear,
}: TableSearchBarProps) => {
  const selectedLabel =
    searchOptions.find((option) => option.value === searchType)?.label ?? "Value";
  const fieldStyle = {
    width: "100%",
    height: 40,
    background: "rgba(12, 12, 12, 0.85)",
    color: "#f5f5f5",
    border: "1px solid rgba(255,255,255,0.18)",
    borderRadius: 8,
    padding: "0 12px",
    outline: "none",
  };

  return (
    <div
      style={{
        display: "flex",
        gap: 12,
        alignItems: "end",
        marginBottom: 16,
        flexWrap: "wrap",
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 10,
        padding: 12,
      }}
    >
      <div style={{ minWidth: 170 }}>
        <label style={{ display: "block", marginBottom: 6, fontSize: "0.8rem", color: "#d4d4d4" }}>
          Search Type
        </label>
        <select
          className="custom-input admin-select"
          style={{ width: "100%", minWidth: 170 }}
          value={searchType}
          onChange={(e) => onSearchTypeChange(e.target.value)}
        >
          {searchOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div style={{ flex: 1, minWidth: 240 }}>
        <label style={{ display: "block", marginBottom: 6, fontSize: "0.8rem", color: "#d4d4d4" }}>
          Search Value
        </label>
        <input
          type="text"
          className="custom-input"
          style={fieldStyle}
          placeholder={`Search by ${selectedLabel}`}
          value={searchValue}
          onChange={(e) => onSearchValueChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") onSearch();
          }}
        />
      </div>

      <button
        type="button"
        className="btn-update"
        style={{ padding: "9px 16px", fontSize: "0.8rem", height: 40 }}
        onClick={onSearch}
      >
        Search
      </button>
      <button
        type="button"
        className="btn-update"
        style={{ padding: "9px 16px", fontSize: "0.8rem", height: 40 }}
        onClick={onClear}
      >
        Clear
      </button>
    </div>
  );
};

export default TableSearchBar;

