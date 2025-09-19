export default function EmployeeDeleteDialog({ row, onClose, onConfirm }) {
  return (
    <div className="dialog-overlay">
      <div className="dialog-box">
        <h3>ยืนยันการลบ</h3>
        <p>คุณต้องการลบพนักงาน <b>{row.name}</b> ใช่หรือไม่?</p>
        <div className="dialog-actions">
          <button onClick={onClose}>Cancel</button>
          <button
            onClick={() => {
              onConfirm(row.id);   // ✅ ส่ง id กลับไป
              onClose();
            }}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
