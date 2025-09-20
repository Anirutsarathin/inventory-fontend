import { jsPDF } from "jspdf";
import QRCode from "qrcode";

export default function ChemicalTagButton({ chemical }) {
  // ✅ ฟังก์ชันสร้าง Tag PDF พร้อม QR + กรอบตัด + ชื่อ
  const generateTag = async () => {
    try {
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: [60, 70], // ขนาด tag (60x70 mm)
      });

      const qrPayload = `
ID: ${chemical.chemical_id}
Name: ${chemical.chemical_name}
Type: ${chemical.chemical_type}
Quantity: ${chemical.quantity} g
Expiry: ${chemical.expiry_date}
      `;

      // ✅ gen QR
      const qrData = await QRCode.toDataURL(qrPayload);

      // ===== 🎯 กรอบตัด =====
      doc.setLineWidth(0.3);
      doc.rect(5, 5, 50, 60);

      // ===== 🏷️ ชื่อสารเคมี =====
      doc.setFontSize(12);
      doc.text(chemical.chemical_name, 30, 15, { align: "center" });

      // ===== 📌 QR Code =====
      doc.addImage(qrData, "PNG", 15, 20, 30, 30);

      // ===== ℹ️ ข้อมูลใต้ QR =====
      doc.setFontSize(10);
      doc.text(`ID: ${chemical.chemical_id}`, 30, 55, { align: "center" });

      doc.save(`Tag_${chemical.chemical_id}.pdf`);
    } catch (err) {
      console.error("Generate tag error:", err);
      alert("ไม่สามารถสร้าง Tag ได้");
    }
  };

  return (
    <button
      onClick={generateTag}
      style={{
        padding: "2px 6px",
        background: "#f497b6",
        color: "#fff",
        border: "none",
        borderRadius: "4px",
        cursor: "pointer",
      }}
    >
      QR
    </button>
  );
}
