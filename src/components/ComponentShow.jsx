import "../styles/component_show.css";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { useState, useMemo, useEffect } from "react";

export default function ComponentShow({ data, columns, onAdd, onUpdate }) {
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
  const [searchTerm, setSearchTerm] = useState("");

  // ✅ state สำหรับ Edit Dialog
  const [editRow, setEditRow] = useState(null);
  const [formData, setFormData] = useState({});
  const [positions, setPositions] = useState([]);

  // ✅ state สำหรับ Add Dialog
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newData, setNewData] = useState({
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

  // โหลดตำแหน่งจาก API
  useEffect(() => {
    const fetchPositions = async () => {
      try {
        const token = localStorage.getItem("auth_token");
        if (!token) return;

        const res = await fetch("http://localhost:3000/api/employees/position", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) return;
        const result = await res.json();
        setPositions(result.employees || []);
      } catch (err) {
        console.error("Error fetching positions:", err);
      }
    };

    fetchPositions();
  }, []);

  // ✅ Sort + Filter
  const filteredData = useMemo(() => {
    return (
      data
        .slice()
        .sort((a, b) => (a.name || "").localeCompare(b.name || ""))
        .filter(
          (row) =>
            row.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            row.position?.toLowerCase().includes(searchTerm.toLowerCase())
        )
    );
  }, [data, searchTerm]);

  // Pagination
  const indexOfLast = currentPage * rowsPerPage;
  const indexOfFirst = indexOfLast - rowsPerPage;
  const currentData = filteredData.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  const handleEdit = (row) => {
    setEditRow(row);
    setFormData(row);
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("auth_token");

      const payload = {
        id: formData.id,
        first_name: formData.first_name?.trim() || "",
        last_name: formData.last_name?.trim() || "",
        position_id: formData.position_id ?? 0,
        phone: formData.phone?.trim() || "",
        status: formData.status ?? 0,
      };

      const res = await fetch(
        `http://localhost:3000/api/employees/${payload.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      const result = await res.json();
      if (!res.ok) {
        alert(result.error || "Update failed");
        return;
      }

      const updatedData = {
        ...payload,
        name: `${payload.first_name} ${payload.last_name}`,
        status_label: payload.status === 1 ? "ACTIVE" : "INACTIVE",
      };

      alert("Update success ✅");
      if (onUpdate) onUpdate(updatedData);
      setEditRow(null);
    } catch (err) {
      console.error("Update Error:", err);
      alert("Server error, please try again later.");
    }
  };

  const handleAddSave = async () => {
    try {
      const token = localStorage.getItem("auth_token");
      const payload = {
        first_name: newData.first_name.trim(),
        last_name: newData.last_name.trim(),
        position_id: Number(newData.position_id),
        phone: newData.phone.trim(),
        email: newData.email || "",
        password: newData.password.trim(), // ✅ ส่ง password
        address: newData.address || "",
        gender: newData.gender || 0,
        subdistrict_id: newData.subdistrict_id || null,
        district_id: newData.district_id || null,
        province_id: newData.province_id || null,
        start_date: newData.start_date || new Date().toISOString().slice(0, 10),
        status: Number(newData.status),
      };

      const res = await fetch("http://localhost:3000/api/add/employees", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      if (!res.ok) {
        alert(result.error || "Add failed");
        return;
      }

      const newRecord = {
        ...result,
        name: `${payload.first_name} ${payload.last_name}`,
        status_label: payload.status === 1 ? "ACTIVE" : "INACTIVE",
      };

      alert("Add success ✅");
      if (onAdd) onAdd(newRecord);
      setShowAddDialog(false);
      setNewData({
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
    } catch (err) {
      console.error("Add Error:", err);
      alert("Server error, please try again later.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("คุณต้องการลบข้อมูลพนักงานนี้ใช่ไหม?")) return;

    try {
      const token = localStorage.getItem("auth_token");
      const res = await fetch(`http://localhost:3000/api/employees/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await res.json();
      if (!res.ok) {
        alert(result.error || "Delete failed");
        return;
      }

      alert("Delete success ✅");
      if (onUpdate) {
        onUpdate({ id, _delete: true });
      }
    } catch (err) {
      console.error("Delete Error:", err);
      alert("Server error, please try again later.");
    }
  };

  return (
    <div className="table-wrapper">
      {/* Header (Search + Add) */}
      <div className="table-header">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search name or position..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>

        <button className="add-button" onClick={() => setShowAddDialog(true)}>
          +
        </button>
      </div>

      {/* Table */}
      <table className="custom-table">
        <thead>
          <tr>
            <th>NO</th>
            {columns.map((col, idx) => (
              <th key={idx}>{col.Header}</th>
            ))}
            <th>EDIT</th>
            <th>DELETE</th>
          </tr>
        </thead>
        <tbody>
          {currentData.length > 0 ? (
            currentData.map((row, idx) => (
              <tr key={idx}>
                <td>{indexOfFirst + idx + 1}</td>
                {columns.map((col, cIdx) => (
                  <td key={cIdx}>{row[col.accessor]}</td>
                ))}
                <td className="action-icons">
                  <FiEdit title="Edit" onClick={() => handleEdit(row)} />
                </td>
                <td className="action-icons">
                  <FiTrash2 title="Delete" onClick={() => handleDelete(row.id)} />
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length + 3} style={{ textAlign: "center" }}>
                ❌ No results found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="pagination">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((p) => p - 1)}
        >
          &lt; Prev
        </button>
        <span>
          Page {currentPage} of {totalPages || 1}
        </span>
        <button
          disabled={currentPage === totalPages || totalPages === 0}
          onClick={() => setCurrentPage((p) => p + 1)}
        >
          Next &gt;
        </button>
      </div>

      {/* ✅ Edit Dialog */}
      {editRow && (
        <div className="dialog-overlay">
          <div className="dialog-box">
            <h3>Edit Employee</h3>

            <div className="form-group">
              <label>First Name</label>
              <input
                type="text"
                value={formData.first_name || ""}
                onChange={(e) =>
                  setFormData({ ...formData, first_name: e.target.value })
                }
              />
            </div>

            <div className="form-group">
              <label>Last Name</label>
              <input
                type="text"
                value={formData.last_name || ""}
                onChange={(e) =>
                  setFormData({ ...formData, last_name: e.target.value })
                }
              />
            </div>

            <div className="form-group">
              <label>Position</label>
              <select
                value={formData.position_id || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    position_id: Number(e.target.value),
                  })
                }
              >
                <option value="">-- Select Position --</option>
                {positions.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Phone</label>
              <input
                type="text"
                value={formData.phone || ""}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
              />
            </div>

            <div className="form-group">
              <label>Status</label>
              <select
                value={formData.status ?? ""}
                onChange={(e) =>
                  setFormData({ ...formData, status: Number(e.target.value) })
                }
              >
                <option value="">-- Select Status --</option>
                <option value={1}>ACTIVE</option>
                <option value={0}>INACTIVE</option>
              </select>
            </div>

            <div className="dialog-actions">
              <button onClick={() => setEditRow(null)}>Cancel</button>
              <button onClick={handleSave}>Save</button>
            </div>
          </div>
        </div>
      )}

      {/* ✅ Add Dialog */}
      {showAddDialog && (
        <div className="dialog-overlay">
          <div className="dialog-box">
            <h3>Add Employee</h3>

            {/* First Name */}
            <div className="form-group">
              <label>First Name</label>
              <input
                type="text"
                value={newData.first_name}
                onChange={(e) =>
                  setNewData({ ...newData, first_name: e.target.value })
                }
              />
            </div>

            {/* Last Name */}
            <div className="form-group">
              <label>Last Name</label>
              <input
                type="text"
                value={newData.last_name}
                onChange={(e) =>
                  setNewData({ ...newData, last_name: e.target.value })
                }
              />
            </div>

            {/* Phone */}
            <div className="form-group">
              <label>Phone</label>
              <input
                type="text"
                value={newData.phone}
                onChange={(e) =>
                  setNewData({ ...newData, phone: e.target.value })
                }
              />
            </div>

            {/* Email */}
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={newData.email || ""}
                onChange={(e) =>
                  setNewData({ ...newData, email: e.target.value })
                }
              />
            </div>

            {/* Password */}
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                value={newData.password}
                onChange={(e) =>
                  setNewData({ ...newData, password: e.target.value })
                }
              />
            </div>

            {/* Address */}
            <div className="form-group">
              <label>Address</label>
              <input
                type="text"
                value={newData.address || ""}
                onChange={(e) =>
                  setNewData({ ...newData, address: e.target.value })
                }
              />
            </div>

            {/* Gender */}
            <div className="form-group">
              <label>Gender</label>
              <select
                value={newData.gender || ""}
                onChange={(e) =>
                  setNewData({ ...newData, gender: Number(e.target.value) })
                }
              >
                <option value="">-- Select Gender --</option>
                <option value={1}>Male</option>
                <option value={2}>Female</option>
              </select>
            </div>

            {/* Province */}
            <div className="form-group">
              <label>Province ID</label>
              <input
                type="number"
                value={newData.province_id || ""}
                onChange={(e) =>
                  setNewData({ ...newData, province_id: Number(e.target.value) })
                }
              />
            </div>

            {/* District */}
            <div className="form-group">
              <label>District ID</label>
              <input
                type="number"
                value={newData.district_id || ""}
                onChange={(e) =>
                  setNewData({ ...newData, district_id: Number(e.target.value) })
                }
              />
            </div>

            {/* Subdistrict */}
            <div className="form-group">
              <label>Subdistrict ID</label>
              <input
                type="number"
                value={newData.subdistrict_id || ""}
                onChange={(e) =>
                  setNewData({
                    ...newData,
                    subdistrict_id: Number(e.target.value),
                  })
                }
              />
            </div>

            {/* Position */}
            <div className="form-group">
              <label>Position</label>
              <select
                value={newData.position_id}
                onChange={(e) =>
                  setNewData({ ...newData, position_id: e.target.value })
                }
              >
                <option value="">-- Select Position --</option>
                {positions.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Start Date */}
            <div className="form-group">
              <label>Start Date</label>
              <input
                type="date"
                value={newData.start_date || ""}
                onChange={(e) =>
                  setNewData({ ...newData, start_date: e.target.value })
                }
              />
            </div>

            {/* Status */}
            <div className="form-group">
              <label>Status</label>
              <select
                value={newData.status}
                onChange={(e) =>
                  setNewData({ ...newData, status: e.target.value })
                }
              >
                <option value={1}>ACTIVE</option>
                <option value={0}>INACTIVE</option>
              </select>
            </div>

            {/* Actions */}
            <div className="dialog-actions">
              <button onClick={() => setShowAddDialog(false)}>Cancel</button>
              <button onClick={handleAddSave}>Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
