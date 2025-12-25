

// 📁 src/components/ComponentShow.jsx
import "../styles/component_show.css";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { useState, useMemo } from "react";

/**
 * 🔹 ComponentShow (Reusable Table)
 * ใช้แสดงตารางข้อมูลพร้อม Search + Pagination + ปุ่ม Add/Edit/Delete (ตาม props)
 *
 * ✅ รองรับการส่ง rowsPerPage (จำนวนข้อมูลต่อหน้า)
 * ✅ สามารถค้นหาทุกคอลัมน์
 * ✅ ใช้ได้ทุกหน้า เช่น Employees, History, Chemical
 */
export default function ComponentShow({
  data = [],
  columns = [],
  onAdd,
  onEdit,
  onDelete,
  rowsPerPage = 10, // 🧮 ค่าเริ่มต้น = 10 แถวต่อหน้า (สามารถส่งค่าใหม่จากหน้าอื่นได้)
}) {
  // ---------------------------------------------------------------
  // 🔹 State
  // ---------------------------------------------------------------
  const [currentPage, setCurrentPage] = useState(1); // หน้าแสดงผลปัจจุบัน
  const [searchTerm, setSearchTerm] = useState(""); // คำค้นหาในช่อง search

  // ---------------------------------------------------------------
  // 🔹 Filter + Search + Sort
  // ---------------------------------------------------------------
  const filteredData = useMemo(() => {
    if (!data || data.length === 0) return [];

    return (
      data
        .slice()
        // 🔸 เรียงตามชื่อถ้ามี field name
        .sort((a, b) => {
          if (a.name && b.name) return a.name.localeCompare(b.name);
          return 0;
        })
        // 🔸 กรองทุกคอลัมน์ตามคำค้น
        .filter((row) => {
          if (!searchTerm) return true;
          const allValues = Object.values(row)
            .join(" ")
            .toLowerCase();
          return allValues.includes(searchTerm.toLowerCase());
        })
    );
  }, [data, searchTerm]);

  // ---------------------------------------------------------------
  // 🔹 Pagination Logic
  // ---------------------------------------------------------------
  const totalPages = Math.ceil(filteredData.length / rowsPerPage) || 1;
  const indexOfLast = currentPage * rowsPerPage;
  const indexOfFirst = indexOfLast - rowsPerPage;
  const currentData = filteredData.slice(indexOfFirst, indexOfLast);

  // ---------------------------------------------------------------
  // 🔹 Rendering UI
  // ---------------------------------------------------------------
  return (
    <div className="table-wrapper">
      {/* ========================= Header ========================= */}
      <div className="table-header">
        {/* 🔍 ช่อง Search */}
        <div className="search-box">
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // รีเซ็ตไปหน้าแรกเมื่อเปลี่ยนคำค้น
            }}
          />
        </div>

        {/* ➕ ปุ่ม Add (แสดงเฉพาะเมื่อมี onAdd ส่งมา) */}
        {onAdd && (
          <button className="add-button" onClick={onAdd}>
            +
          </button>
        )}
      </div>

      {/* ========================= Table ========================= */}
      <table className="custom-table">
        <thead>
          <tr>
            <th>No</th>
            {/* วนหัวคอลัมน์จาก columns ที่ส่งมา */}
            {columns.map((col, idx) => (
              <th key={idx}>{col.Header}</th>
            ))}
            {onEdit && <th>Edit</th>}
            {onDelete && <th>Delete</th>}
          </tr>
        </thead>

        <tbody>
          {/* ✅ ถ้ามีข้อมูล */}
          {currentData.length > 0 ? (
            currentData.map((row, idx) => (
              <tr key={row.id || row.HistoryID || idx}>
                {/* ลำดับแถว */}
                <td>{indexOfFirst + idx + 1}</td>

                {/* ข้อมูลแต่ละคอลัมน์ */}
                {columns.map((col, cIdx) => (
                  <td key={cIdx}>{row[col.accessor]}</td>
                ))}

                {/* ✏️ ปุ่ม Edit */}
                {onEdit && (
                  <td className="action-icons">
                    <FiEdit
                      title="Edit"
                      onClick={() => onEdit(row)}
                      style={{ cursor: "pointer" }}
                    />
                  </td>
                )}

                {/* 🗑️ ปุ่ม Delete */}
                {onDelete && (
                  <td className="action-icons">
                    <FiTrash2
                      title="Delete"
                      onClick={() => onDelete(row)}
                      style={{ cursor: "pointer" }}
                    />
                  </td>
                )}
              </tr>
            ))
          ) : (
            // ❌ ถ้าไม่พบข้อมูล
            <tr>
              <td
                colSpan={columns.length + (onEdit ? 1 : 0) + (onDelete ? 1 : 0) + 1}
                style={{ textAlign: "center", color: "#888" }}
              >
                ❌ No results found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* ========================= Pagination ========================= */}
      <div className="pagination">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((p) => p - 1)}
        >
          &lt; Prev
        </button>

        <span>
          Page {currentPage} of {totalPages}
        </span>

        <button
          disabled={currentPage === totalPages || totalPages === 0}
          onClick={() => setCurrentPage((p) => p + 1)}
        >
          Next &gt;
        </button>
      </div>

      {/* ========================= Footer Info ========================= */}
      <div
        style={{
          textAlign: "center",
          fontSize: "12px",
          color: "#666",
          marginTop: "5px",
        }}
      >
        {/* Showing {currentData.length} / {filteredData.length} records */}
      </div>
    </div>
  );
}
