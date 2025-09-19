import { useMemo, useState } from "react";

export default function RoleAddDialog({ positions, pages, onClose, onSuccess }) {
  const [positionId, setPositionId] = useState("");
  const [selected, setSelected] = useState({}); // {page_id: true/false}

  const pageList = useMemo(() => pages || [], [pages]);

  const toggle = (pid) =>
    setSelected((prev) => ({ ...prev, [pid]: !prev[pid] }));

  const handleSave = async () => {
    if (!positionId) {
      alert("กรุณาเลือกตำแหน่ง");
      return;
    }
    const selectedPageIds = Object.keys(selected)
      .filter((k) => selected[k])
      .map((k) => Number(k));

    if (selectedPageIds.length === 0) {
      alert("กรุณาเลือกหน้าอย่างน้อย 1 หน้า");
      return;
    }

    try {
      const token = localStorage.getItem("auth_token");

      // เพิ่มสิทธิ์ทีละหน้า (เหมือนโค้ดเดิมของคุณ)
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

      alert("Role added successfully ✅");
      onSuccess?.();
      onClose?.();
    } catch (err) {
      console.error("Add permission error:", err);
      alert("Failed to add role");
    }
  };

  return (
    <div className="dialog-overlay">
      <div className="dialog-box">
        <h3>Add Role</h3>

        <label>Position</label>
        <select
          value={positionId}
          onChange={(e) => setPositionId(e.target.value)}
        >
          <option value="">-- Select Position --</option>
          {(positions || []).map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>

        <hr />
        <div style={{ textAlign: "left", maxHeight: 220, overflowY: "auto" }}>
          {pageList.map((pg) => (
            <label
              key={pg.page_id}
              style={{ display: "flex", alignItems: "center", gap: 8, margin: "6px 0" }}
            >
              <input
                type="checkbox"
                checked={!!selected[pg.page_id]}
                onChange={() => toggle(pg.page_id)}
              />
              {pg.page_name}
            </label>
          ))}
        </div>

        <div className="dialog-actions">
          <button onClick={onClose}>Cancel</button>
          <button onClick={handleSave}>Save</button>
        </div>
      </div>
    </div>
  );
}
