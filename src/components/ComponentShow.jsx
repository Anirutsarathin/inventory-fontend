import "../styles/component_show.css";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { useState, useMemo } from "react";

export default function ComponentShow({ data, columns }) {
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 13;
  const [searchTerm, setSearchTerm] = useState("");

  // ✅ Sort + Filter
  const filteredData = useMemo(() => {
    return (
      data
        // sort asc ตาม name
        .slice()
        .sort((a, b) => a.name.localeCompare(b.name))
        // filter เฉพาะ name และ type
        .filter(
          (row) =>
            row.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            row.type?.toLowerCase().includes(searchTerm.toLowerCase())
        )
    );
  }, [data, searchTerm]);

  // ✅ Pagination
  const indexOfLast = currentPage * rowsPerPage;
  const indexOfFirst = indexOfLast - rowsPerPage;
  const currentData = filteredData.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  return (
    <div className="table-wrapper">
      {/* Search Box */}
    <div className="table-header">
  {/* กล่อง search อยู่ด้านซ้าย */}
  <div className="search-box">
    <input
      type="text"
      placeholder="Search name or type..."
      value={searchTerm}
      onChange={(e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
      }}
    />
  </div>

  {/* ปุ่ม Add อยู่ด้านขวา */}
  <button
    className="add-button"
    onClick={() => alert("Add new item")}
  >
    +
  </button>
</div>

      <table className="custom-table">
        <thead>
          <tr>
            <th>NO</th>
            {columns.map((col, idx) => (
              <th key={idx}>{col.Header}</th>
            ))}
            <th>EDIT</th>
            <th>DELETE</th>
          </tr>
        </thead>
        <tbody>
          {currentData.length > 0 ? (
            currentData.map((row, idx) => (
              <tr key={idx}>
                <td>{indexOfFirst + idx + 1}</td>
                {columns.map((col, cIdx) => (
                  <td key={cIdx}>{row[col.accessor]}</td>
                ))}
                <td className="action-icons">
                  <FiEdit title="Edit" />
                </td>
                <td className="action-icons">
                  <FiTrash2 title="Delete" />
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length + 3} style={{ textAlign: "center" }}>
                ❌ No results found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="pagination">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((p) => p - 1)}
        >
          &lt; Prev
        </button>
        <span>
          Page {currentPage} of {totalPages || 1}
        </span>
        <button
          disabled={currentPage === totalPages || totalPages === 0}
          onClick={() => setCurrentPage((p) => p + 1)}
        >
          Next &gt;
        </button>
      </div>
    </div>
  );
}
