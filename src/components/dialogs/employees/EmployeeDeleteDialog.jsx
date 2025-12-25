import Swal from "sweetalert2";

/**
 * 🔹 Dialog สำหรับลบพนักงาน (ไม่ถามยืนยัน)
 * - แสดง popup กลางหน้าจอให้ผู้ใช้เลือกว่าจะลบหรือยกเลิก
 * - ถ้ากด “ลบข้อมูล” → เรียก onConfirm(row.id)
 * - จากนั้นแสดง SweetAlert แจ้งว่า “ลบสำเร็จ”
 *
 * @param {object} row        - ข้อมูลพนักงานที่ต้องการลบ (เช่น { id, name })
 * @param {function} onClose  - ฟังก์ชันปิด Dialog
 * @param {function} onConfirm - ฟังก์ชันจากหน้าแม่ที่ใช้ลบข้อมูลจริงในฐานข้อมูล
 */
export default function EmployeeDeleteDialog({ row, onClose, onConfirm }) {
  /**
   * ✅ เมื่อผู้ใช้กด “ลบข้อมูล”
   * - เรียกฟังก์ชัน onConfirm(row.id)
   * - แสดง Swal แจ้ง “ลบข้อมูลสำเร็จ”
   * - ปิด Dialog
   */
  const handleConfirm = async () => {
    // 🔹 เรียกฟังก์ชันลบข้อมูลจากหน้าแม่
    await onConfirm(row.id);

    // 🔹 แสดง SweetAlert แจ้งผลลัพธ์หลังลบสำเร็จ
    Swal.fire({
      icon: "success",
      title: "✅ Delete employee Success!",
      text: `${row.name} ถูกลบเรียบร้อยแล้ว`,
      timer: 1500,
      showConfirmButton: false,
    });

    // 🔹 ปิด Dialog หลังจากแจ้งผลลัพธ์
    onClose();
  };

  /**
   * ✅ ส่วนแสดงผล UI ของ Dialog
   * - มี overlay โปร่งแสงครอบทั้งหน้าจอ
   * - กล่องกลางพร้อมข้อความถาม
   * - ปุ่ม “ยกเลิก” และ “ลบข้อมูล”
   */
  return (
    <div
      style={{
        position: "fixed",
        inset: 0, // ครอบทั้งหน้าจอ (top, right, bottom, left = 0)
        background: "rgba(0,0,0,0.5)", // พื้นหลังโปร่งแสงดำ
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000, // ให้อยู่เหนือสุด
      }}
    >
      <div
        style={{
          background: "#fff", // กล่องสีขาว
          borderRadius: "12px", // มุมโค้งมน
          padding: "24px 30px", // ระยะห่างในกล่อง
          width: "420px", // ความกว้างกล่อง
          boxShadow: "0 8px 20px rgba(0,0,0,0.25)", // เงา
          textAlign: "center", // จัดข้อความกลาง
        }}
      >
        {/* 🟥 หัวข้อกล่อง */}
        <h3 style={{ color: "#e74c3c", fontWeight: "bold", fontSize: "18px" }}>
          ⚠️ ลบพนักงาน
        </h3>

        {/* 🗨️ ข้อความถามยืนยัน */}
        <p style={{ marginTop: "12px", color: "#555", fontSize: "15px" }}>
          คุณแน่ใจหรือไม่ว่าต้องการลบ{" "}
          <b style={{ color: "#e74c3c" }}>{row.name}</b> ออกจากระบบ?
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
          {/* ปุ่มยกเลิก */}
          <button style={cancelBtn} onClick={onClose}>
            ยกเลิก
          </button>

          {/* ปุ่มลบ */}
          <button style={deleteBtn} onClick={handleConfirm}>
            ลบข้อมูล
          </button>
        </div>
      </div>
    </div>
  );
}

/* 🎨 ปุ่มยกเลิก (สีเทาอ่อน)
---------------------------------------- */
const cancelBtn = {
  padding: "8px 16px", // ขนาดปุ่ม
  borderRadius: "8px", // มุมโค้ง
  border: "1px solid #ccc", // ขอบเทา
  background: "#f8f8f8", // พื้นหลังเทาอ่อน
  cursor: "pointer", // รูปมือเมื่อ hover
  fontWeight: "bold",
  transition: "all 0.2s ease", // อนิเมชันเวลา hover
};

/* 🟥 ปุ่มลบ (สีแดง)
---------------------------------------- */
const deleteBtn = {
  padding: "8px 16px", // ขนาดปุ่ม
  borderRadius: "8px", // มุมโค้ง
  border: "none", // ไม่มีขอบ
  background: "#e74c3c", // สีแดง
  color: "#fff", // ตัวอักษรขาว
  fontWeight: "bold",
  cursor: "pointer", // รูปมือเมื่อ hover
  transition: "background 0.2s ease", // อนิเมชันตอน hover
};
