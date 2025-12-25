import { useState, useEffect } from "react";
import Swal from "sweetalert2";

export default function EmployeeEditDialog({ row, onClose, onSuccess }) {
  // ✅ โหลดข้อมูลพนักงานเดิม พร้อมค่า default กัน undefined
  const [form, setForm] = useState({
    id: row?.id || "",
    first_name: row?.first_name || "",
    last_name: row?.last_name || "",
    phone: row?.phone || "",
    position_id: row?.position_id || "",
    status: row?.status ?? 1,
  });

  const [positions, setPositions] = useState([]);
  const [loading, setLoading] = useState(false);

  // ✅ โหลดข้อมูลตำแหน่งจาก API
  useEffect(() => {
    const fetchPositions = async () => {
      try {
        const token = localStorage.getItem("auth_token");
        const res = await fetch("http://localhost:3000/api/employees/position", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const result = await res.json();
        setPositions(result.employees || []);
      } catch (err) {
        console.error("Fetch positions error:", err);
      }
    };
    fetchPositions();
  }, []);

  // ✅ ตรวจสอบข้อมูลก่อนบันทึก
  const validateForm = () => {
    if (!form.first_name.trim() || !form.last_name.trim())
      return "กรุณากรอกชื่อ-นามสกุลให้ครบ";
    if (!form.phone.trim() || form.phone.length < 9)
      return "กรุณากรอกเบอร์โทรให้ถูกต้อง";
    if (!form.position_id) return "กรุณาเลือกตำแหน่ง";
    return null;
  };

  // ✅ ฟังก์ชันอัปเดตข้อมูล
  const handleSave = async () => {
    const error = validateForm();
    if (error) {
      Swal.fire({
        icon: "warning",
        title: "⚠️ ข้อมูลไม่ครบ",
        text: error,
        confirmButtonColor: "#ff4a74",
      });
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("auth_token");
      const res = await fetch(`http://localhost:3000/api/employees/${form.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });
      const result = await res.json();

      if (res.ok) {
        Swal.fire({
          icon: "success",
          title: "Update employee Success!",
          text: `${form.first_name} ${form.last_name} ถูกอัปเดตเรียบร้อย`,
          showConfirmButton: false,
          timer: 1800,
        });

        onSuccess({
          ...form,
          status_label: form.status === 1 ? "ACTIVE" : "INACTIVE",
        });
        onClose();
      } else {
        Swal.fire({
          icon: "error",
          title: "❌ Update employee Fail ",
          text: result.error || "เกิดข้อผิดพลาดจากเซิร์ฟเวอร์",
          confirmButtonColor: "#ff4a74",
        });
      }
    } catch (err) {
      console.error("Update error:", err);
      Swal.fire({
        icon: "error",
        title: "🚨 Server Error",
        text: "ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้",
      });
    } finally {
      setLoading(false);
    }
  };

  // ✅ UI Dialog
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: "12px",
          width: "50%",
          maxWidth: "600px",
          padding: "24px",
          boxShadow: "0 8px 20px rgba(0,0,0,0.25)",
        }}
      >
        <h3
          style={{
            textAlign: "center",
            marginBottom: "20px",
            color: "#444",
            fontWeight: "bold",
          }}
        >
          ✏️ Edit Employee
        </h3>

        {/* ✅ ฟอร์มแบบ 2 คอลัมน์ */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "16px 20px",
          }}
        >
          {/* คอลัมน์ซ้าย */}
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <label style={labelStyle}>First Name</label>
            <input
              value={form.first_name}
              onChange={(e) => setForm({ ...form, first_name: e.target.value })}
              style={inputStyle}
            />

            <label style={labelStyle}>Last Name</label>
            <input
              value={form.last_name}
              onChange={(e) => setForm({ ...form, last_name: e.target.value })}
              style={inputStyle}
            />
          </div>

          {/* คอลัมน์ขวา */}
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <label style={labelStyle}>Phone</label>
            <input
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              style={inputStyle}
            />

            <label style={labelStyle}>Position</label>
            <select
              value={form.position_id}
              onChange={(e) =>
                setForm({ ...form, position_id: Number(e.target.value) })
              }
              style={inputStyle}
            >
              <option value="">-- Select Position --</option>
              {positions.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>

            <label style={labelStyle}>Status</label>
            <select
              value={form.status}
              onChange={(e) =>
                setForm({ ...form, status: Number(e.target.value) })
              }
              style={inputStyle}
            >
              <option value={1}>ACTIVE</option>
              <option value={0}>INACTIVE</option>
            </select>
          </div>
        </div>

        {/* ปุ่ม Action */}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginTop: "24px",
            gap: "10px",
          }}
        >
          <button
            style={cancelBtn}
            onClick={onClose}
            disabled={loading}
          >
            ยกเลิก
          </button>
          <button
            style={saveBtn}
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? "Saving..." : "บันทึก"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ✅ CSS inline style
const inputStyle = {
  width: "100%",
  padding: "10px",
  borderRadius: "8px",
  border: "1px solid #f8b4c4",
  fontSize: "14px",
  transition: "border 0.2s ease, box-shadow 0.2s ease",
};
const labelStyle = {
  fontSize: "13px",
  color: "#666",
  fontWeight: "bold",
  marginBottom: "4px",
};
const cancelBtn = {
  padding: "8px 14px",
  border: "1px solid #ccc",
  borderRadius: "8px",
  background: "#f9f9f9",
  cursor: "pointer",
};
const saveBtn = {
  padding: "8px 14px",
  border: "none",
  borderRadius: "8px",
  background: "#ff4a74",
  color: "#fff",
  cursor: "pointer",
  fontWeight: "bold",
};
