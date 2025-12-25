import { useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";

/**
 * 🌸 Component: RoleEditDialog
 * หน้าที่:
 *   - ใช้แก้ไขสิทธิ์ (Role Permission) ของตำแหน่งงาน
 *   - แสดง checkbox ให้ติ๊กเลือกสิทธิ์ที่ต้องการ
 *   - ดีไซน์โทนชมพูพาสเทล + SweetAlert2 popup เมื่ออัปเดตสำเร็จ
 */
export default function RoleEditDialog({ row, pages, onClose, onSuccess }) {
  // ----------------------------------------------------------
  // ✅ STATE & INITIAL SETUP
  // ----------------------------------------------------------
  const pageList = useMemo(() => pages || [], [pages]);

  // ✅ แปลงสิทธิ์จาก row ให้เป็น selected map
  const initialSelected = useMemo(() => {
    const map = {};
    pageList.forEach((pg) => {
      const nm = pg.page_name || "";
      const yes =
        (nm.includes("Dashboard") && row.dashboard === "✅") ||
        (nm.includes("Chemical") && row.chemical === "✅") ||
        (nm.includes("Document") && row.document === "✅") ||
        (nm.includes("Approval") && row.approve === "✅") ||
        (nm.includes("Admin") && row.admin === "✅");
      map[pg.page_id] = !!yes;
    });
    return map;
  }, [pageList, row]);

  const [selected, setSelected] = useState(initialSelected);

  useEffect(() => setSelected(initialSelected), [initialSelected]);

  // ✅ toggle checkbox
  const toggle = (pid) =>
    setSelected((prev) => ({ ...prev, [pid]: !prev[pid] }));

  // ----------------------------------------------------------
  // ✅ บันทึกข้อมูลสิทธิ์ใหม่
  // ----------------------------------------------------------
  const handleSave = async () => {
    const position_id = row.id;
    const selectedPageIds = Object.keys(selected)
      .filter((k) => selected[k])
      .map((k) => Number(k));

    try {
      const token = localStorage.getItem("auth_token");

      // 🔹 ลบสิทธิ์เก่าทั้งหมด
      const delRes = await fetch(
        `http://localhost:3000/api/permissions/position/${position_id}`,
        { method: "DELETE", headers: { Authorization: `Bearer ${token}` } }
      );
      const delJson = await delRes.json();
      if (!delRes.ok) {
        Swal.fire({
          icon: "error",
          title: "❌ ลบสิทธิ์เก่าไม่สำเร็จ",
          text: delJson.error || "เกิดข้อผิดพลาดจากเซิร์ฟเวอร์",
          confirmButtonColor: "#e74c3c",
        });
        return;
      }

      // 🔹 เพิ่มสิทธิ์ใหม่ทั้งหมด
      for (const page_id of selectedPageIds) {
        await fetch("http://localhost:3000/api/permissions/add", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ position_id, page_id }),
        });
      }

      // ✅ แสดง SweetAlert2 success popup
      Swal.fire({
        icon: "success",
        title: "✅ Update Success!",
        text: `สิทธิ์ของตำแหน่ง "${row.name}" ถูกอัปเดตเรียบร้อยแล้ว`,
        timer: 1800,
        showConfirmButton: false,
      });

      // ✅ ปิด dialog และ refresh หน้า
      setTimeout(() => {
        onSuccess?.();
        onClose?.();
      }, 1800);
    } catch (err) {
      console.error("Update permission error:", err);
      Swal.fire({
        icon: "error",
        title: "🚨 Server Error",
        text: "ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้",
      });
    }
  };

  // ----------------------------------------------------------
  // ✅ ส่วนของ UI
  // ----------------------------------------------------------
  return (
    <div style={overlayStyle}>
      <div style={dialogStyle}>
        {/* หัวข้อ */}
        <h3 style={titleStyle}>✏️ Edit Role</h3>

        {/* ฟอร์มชื่อ Position */}
        <div style={{ marginBottom: "10px", textAlign: "left" }}>
          <label style={labelStyle}>ตำแหน่ง:</label>
          <input
            value={row.name}
            disabled
            style={{
              ...inputStyle,
              background: "#f9f9f9",
              cursor: "not-allowed",
            }}
          />
        </div>

        {/* เส้นคั่น */}
        <hr style={{ border: "0.5px solid #f1b5c6", margin: "12px 0" }} />

        {/* รายการสิทธิ์ (checkbox list) */}
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
                  accentColor: "#e46a84", // ✅ สีชมพู checkbox
                  width: "16px",
                  height: "16px",
                }}
              />
              {pg.page_name}
            </label>
          ))}
        </div>

        {/* ปุ่ม */}
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
// 🎨 STYLE SECTION
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

// กล่องหลัก
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

// ช่อง input
const inputStyle = {
  width: "100%",
  padding: "10px",
  borderRadius: "8px",
  border: "1px solid #f7c9d8", // ขอบชมพูอ่อน
  fontSize: "14px",
  outline: "none",
  transition: "0.2s",
};

// ปุ่ม Action
const actionRow = {
  display: "flex",
  justifyContent: "flex-end",
  gap: "10px",
  marginTop: "18px",
};

// ปุ่ม Cancel (เทา)
const cancelBtn = {
  padding: "8px 14px",
  borderRadius: "8px",
  border: "1px solid #ccc",
  background: "#f9f9f9",
  cursor: "pointer",
  fontWeight: "600",
  fontSize: "13px",
};

// ปุ่ม Save (ชมพู)
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
