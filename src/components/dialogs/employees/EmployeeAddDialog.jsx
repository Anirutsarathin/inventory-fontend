import { useState, useEffect } from "react";

export default function EmployeeAddDialog({ onClose, onSuccess }) {
  const [positions, setPositions] = useState([]);
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    email: "",
    password: "",
    address: "",
    gender: "",
    subdistrict_id: "",
    district_id: "",
    province_id: "",
    position_id: "",
    start_date: "",
    status: 1,
  });

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
    const res = await fetch("http://localhost:3000/api/add/employees", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(form),
    });
    const result = await res.json();
    if (res.ok) {
      alert("Add success ✅");
      onSuccess(result);
      onClose();
    } else {
      alert(result.error || "Add failed");
    }
  };

  return (
    <div className="dialog-overlay">
      <div className="dialog-box">
        <h3>Add Employee</h3>

        {/* First Name */}
        <input
          placeholder="First Name"
          value={form.first_name}
          onChange={(e) => setForm({ ...form, first_name: e.target.value })}
        />

        {/* Last Name */}
        <input
          placeholder="Last Name"
          value={form.last_name}
          onChange={(e) => setForm({ ...form, last_name: e.target.value })}
        />

        {/* Phone */}
        <input
          placeholder="Phone"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />

        {/* Email */}
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        {/* Password */}
        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        {/* Address */}
        <input
          placeholder="Address"
          value={form.address}
          onChange={(e) => setForm({ ...form, address: e.target.value })}
        />

        {/* Gender */}
        <select
          value={form.gender}
          onChange={(e) =>
            setForm({ ...form, gender: Number(e.target.value) })
          }
        >
          <option value="">-- Select Gender --</option>
          <option value={1}>Male</option>
          <option value={2}>Female</option>
        </select>

        {/* Province */}
        <input
          type="number"
          placeholder="Province ID"
          value={form.province_id}
          onChange={(e) =>
            setForm({ ...form, province_id: Number(e.target.value) })
          }
        />

        {/* District */}
        <input
          type="number"
          placeholder="District ID"
          value={form.district_id}
          onChange={(e) =>
            setForm({ ...form, district_id: Number(e.target.value) })
          }
        />

        {/* Subdistrict */}
        <input
          type="number"
          placeholder="Subdistrict ID"
          value={form.subdistrict_id}
          onChange={(e) =>
            setForm({ ...form, subdistrict_id: Number(e.target.value) })
          }
        />

        {/* Position */}
        <select
          value={form.position_id}
          onChange={(e) =>
            setForm({ ...form, position_id: Number(e.target.value) })
          }
        >
          <option value="">-- Select Position --</option>
          {positions.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>

        {/* Start Date */}
        <input
          type="date"
          placeholder="Start Date"
          value={form.start_date}
          onChange={(e) => setForm({ ...form, start_date: e.target.value })}
        />

        {/* Status */}
        <select
          value={form.status}
          onChange={(e) =>
            setForm({ ...form, status: Number(e.target.value) })
          }
        >
          <option value={1}>ACTIVE</option>
          <option value={0}>INACTIVE</option>
        </select>

        {/* Actions */}
        <div className="dialog-actions">
          <button onClick={onClose}>Cancel</button>
          <button onClick={handleSave}>Save</button>
        </div>
      </div>
    </div>
  );
}
