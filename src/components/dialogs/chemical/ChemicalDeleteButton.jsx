import Swal from "sweetalert2";

/**
 * 🧴 Component: ChemicalDeleteDialog
 * หน้าที่:
 * - แสดงกล่องยืนยันการลบสารเคมี (Overlay Modal)
 * - ปุ่ม ❌ ยกเลิก (เทา) และ 🗑 ลบข้อมูล (แดง)
 * - ถ้ากดยืนยัน → เรียก API ลบจริง และแสดง SweetAlert แจ้งผล
 *
 * @param {object} row        - ข้อมูลสารเคมี เช่น { id, name }
 * @param {function} onClose  - ฟังก์ชันปิด Dialog
 * @param {function} onConfirm - ฟังก์ชันจากหน้าแม่ ใช้ลบข้อมูลจริง
 */
export default function ChemicalDeleteDialog({ row, onClose, onConfirm }) {
  // ✅ ฟังก์ชันเมื่อกดยืนยันการลบ
  const handleConfirm = async () => {
    try {
      // 🔸 เรียก API หรือฟังก์ชันลบจากหน้าแม่
      await onConfirm(row.chemical_id);

      // ✅ แสดง SweetAlert แจ้งลบสำเร็จ
      Swal.fire({
        icon: "success",
        title: "✅ Delete Chemical Success!",
        text: `${row.chemical_name} ถูกลบเรียบร้อยแล้ว`,
        timer: 1800,
        showConfirmButton: false,
      });

      // ปิด Dialog หลังจากแสดงผล
      onClose();
    } catch (err) {
      console.error("Delete chemical error:", err);
      Swal.fire({
        icon: "error",
        title: "🚨 Server Error",
        text: "ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้",
      });
    }
  };

  // ✅ ส่วน UI ของ Dialog (Overlay กลางจอ)
  return (
    <div
      style={{
        position: "fixed",
        inset: 0, // ครอบทั้งจอ (top,right,bottom,left)
        background: "rgba(0,0,0,0.5)", // ฉากหลังโปร่งดำ
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          background: "#fff", // กล่องสีขาว
          borderRadius: "14px", // มุมโค้งมน
          padding: "24px 30px",
          width: "420px",
          boxShadow: "0 8px 20px rgba(0,0,0,0.25)",
          textAlign: "center",
          animation: "fadeIn 0.2s ease", // เพิ่ม effect เปิดกล่องนุ่มๆ
        }}
      >
        {/* 🔺 หัวข้อหลัก */}
        <h3 style={{ color: "#e74c3c", fontWeight: "bold", fontSize: "18px" }}>
          ⚠️ ยืนยันการลบ
        </h3>

        {/* 🧾 ข้อความถามยืนยัน */}
        <p style={{ marginTop: "12px", color: "#555", fontSize: "15px" }}>
          คุณต้องการลบสารเคมี{" "}
          <b style={{ color: "#e74c3c" }}>{row.chemical_name}</b> ใช่หรือไม่?
        </p>

        {/* 🔘 ปุ่มยกเลิก / ปุ่มลบ */}
        <div
          style={{
            marginTop: "24px",
            display: "flex",
            justifyContent: "center",
            gap: "12px",
          }}
        >
          {/* ❌ ปุ่มยกเลิก */}
          <button style={cancelBtn} onClick={onClose}>
            ยกเลิก
          </button>

          {/* 🗑 ปุ่มลบ */}
          <button style={deleteBtn} onClick={handleConfirm}>
            ลบข้อมูล
          </button>
        </div>
      </div>
    </div>
  );
}

/* -----------------------------------------
 🎨 สไตล์ปุ่มยกเลิก (เทาอ่อน)
------------------------------------------ */
const cancelBtn = {
  padding: "8px 16px",
  borderRadius: "8px",
  border: "1px solid #ccc",
  background: "#f8f8f8",
  color: "#444",
  cursor: "pointer",
  fontWeight: "bold",
  transition: "all 0.2s ease",
};
cancelBtn[":hover"] = {
  background: "#f1f1f1",
};

/* -----------------------------------------
 🟥 ปุ่มลบ (สีแดง)
------------------------------------------ */
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
