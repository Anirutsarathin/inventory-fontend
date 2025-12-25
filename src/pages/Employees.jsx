import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import ComponentShow from "../components/ComponentShow";
import EmployeeAddDialog from "../components/dialogs/employees/EmployeeAddDialog";
import EmployeeEditDialog from "../components/dialogs/employees/EmployeeEditDialog";
import EmployeeDeleteDialog from "../components/dialogs/employees/EmployeeDeleteDialog";

/**
 * 🔹 หน้าจัดการพนักงาน (Employees)
 * หน้าที่: แสดงตารางรายชื่อพนักงาน + จัดการข้อมูล เพิ่ม / แก้ไข / ลบ
 */
export default function Employees() {
  // ✅ STATE
  const [data, setData] = useState([]);
  const [error, setError] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [editRow, setEditRow] = useState(null);
  const [deleteRow, setDeleteRow] = useState(null);

  // ----------------------------------------------------
  // ✅ ฟังก์ชันโหลดข้อมูลพนักงาน (ใช้ซ้ำได้)
  // ----------------------------------------------------
  const fetchEmployees = async () => {
    try {
      const token = localStorage.getItem("auth_token");
      if (!token) {
        setError("No token found, please login.");
        return;
      }

      const res = await fetch("http://localhost:3000/api/employees", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await res.json();

      if (!res.ok) {
        setError(result.error || "Failed to fetch employees");
        return;
      }

      const mappedData = (result.employees || []).map((e) => ({
        id: e.employee_id,
        first_name: e.first_name,
        last_name: e.last_name,
        name: e.name,
        position_id: e.position_id,
        position: e.position,
        phone: e.phone,
        status: e.status,
        status_label: e.status_label,
      }));

      setData(mappedData);
    } catch (err) {
      console.error("Fetch employees error:", err);
      setError("Server error, please try again later.");
    }
  };

  // ----------------------------------------------------
  // ✅ โหลดข้อมูลเมื่อเปิดหน้า
  // ----------------------------------------------------
  useEffect(() => {
    fetchEmployees();
  }, []);

  // ----------------------------------------------------
  // ✅ คอลัมน์ของตาราง
  // ----------------------------------------------------
  const columns = [
    { Header: "Name", accessor: "name" },
    { Header: "Position", accessor: "position" },
    { Header: "Phone", accessor: "phone" },
    { Header: "Status", accessor: "status_label" },
  ];

  // ----------------------------------------------------
  // ✅ ฟังก์ชันลบข้อมูลพนักงาน (แบบรีเฟรชข้อมูลใหม่ทุกครั้ง)
  // ----------------------------------------------------
  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("auth_token");
      const res = await fetch(`http://localhost:3000/api/employees/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const result = await res.json();

      if (res.ok) {
        Swal.fire({
          icon: "success",
          title: "✅ ลบข้อมูลสำเร็จ!",
          text: result.message || "พนักงานถูกลบเรียบร้อยแล้ว",
          timer: 1500,
          showConfirmButton: false,
        });

        // ✅ โหลดข้อมูลใหม่จากฐานจริง (เหมือน refresh)
        await fetchEmployees();
      } else {
        Swal.fire({
          icon: "error",
          title: "❌ ลบไม่สำเร็จ",
          text: result.error || "เกิดข้อผิดพลาดจากเซิร์ฟเวอร์",
        });
      }
    } catch (err) {
      console.error("Delete Error:", err);
      Swal.fire({
        icon: "error",
        title: "🚨 Server Error",
        text: "ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้",
      });
    }
  };

  // ----------------------------------------------------
  // ✅ UI หลัก
  // ----------------------------------------------------
  return (
    <div className="table-container">
      <div className="rectangle">
        {error ? (
          <p className="error">{error}</p>
        ) : (
          <>
            {/* ตารางพนักงาน */}
            <ComponentShow
              data={data}
              columns={columns}
              onAdd={() => setShowAdd(true)}
              onEdit={(row) => setEditRow(row)}
              onDelete={(row) => setDeleteRow(row)}
            />

            {/* Dialog เพิ่มพนักงาน */}
            {showAdd && (
              <EmployeeAddDialog
                onClose={() => setShowAdd(false)}
                onSuccess={() => fetchEmployees()} // ✅ รีโหลดข้อมูลใหม่ทุกครั้งหลังเพิ่ม
              />
            )}

            {/* Dialog แก้ไขพนักงาน */}
            {editRow && (
              <EmployeeEditDialog
                row={editRow}
                onClose={() => setEditRow(null)}
                onSuccess={() => fetchEmployees()} // ✅ รีโหลดข้อมูลใหม่ทุกครั้งหลังแก้ไข
              />
            )}

            {/* Dialog ลบพนักงาน */}
            {deleteRow && (
              <EmployeeDeleteDialog
                row={deleteRow}
                onClose={() => setDeleteRow(null)}
                onConfirm={handleDelete} // ✅ รีโหลดข้อมูลใหม่หลังลบ
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}
