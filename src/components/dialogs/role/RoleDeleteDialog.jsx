/**
 * 🧩 Component: RoleDeleteDialog
 * หน้าที่:
 *  - แสดงกล่องยืนยันการลบสิทธิ์ของ "ตำแหน่งงาน"
 *  - ออกแบบให้สวยเหมือน EmployeeDeleteDialog / ChemicalDeleteDialog
 *  - มี overlay โปร่งดำ, กล่องโค้งมน, ปุ่ม ❌ ยกเลิก และ 🗑 ลบข้อมูล
 *
 * @param {object} row        - ข้อมูลตำแหน่ง เช่น { id, name }
 * @param {function} onClose  - ฟังก์ชันปิดกล่อง (เมื่อกดยกเลิก)
 * @param {function} onConfirm - ฟังก์ชันจากหน้าแม่ ใช้ลบจริง (ส่ง id ไป)
 */
export default function RoleDeleteDialog({ row, onClose, onConfirm }) {
  // ------------------------------------------------------------
  // ✅ ส่วน UI หลัก: กล่องกลางหน้าจอพร้อมพื้นหลังโปร่งแสง
  // ------------------------------------------------------------
  return (
    <div
      style={{
        position: "fixed",
        inset: 0, // ครอบเต็มหน้าจอ (top/right/bottom/left = 0)
        background: "rgba(0,0,0,0.5)", // โปร่งแสงดำ
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
    >
      {/* 🔹 กล่องเนื้อหาหลัก */}
      <div
        style={{
          background: "#fff", // สีพื้นหลังขาว
          borderRadius: "14px", // มุมโค้งมน
          padding: "26px 32px", // ระยะห่างภายใน
          width: "420px", // ความกว้างกล่อง
          boxShadow: "0 8px 20px rgba(0,0,0,0.25)", // เงานุ่ม
          textAlign: "center", // จัดกลางข้อความ
          animation: "fadeIn 0.25s ease-in-out", // เอฟเฟกต์เปิดกล่องนุ่มๆ
        }}
      >
        {/* 🔺 หัวข้อหลัก */}
        <h3
          style={{
            color: "#e74c3c", // แดงหลัก
            fontWeight: "bold",
            fontSize: "18px",
            marginBottom: "10px",
          }}
        >
          ⚠️ ยืนยันการลบ
        </h3>

        {/* 🗨️ ข้อความอธิบาย */}
        <p
          style={{
            marginTop: "8px",
            color: "#555",
            fontSize: "15px",
            lineHeight: "1.6",
          }}
        >
          คุณต้องการลบสิทธิ์ทั้งหมดของตำแหน่ง{" "}
          <b style={{ color: "#e74c3c" }}>{row.name}</b> ใช่หรือไม่?
        </p>

        {/* 🔘 ปุ่มยกเลิก / ปุ่มลบ */}
        <div
          style={{
            marginTop: "26px",
            display: "flex",
            justifyContent: "center",
            gap: "14px",
          }}
        >
          {/* ❌ ปุ่มยกเลิก */}
          <button style={cancelBtn} onClick={onClose}>
            ยกเลิก
          </button>

          {/* 🗑 ปุ่มลบ */}
          <button
            style={deleteBtn}
            onClick={() => onConfirm(row.id)} // ✅ ส่ง id กลับไปให้หน้าแม่
          >
            ลบข้อมูล
          </button>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------
 🎨 STYLE SECTION: ปุ่มและอนิเมชัน
------------------------------------------------------------- */

/* 🔘 ปุ่มยกเลิก (เทาอ่อน) */
const cancelBtn = {
  padding: "8px 16px",
  borderRadius: "8px",
  border: "1px solid #ccc",
  background: "#f8f8f8",
  color: "#444",
  fontWeight: "bold",
  cursor: "pointer",
  transition: "all 0.2s ease",
};
cancelBtn[":hover"] = {
  background: "#f1f1f1",
};

/* 🟥 ปุ่มลบ (แดง) */
const deleteBtn = {
  padding: "8px 16px",
  borderRadius: "8px",
  border: "none",
  background: "#e74c3c",
  color: "#fff",
  fontWeight: "bold",
  cursor: "pointer",
  transition: "background 0.2s ease",
};
deleteBtn[":hover"] = {
  background: "#c0392b",
};
