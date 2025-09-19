export default function RoleDeleteDialog({ row, onClose, onConfirm }) {
  // row = { id, name }
  return (
    <div className="dialog-overlay">
      <div className="dialog-box">
        <h3>ลบสิทธิ์ตำแหน่งนี้?</h3>
        <p>
          คุณต้องการลบสิทธิ์ทั้งหมดของตำแหน่ง <b>{row.name}</b> ใช่หรือไม่?
        </p>
        <div className="dialog-actions">
          <button onClick={onClose}>Cancel</button>
          <button
            onClick={() => onConfirm(row.id)} // ✅ ส่ง id กลับไปให้หน้า parent
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
