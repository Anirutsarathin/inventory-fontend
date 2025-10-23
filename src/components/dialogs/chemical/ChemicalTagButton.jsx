import { jsPDF } from "jspdf";
import QRCode from "qrcode";
import Swal from "sweetalert2";

/**
 * 🔹 ปุ่มสร้าง Tag PDF สำหรับสารเคมี (ธีมชมพูเข้ากับแอป)
 * - มี confirm ก่อนสร้าง (เรียบ ๆ)
 * - ใช้สีชมพูตามโทนหลักของระบบ (#f497b6)
 */
export default function ChemicalTagButton({ chemical }) {
  const generateTag = async () => {
    try {
      // ✅ Confirm ก่อนสร้าง Tag
      const confirm = await Swal.fire({
        title: "สร้าง Tag สารเคมี",
        text: `คุณต้องการสร้าง Tag ของ ${chemical.chemical_name} ใช่ไหม?`,
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "ยืนยัน",
        cancelButtonText: "ยกเลิก",
        confirmButtonColor: "#3d8d40ff", // 🎨 เขียว
        cancelButtonColor: "#ff4b4bff", // เเดง
          reverseButtons: true,            // ✅ สลับตำแหน่งปุ่มซ้าย-ขวา
      });

      if (!confirm.isConfirmed) return; // ถ้าไม่ยืนยัน → ออกจากฟังก์ชัน

      // ✅ สร้าง PDF
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: [60, 70], // ขนาด Tag
      });

      // ✅ เนื้อหาภายใน QR
      const qrPayload = `
        ID: ${chemical.chemical_id}
        Name: ${chemical.chemical_name}
        Type: ${chemical.chemical_type}
        Quantity: ${chemical.quantity} g
        Expiry: ${chemical.expiry_date}
      `;
      const qrData = await QRCode.toDataURL(qrPayload);

      // ✅ วาดกรอบ
      doc.setLineWidth(0.3);
      doc.rect(5, 5, 50, 60);

      // ✅ ชื่อสารเคมี
      doc.setFontSize(12);
      doc.text(chemical.chemical_name, 30, 15, { align: "center" });

      // ✅ QR Code
      doc.addImage(qrData, "PNG", 15, 22, 30, 30);

      // ✅ ID ใต้ QR
      doc.setFontSize(10);
      doc.text(`ID: ${chemical.chemical_id}`, 30, 56, { align: "center" });

      // ✅ บันทึก PDF
      doc.save(`Tag_${chemical.chemical_id}.pdf`);

      // ✅ แจ้งผลลัพธ์
      Swal.fire({
        icon: "success",
        title: "Create Tag Success!",
        text: "สร้าง Tag เรียบร้อยแล้ว",
        showConfirmButton: false,
        timer: 1800,
      });
    } catch (err) {
      console.error("Generate tag error:", err);
      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text: "ไม่สามารถสร้าง Tag ได้",
      });
    }
  };

  return (
    <button
      onClick={generateTag}
      style={{
        padding: "3px 8px",
        background: "#f497b6", // 🎨 ชมพูหลัก (ตรงกับธีมในแอป)
        color: "#fff",
        border: "none",
        borderRadius: "4px",
        cursor: "pointer",
        fontSize: "12px",
        transition: "background 0.2s ease", // ทำให้ hover นุ่มขึ้น
      }}
      onMouseEnter={(e) => (e.target.style.background = "#f06c97")} // สีเข้มขึ้นตอน hover
      onMouseLeave={(e) => (e.target.style.background = "#f497b6")} // กลับสีเดิม
      title="สร้าง Tag พร้อม QR Code"
    >
      QR
    </button>
  );
}
