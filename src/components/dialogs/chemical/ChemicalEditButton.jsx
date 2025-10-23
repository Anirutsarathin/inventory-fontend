import { useState, useEffect } from "react";
import Swal from "sweetalert2";

/**
 * 🧪 Component: ChemicalEditButton
 * - ดีไซน์เหมือนหน้า Edit Employee
 * - ใช้โทนชมพูพาสเทล ขอบบางๆ / ปุ่ม Save ชมพู / ปุ่ม Cancel เทา
 * - ปุ่ม Edit เป็นสีเขียว (consistent กับ theme หลัก)
 */
export default function ChemicalEditButton({ chemical, onEdited }) {
  const [showDialog, setShowDialog] = useState(false);
  const [form, setForm] = useState({ ...chemical });
  const [types, setTypes] = useState([]);
  const [expiryError, setExpiryError] = useState("");

  // โหลดประเภทสารเคมี
  useEffect(() => {
    if (showDialog) fetchTypes();
  }, [showDialog]);

  const fetchTypes = async () => {
    try {
      const token = localStorage.getItem("auth_token");
      const res = await fetch("http://localhost:3000/api/chemicals/types", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await res.json();
      if (res.ok) setTypes(result.types || []);
    } catch (err) {
      console.error("Fetch type error:", err);
    }
  };

  // ตรวจสอบวันหมดอายุ
  const validateExpiryDate = (dateStr) => {
    if (!dateStr) {
      setExpiryError("⚠️ กรุณาเลือกวันหมดอายุ");
      return false;
    }
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const expiry = new Date(dateStr);
    if (expiry < today) {
      setExpiryError("❌ วันหมดอายุย้อนหลังไม่ได้");
      return false;
    }
    setExpiryError("");
    return true;
  };

  // ฟังก์ชันบันทึก
  const handleSave = async () => {
    if (
      !form.chemical_name?.trim() ||
      !form.chemical_type?.trim() ||
      !form.quantity
    ) {
      Swal.fire({
        icon: "warning",
        title: "⚠️ โปรดกรอกข้อมูลให้ครบ",
        text: "ชื่อ, ประเภท และจำนวนห้ามเว้นว่าง",
        confirmButtonColor: "#f39c12",
      });
      return;
    }

    if (!validateExpiryDate(form.expiry_date)) {
      Swal.fire({
        icon: "error",
        title: "❌ วันหมดอายุไม่ถูกต้อง",
        text: expiryError || "กรุณาเลือกวันหมดอายุให้ถูกต้อง",
        confirmButtonColor: "#e74c3c",
      });
      return;
    }

    try {
      const token = localStorage.getItem("auth_token");
      const res = await fetch(
        `http://localhost:3000/api/chemicals/${chemical.chemical_id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            chemical_name: form.chemical_name,
            chemical_type: form.chemical_type,
            quantity: form.quantity,
            expiry_date: form.expiry_date,
          }),
        }
      );

      const result = await res.json();

      if (!res.ok) {
        Swal.fire({
          icon: "error",
          title: "❌ Update Failed",
          text: result.error || "เกิดข้อผิดพลาดจากเซิร์ฟเวอร์",
        });
        return;
      }

      Swal.fire({
        icon: "success",
        title: "✅ Updated Successfully!",
        text: `${form.chemical_name} ถูกอัปเดตเรียบร้อยแล้ว`,
        timer: 1500,
        showConfirmButton: false,
      });

      setShowDialog(false);
      onEdited?.();
    } catch (err) {
      console.error("Update error:", err);
      Swal.fire({
        icon: "error",
        title: "🚨 Server Error",
        text: "ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้",
      });
    }
  };

  // UI --------------------------------------------------------
  return (
    <>
      <button onClick={() => setShowDialog(true)} style={editBtn}>
        Edit
      </button>

      {showDialog && (
        <div style={overlay}>
          <div style={dialogBox}>
            <h2 style={title}>
              <span style={{ color: "#e75480" }}></span> Edit Chemical
            </h2>

            <div style={formGrid}>
              <div style={formGroup}>
                <label style={label}>ชื่อสารเคมี</label>
                <input
                  value={form.chemical_name}
                  onChange={(e) =>
                    setForm({ ...form, chemical_name: e.target.value })
                  }
                  style={input}
                  placeholder="Chemical Name"
                />
              </div>

              <div style={formGroup}>
                <label style={label}>ประเภทสารเคมี</label>
                <select
                  value={form.chemical_type}
                  onChange={(e) =>
                    setForm({ ...form, chemical_type: e.target.value })
                  }
                  style={input}
                >
                  <option value="">-- Select Type --</option>
                  {types.map((t, i) => (
                    <option key={i} value={t.type_name}>
                      {t.type_name}
                    </option>
                  ))}
                </select>
              </div>

              <div style={formGroup}>
                <label style={label}>จำนวน</label>
                <input
                  type="number"
                  value={form.quantity}
                  onChange={(e) =>
                    setForm({ ...form, quantity: e.target.value })
                  }
                  style={input}
                  min="1"
                  placeholder="Quantity"
                />
              </div>

              <div style={formGroup}>
                <label style={label}>วันหมดอายุ</label>
                <input
                  type="date"
                  value={form.expiry_date || ""}
                  onChange={(e) => {
                    setForm({ ...form, expiry_date: e.target.value });
                    validateExpiryDate(e.target.value);
                  }}
                  style={{
                    ...input,
                    border:
                      expiryError !== ""
                        ? "1.5px solid #ff9eb8"
                        : "1px solid #f3c2ce",
                  }}
                />
                {expiryError && (
                  <span style={errorText}>{expiryError}</span>
                )}
              </div>
            </div>

            {/* ปุ่ม Action */}
            <div style={buttonRow}>
              <button onClick={() => setShowDialog(false)} style={cancelBtn}>
                ยกเลิก
              </button>
              <button onClick={handleSave} style={saveBtn}>
                บันทึก
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

//
// 🎨 STYLE SECTION
//
const editBtn = {
  background: "#2e7d32",
  color: "#fff",
  padding: "2px 12px",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
  fontSize: "13px",
  fontWeight: "300",
};

const overlay = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  background: "rgba(0,0,0,0.4)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 999,
};

const dialogBox = {
  background: "#fff",
  borderRadius: "18px",
  padding: "30px 40px",
  width: "540px",
  boxShadow: "0 6px 25px rgba(0,0,0,0.2)",
};

const title = {
  textAlign: "center",
  fontSize: "22px",
  fontWeight: "700",
  color: "#333",
  marginBottom: "25px",
};

const formGrid = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "16px 20px",
};

const formGroup = {
  display: "flex",
  flexDirection: "column",
};

const label = {
  fontWeight: "600",
  color: "#333",
  fontSize: "13px",
  marginBottom: "5px",
};

const input = {
  padding: "8px 10px",
  border: "1px solid #f3c2ce", // ขอบชมพูพาสเทล
  borderRadius: "8px",
  fontSize: "14px",
  outline: "none",
  transition: "0.2s",
};

const buttonRow = {
  display: "flex",
  justifyContent: "flex-end",
  gap: "12px",
  marginTop: "30px",
};

const cancelBtn = {
  background: "#fff",
  border: "1px solid #ccc",
  borderRadius: "8px",
  padding: "8px 20px",
  fontSize: "14px",
  cursor: "pointer",
  fontWeight: "600",
  color: "#333",
};

const saveBtn = {
  background: "#ea6d85", // ชมพูพาสเทลเข้ม
  border: "none",
  borderRadius: "8px",
  padding: "8px 20px",
  fontSize: "14px",
  cursor: "pointer",
  color: "#fff",
  fontWeight: "600",
  transition: "0.2s",
};

const errorText = {
  color: "#e74c3c",
  fontSize: "12px",
  marginTop: "4px",
};
