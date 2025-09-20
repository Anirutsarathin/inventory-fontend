import Swal from "sweetalert2";

export default function ChemicalDeleteButton({ chemicalId, onDeleted }) {
  const handleDelete = async () => {
    const confirm = await Swal.fire({
      title: "ลบสารเคมี?",
      text: `คุณต้องการลบสารเคมี ID: ${chemicalId} ใช่หรือไม่?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "ลบ",
      cancelButtonText: "ยกเลิก",
    });

    if (!confirm.isConfirmed) return;

    try {
      const token = localStorage.getItem("auth_token");
      const res = await fetch(
        `http://localhost:3000/api/chemicals/${chemicalId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const result = await res.json();

      if (!res.ok) {
        Swal.fire("ล้มเหลว", result.error || "ลบไม่สำเร็จ", "error");
        return;
      }

      Swal.fire("สำเร็จ", "ลบสารเคมีเรียบร้อยแล้ว", "success");

      // แจ้ง parent component ให้ refresh
      onDeleted?.(chemicalId);
    } catch (err) {
      console.error("Delete chemical error:", err);
      Swal.fire("ล้มเหลว", "เกิดข้อผิดพลาดของเซิร์ฟเวอร์", "error");
    }
  };

  return (
    <button
      onClick={handleDelete}
      style={{
        padding: "2px 6px",
        background: "#d9534f",
        color: "#fff",
        border: "none",
        borderRadius: "4px",
        cursor: "pointer",
      }}
    >
      Delete
    </button>
  );
}
