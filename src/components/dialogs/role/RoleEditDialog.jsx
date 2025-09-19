import { useEffect, useMemo, useState } from "react";

export default function RoleEditDialog({ row, pages, onClose, onSuccess }) {
  // row: { id, name, dashboard, chemical, document, approve, admin }
  const pageList = useMemo(() => pages || [], [pages]);

  // map page flags -> selected map
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

  const toggle = (pid) =>
    setSelected((prev) => ({ ...prev, [pid]: !prev[pid] }));

  const handleSave = async () => {
    const position_id = row.id;
    const selectedPageIds = Object.keys(selected)
      .filter((k) => selected[k])
      .map((k) => Number(k));

    try {
      const token = localStorage.getItem("auth_token");

      // 1) ล้างสิทธิ์เดิมทั้งหมดของตำแหน่งนี้
      const delRes = await fetch(
        `http://localhost:3000/api/permissions/position/${position_id}`,
        { method: "DELETE", headers: { Authorization: `Bearer ${token}` } }
      );
      const delJson = await delRes.json();
      if (!delRes.ok) {
        alert(delJson.error || "Clear old permissions failed");
        return;
      }

      // 2) เพิ่มสิทธิ์ใหม่
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

      alert("Update role success ✅");
      onSuccess?.();
      onClose?.();
    } catch (err) {
      console.error("Update permission error:", err);
      alert("Server error, please try again later.");
    }
  };

  return (
    <div className="dialog-overlay">
      <div className="dialog-box">
        <h3>Edit Role</h3>

        <div className="form-group">
          <label>Position</label>
          <input value={row.name} disabled />
        </div>

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
