import { useState, useEffect } from "react";

export default function EmployeeEditDialog({ row, onClose, onSuccess }) {
  const [positions, setPositions] = useState([]);
  const [form, setForm] = useState({ ...row });

  useEffect(() => {
    const fetchPositions = async () => {
      const token = localStorage.getItem("auth_token");
      const res = await fetch("http://localhost:3000/api/employees/position", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await res.json();
      setPositions(result.employees || []);
    };
    fetchPositions();
  }, []);

  const handleSave = async () => {
    const token = localStorage.getItem("auth_token");
    const payload = { ...form };
    const res = await fetch(`http://localhost:3000/api/employees/${form.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
    const result = await res.json();
    if (res.ok) {
      alert("Update success ✅");
      onSuccess({ ...payload, status_label: payload.status === 1 ? "ACTIVE" : "INACTIVE" });
      onClose();
    } else {
      alert(result.error || "Update failed");
    }
  };

  return (
    <div className="dialog-overlay">
      <div className="dialog-box">
        <h3>Edit Employee</h3>
        <input value={form.first_name} onChange={(e) => setForm({ ...form, first_name: e.target.value })} />
        <input value={form.last_name} onChange={(e) => setForm({ ...form, last_name: e.target.value })} />
        <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        <select value={form.position_id} onChange={(e) => setForm({ ...form, position_id: e.target.value })}>
          {positions.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
        <select value={form.status} onChange={(e) => setForm({ ...form, status: Number(e.target.value) })}>
          <option value={1}>ACTIVE</option>
          <option value={0}>INACTIVE</option>
        </select>

        <div className="dialog-actions">
          <button onClick={onClose}>Cancel</button>
          <button onClick={handleSave}>Save</button>
        </div>
      </div>
    </div>
  );
}
