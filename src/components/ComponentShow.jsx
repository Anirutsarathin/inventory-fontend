// 📁 src/components/ComponentShow.jsx
import "../styles/component_show.css"; // ✅ นำเข้าไฟล์ CSS สำหรับตกแต่งตาราง
import { FiEdit, FiTrash2 } from "react-icons/fi"; // ✅ นำเข้า icon แก้ไขและลบจาก react-icons
import { useState, useMemo } from "react"; // ✅ ใช้ useState และ useMemo สำหรับจัดการ state และประสิทธิภาพ

// ✅ Component หลัก ใช้แสดงตารางข้อมูลทั่วไป พร้อม search / pagination / edit / delete
export default function ComponentShow({ data, columns, onAdd, onEdit, onDelete }) {
  // ---------------------------------------------------------------
  // 🔹 State & Constant
  // ---------------------------------------------------------------
  const [currentPage, setCurrentPage] = useState(1); // เก็บหน้าปัจจุบันของตาราง
  const [searchTerm, setSearchTerm] = useState(""); // เก็บคำค้นหา
  const rowsPerPage = 10; // จำนวนแถวต่อหน้า

  // ---------------------------------------------------------------
  // 🔹 filter & sort (useMemo เพื่อไม่คำนวณซ้ำเมื่อไม่จำเป็น)
  // ---------------------------------------------------------------
  const filteredData = useMemo(() => {
    return (
      data
        .slice() // clone array เพื่อไม่ให้กระทบต้นฉบับ
        .sort((a, b) => (a.name || "").localeCompare(b.name || "")) // เรียงตามชื่อ
        .filter(
          (row) =>
            // กรองเฉพาะข้อมูลที่มีคำค้นใน name หรือ position
            row.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            row.position?.toLowerCase().includes(searchTerm.toLowerCase())
        )
    );
  }, [data, searchTerm]); // ✅ จะรันใหม่เมื่อ data หรือ searchTerm เปลี่ยน

  // ---------------------------------------------------------------
  // 🔹 Pagination logic
  // ---------------------------------------------------------------
  const indexOfLast = currentPage * rowsPerPage; // index สุดท้ายของหน้า
  const indexOfFirst = indexOfLast - rowsPerPage; // index แรกของหน้า
  const currentData = filteredData.slice(indexOfFirst, indexOfLast); // ตัดข้อมูลเฉพาะหน้านั้น
  const totalPages = Math.ceil(filteredData.length / rowsPerPage); // จำนวนหน้าทั้งหมด

  // ---------------------------------------------------------------
  // 🔹 ส่วนแสดงผลหลัก
  // ---------------------------------------------------------------
  return (
    <div className="table-wrapper">
      {/* 🔸 Header (Search + Add) */}
      <div className="table-header">
        {/* กล่องค้นหา */}
        <div className="search-box">
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value); // อัปเดตคำค้น
              setCurrentPage(1); // กลับไปหน้าแรกเมื่อเปลี่ยนคำค้น
            }}
          />
        </div>

        {/* 🔸 ปุ่ม Add แสดงเฉพาะถ้ามีฟังก์ชัน onAdd */}
        {onAdd && (
          <button className="add-button" onClick={onAdd}>
            +
          </button>
        )}
      </div>

      {/* 🔸 ตารางข้อมูล */}
      <table className="custom-table">
        <thead>
          <tr>
            <th>NO</th>
            {/* สร้างหัวตารางจาก columns props */}
            {columns.map((col, idx) => (
              <th key={idx}>{col.Header}</th>
            ))}
            {/* 🔸 เงื่อนไข: แสดงเฉพาะเมื่อส่ง props มา */}
            {onEdit && <th>EDIT</th>}
            {onDelete && <th>DELETE</th>}
          </tr>
        </thead>

        <tbody>
          {/* 🔸 ถ้ามีข้อมูล */}
          {currentData.length > 0 ? (
            currentData.map((row, idx) => (
              <tr key={row.id || idx}>
                {/* ลำดับแถว */}
                <td>{indexOfFirst + idx + 1}</td>

                {/* วนแสดงค่าตาม columns ที่กำหนด */}
                {columns.map((col, cIdx) => (
                  <td key={cIdx}>{row[col.accessor]}</td>
                ))}

                {/* 🔸 ปุ่ม Edit (มี cursor pointer เพิ่ม) */}
                {onEdit && (
                  <td className="action-icons">
                    <FiEdit
                      title="Edit"
                      onClick={() => onEdit(row)}
                      style={{ cursor: "pointer" }} // ✅ เพิ่มมือชี้
                    />
                  </td>
                )}

                {/* 🔸 ปุ่ม Delete (มี cursor pointer เพิ่ม) */}
                {onDelete && (
                  <td className="action-icons">
                    <FiTrash2
                      title="Delete"
                      onClick={() => onDelete(row)}
                      style={{ cursor: "pointer" }} // ✅ เพิ่มมือชี้
                    />
                  </td>
                )}
              </tr>
            ))
          ) : (
            // 🔸 ถ้าไม่พบข้อมูล
            <tr>
              <td
                colSpan={columns.length + (onEdit ? 1 : 0) + (onDelete ? 1 : 0) + 1}
                style={{ textAlign: "center" }}
              >
                ❌ No results found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* 🔸 Pagination Controls */}
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
