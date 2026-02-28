interface Column {
  header: string;
  accessor: string;
}

interface AdminTableProps {
  columns: Column[];
  data: any[];
}

const AdminTable = ({ columns, data }: AdminTableProps) => {
  return (
    

        <>
            <div className="table-responsive">
          <table className="styled-table">
            <thead>
              <tr>
                {columns.map((col, index) => (
                  <th key={index}>{col.header}</th>
                ))}
              </tr>
            </thead>

            <tbody>
              {data.length > 0 ? (
                data.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {columns.map((col, colIndex) => (
                      <td key={colIndex}>
                        {row[col.accessor] as React.ReactNode}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={columns.length}
                    style={{
                      textAlign: "center",
                      padding: "3rem",
                      color: "#888",
                    }}
                  >
                    <div>
                      {/* <i
                        className="fas fa-users-slash"
                        style={{
                          fontSize: "2rem",
                          marginBottom: 10,
                          color: "var(--gold-dark)",
                        }}
                        
                      /> */}
                      <i className="fa-regular fa-calendar-xmark"
                        style={{
                          fontSize: "2rem",
                          marginBottom: 10,
                          color: "var(--gold-dark)",
                        }}
                      ></i>
                      <br />
                    </div>
                    No direct referrals found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination (Static for now) */}
        <div className="pagination-container">
          <div className="pagination-group">
            <button className="pagination-btn" disabled>
              <i className="fas fa-angle-double-left" />
            </button>
            <button className="pagination-btn" disabled>
              <i className="fas fa-angle-left" />
            </button>
            <span className="pagination-info">Page 0 of 0</span>
            <button className="pagination-btn" disabled>
              <i className="fas fa-angle-right" />
            </button>
            <button className="pagination-btn" disabled>
              <i className="fas fa-angle-double-right" />
            </button>
          </div>
        </div>
        </>
      
  );
};

export default AdminTable;
