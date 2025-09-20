import "../styles/component_show.css";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { useState, useMemo } from "react";

export default function ComponentShow({ data, columns, onAdd, onEdit, onDelete }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const rowsPerPage = 10;

  // ✅ filter & sort
  const filteredData = useMemo(() => {
    return (
      data
        .slice()
        .sort((a, b) => (a.name || "").localeCompare(b.name || ""))
        .filter(
          (row) =>
            row.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            row.position?.toLowerCase().includes(searchTerm.toLowerCase())
        )
    );
  }, [data, searchTerm]);

  // ✅ pagination
  const indexOfLast = currentPage * rowsPerPage;
  const indexOfFirst = indexOfLast - rowsPerPage;
  const currentData = filteredData.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  return (
    <div className="table-wrapper">
      {/* Header (Search + Add) */}
      <div className="table-header">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>

        {/* ✅ แสดงปุ่ม Add เฉพาะถ้ามี onAdd */}
        {onAdd && (
          <button className="add-button" onClick={onAdd}>
            +
          </button>
        )}
      </div>

      <table className="custom-table">
        <thead>
          <tr>
            <th>NO</th>
            {columns.map((col, idx) => (
              <th key={idx}>{col.Header}</th>
            ))}
            {/* ✅ เงื่อนไข แสดงเฉพาะเมื่อส่ง props มา */}
            {onEdit && <th>EDIT</th>}
            {onDelete && <th>DELETE</th>}
          </tr>
        </thead>
        <tbody>
          {currentData.length > 0 ? (
            currentData.map((row, idx) => (
              <tr key={row.id || idx}>
                <td>{indexOfFirst + idx + 1}</td>
                {columns.map((col, cIdx) => (
                  <td key={cIdx}>{row[col.accessor]}</td>
                ))}
                {/* ✅ เงื่อนไข แสดงเฉพาะเมื่อส่ง props มา */}
                {onEdit && (
                  <td className="action-icons">
                    <FiEdit title="Edit" onClick={() => onEdit(row)} />
                  </td>
                )}
                {onDelete && (
                  <td className="action-icons">
                    <FiTrash2 title="Delete" onClick={() => onDelete(row)} />
                  </td>
                )}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length + (onEdit ? 1 : 0) + (onDelete ? 1 : 0) + 1} style={{ textAlign: "center" }}>
                ❌ No results found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="pagination">
        <button disabled={currentPage === 1} onClick={() => setCurrentPage((p) => p - 1)}>
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
