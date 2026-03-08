import { useEffect, useMemo, useState } from "react";
import "animate.css";

interface Column {
  header: string;
  accessor: string;
}

interface PaginationConfig {
  enabled?: boolean;
  pageSize?: number;
  totalCount?: number;
  currentPage?: number;
  onPageChange?: (page: number) => void;
  serverSide?: boolean;
}

interface AdminTableProps {
  columns: Column[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any[];
  isLoading?: boolean;
  error?: string | null;
  emptyMessage?: string;
  pagination?: PaginationConfig;
}

const AdminTable = ({
  columns,
  data,
  isLoading = false,
  error = null,
  emptyMessage = "No records found.",
  pagination,
}: AdminTableProps) => {
  const isPaginationEnabled = pagination?.enabled !== false;
  const pageSize = Math.max(1, pagination?.pageSize ?? 10);
  const [localCurrentPage, setLocalCurrentPage] = useState(1);
  const isServerSide = Boolean(pagination?.serverSide || pagination?.onPageChange);
  const currentPage = isServerSide
    ? Math.max(1, pagination?.currentPage ?? 1)
    : localCurrentPage;

  const effectiveTotalCount = useMemo(() => {
    if (!isPaginationEnabled) return data?.length ?? 0;
    if (isServerSide) return Math.max(0, pagination?.totalCount ?? 0);
    return data?.length ?? 0;
  }, [data?.length, isPaginationEnabled, isServerSide, pagination?.totalCount]);

  const totalPages = useMemo(() => {
    if (!isPaginationEnabled) return 1;
    return Math.max(1, Math.ceil(effectiveTotalCount / pageSize));
  }, [effectiveTotalCount, isPaginationEnabled, pageSize]);

  const paginatedData = useMemo(() => {
    if (!isPaginationEnabled || isServerSide) return data;
    const safePage = Math.min(currentPage, totalPages);
    const start = (safePage - 1) * pageSize;
    return data.slice(start, start + pageSize);
  }, [currentPage, data, isPaginationEnabled, isServerSide, pageSize, totalPages]);

  useEffect(() => {
    if (!isServerSide && currentPage > totalPages) {
      setLocalCurrentPage(totalPages);
    }
  }, [currentPage, isServerSide, totalPages]);

  const canGoPrev = currentPage > 1;
  const canGoNext = currentPage < totalPages;

  const updatePage = (page: number) => {
    const safePage = Math.min(Math.max(1, page), totalPages);
    if (isServerSide) {
      pagination?.onPageChange?.(safePage);
      return;
    }
    setLocalCurrentPage(safePage);
  };

  const gotoFirstPage = () => updatePage(1);
  const gotoPrevPage = () => updatePage(currentPage - 1);
  const gotoNextPage = () => updatePage(currentPage + 1);
  const gotoLastPage = () => updatePage(totalPages);

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

            <tbody
              key={`tbody-page-${currentPage}`}
              className="animate__animated animate__fadeIn animate__faster"
            >
              {isLoading ? (
                <tr>
                  <td
                    colSpan={columns.length}
                    style={{
                      textAlign: "center",
                      padding: "2rem",
                      color: "#888",
                    }}
                  >
                    Loading...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td
                    colSpan={columns.length}
                    style={{
                      textAlign: "center",
                      padding: "2rem",
                      color: "#ff9f9f",
                    }}
                  >
                    {error}
                  </td>
                </tr>
              ) : paginatedData.length > 0 ? (
                paginatedData.map((row, rowIndex) => (
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
                      <i className="fa-regular fa-calendar-xmark"
                        style={{
                          fontSize: "2rem",
                          marginBottom: 10,
                          color: "var(--gold-dark)",
                        }}
                      ></i>
                      <br />
                    </div>
                    {emptyMessage}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
      </div>

      {isPaginationEnabled && (
        <div className="pagination-container">
          <div className="pagination-group">
            <button className="pagination-btn" disabled={!canGoPrev} onClick={gotoFirstPage}>
              <i className="fas fa-angle-double-left" />
            </button>
            <button className="pagination-btn" disabled={!canGoPrev} onClick={gotoPrevPage}>
              <i className="fas fa-angle-left" />
            </button>
            <span className="pagination-info">
              Page {Math.min(currentPage, totalPages)} of {totalPages}
            </span>
            <button className="pagination-btn" disabled={!canGoNext} onClick={gotoNextPage}>
              <i className="fas fa-angle-right" />
            </button>
            <button className="pagination-btn" disabled={!canGoNext} onClick={gotoLastPage}>
              <i className="fas fa-angle-double-right" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminTable;
