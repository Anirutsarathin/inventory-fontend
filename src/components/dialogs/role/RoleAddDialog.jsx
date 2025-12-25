import { useMemo, useState } from "react";
import Swal from "sweetalert2";

/**
 * 🌸 Component: RoleAddDialog
 * หน้าที่:
 *  - เพิ่มสิทธิ์ (Role) ให้กับตำแหน่งใหม่
 *  - ผู้ใช้เลือกตำแหน่ง + หน้าที่เข้าถึงได้
 *  - แสดงผลสำเร็จด้วย SweetAlert2
 *
 * Props:
 *  @param {array} positions - รายชื่อตำแหน่งทั้งหมด
 *  @param {array} pages - รายการหน้าในระบบ
 *  @param {function} onClose - ปิด Dialog
 *  @param {function} onSuccess - callback หลังบันทึกสำเร็จ
 */
export default function RoleAddDialog({ positions, pages, onClose, onSuccess }) {
  const [positionId, setPositionId] = useState("");
  const [selected, setSelected] = useState({});

  // ✅ เตรียมข้อมูลรายการหน้า
  const pageList = useMemo(() => pages || [], [pages]);

  // ✅ toggle เมื่อคลิก checkbox
  const toggle = (pid) =>
    setSelected((prev) => ({ ...prev, [pid]: !prev[pid] }));

  // ----------------------------------------------------------
  // ✅ ฟังก์ชันบันทึกข้อมูล
  // ----------------------------------------------------------
  const handleSave = async () => {
    // ตรวจสอบว่าผู้ใช้เลือกครบหรือยัง
    if (!positionId) {
      Swal.fire({
        icon: "warning",
        title: "⚠️ โปรดเลือกตำแหน่ง",
        text: "กรุณาเลือกตำแหน่งก่อนดำเนินการ",
        confirmButtonColor: "#f39c12",
      });
      return;
    }

    const selectedPageIds = Object.keys(selected)
      .filter((k) => selected[k])
      .map((k) => Number(k));

    if (selectedPageIds.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "⚠️ โปรดเลือกหน้า",
        text: "กรุณาเลือกหน้าอย่างน้อย 1 หน้า",
        confirmButtonColor: "#f39c12",
      });
      return;
    }

    try {
      const token = localStorage.getItem("auth_token");

      // เพิ่มสิทธิ์ทีละหน้า
      for (const page_id of selectedPageIds) {
        await fetch("http://localhost:3000/api/permissions/add", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ position_id: Number(positionId), page_id }),
        });
      }

      // ✅ แสดงผลสำเร็จ
      Swal.fire({
        icon: "success",
        title: "✅ Add Role Success!",
        text: "สิทธิ์ของตำแหน่งถูกบันทึกเรียบร้อยแล้ว",
        timer: 1800,
        showConfirmButton: false,
      });

      onSuccess?.();
      onClose?.();
    } catch (err) {
      console.error("Add permission error:", err);
      Swal.fire({
        icon: "error",
        title: "❌ Add Role Fail ",
        text: "ไม่สามารถเพิ่มสิทธิ์ได้ กรุณาลองใหม่อีกครั้ง",
        confirmButtonColor: "#e74c3c",
      });
    }
  };

  // ----------------------------------------------------------
  // ✅ ส่วนของ UI
  // ----------------------------------------------------------
  return (
    <div style={overlayStyle}>
      <div style={dialogStyle}>
        {/* 🔹 หัวข้อ */}
        <h3 style={titleStyle}>➕ Add Role</h3>

        {/* 🔹 เลือกตำแหน่ง */}
        <div style={{ textAlign: "left", marginBottom: "10px" }}>
          <label style={labelStyle}>Position</label>
          <select
            value={positionId}
            onChange={(e) => setPositionId(e.target.value)}
            style={inputStyle}
          >
            <option value="">-- Select Position --</option>
            {(positions || []).map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        <hr style={{ border: "0.5px solid #f7c9d8", margin: "12px 0" }} />

        {/* 🔹 รายการหน้า (Checkbox list) */}
        <div
          style={{
            textAlign: "left",
            maxHeight: 220,
            overflowY: "auto",
            paddingRight: 4,
          }}
        >
          {pageList.map((pg) => (
            <label
              key={pg.page_id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                margin: "6px 0",
                fontSize: "14px",
              }}
            >
              <input
                type="checkbox"
                checked={!!selected[pg.page_id]}
                onChange={() => toggle(pg.page_id)}
                style={{
                  accentColor: "#e46a84", // ✅ Checkbox สีชมพู
                  width: "16px",
                  height: "16px",
                }}
              />
              {pg.page_name}
            </label>
          ))}
        </div>

        {/* 🔘 ปุ่ม Action */}
        <div style={actionRow}>
          <button onClick={onClose} style={cancelBtn}>
            ยกเลิก
          </button>
          <button onClick={handleSave} style={saveBtn}>
            บันทึก
          </button>
        </div>
      </div>
    </div>
  );
}

//
// 🎨 STYLE SECTION (โทนชมพูพาสเทล)
//

// พื้นหลังโปร่งดำ
const overlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  background: "rgba(0, 0, 0, 0.5)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1000,
};

// กล่อง Dialog หลัก
const dialogStyle = {
  background: "#fff",
  borderRadius: "14px",
  padding: "24px 28px",
  width: "420px",
  boxShadow: "0 8px 25px rgba(0,0,0,0.25)",
};

// หัวข้อ
const titleStyle = {
  textAlign: "center",
  color: "#d63384", // ชมพูเข้ม
  fontWeight: "700",
  fontSize: "18px",
  marginBottom: "12px",
};

// Label
const labelStyle = {
  fontSize: "13px",
  fontWeight: "600",
  color: "#333",
};

// ช่อง input / select
const inputStyle = {
  width: "100%",
  padding: "10px",
  borderRadius: "8px",
  border: "1px solid #f7c9d8", // ขอบชมพูอ่อน
  fontSize: "14px",
  outline: "none",
  transition: "0.2s",
};

// Action Row
const actionRow = {
  display: "flex",
  justifyContent: "flex-end",
  gap: "10px",
  marginTop: "18px",
};

// ปุ่ม Cancel
const cancelBtn = {
  padding: "8px 14px",
  borderRadius: "8px",
  border: "1px solid #ccc",
  background: "#f9f9f9",
  cursor: "pointer",
  fontWeight: "600",
  fontSize: "13px",
};

// ปุ่ม Save (ชมพู Gradient)
const saveBtn = {
  padding: "8px 14px",
  border: "none",
  borderRadius: "8px",
  background: "linear-gradient(90deg, #ff9eb8, #ff5d8f)",
  color: "#fff",
  fontWeight: "600",
  cursor: "pointer",
  fontSize: "13px",
  transition: "0.2s",
};
