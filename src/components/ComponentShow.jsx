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
  const [positions, setPositions] = useState([]); // ตำแหน่งจาก API

  // ✅ โหลดตำแหน่งจาก API พร้อมแนบ Token
  useEffect(() => {
    const fetchPositions = async () => {
      try {
        const token = localStorage.getItem("auth_token");
        if (!token) {
          console.error("No token found, please login.");
          return;
        }

        const res = await fetch("http://localhost:3000/api/employees/position", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // ✅ แนบ Token
          },
        });

        if (!res.ok) {
          const errData = await res.json();
          console.error("Error fetching positions:", errData);
          return;
        }

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

  // ✅ Pagination
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

    // ✅ map status_label ให้ด้วย
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
      // ลบ record ออกจาก state ใน parent
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

        <button className="add-button" onClick={onAdd}>
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

          {/* First Name */}
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

{/* Last Name */}
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


            {/* Position */}
            <div className="form-group">
              <label>Position</label>
            <select
  value={formData.position_id || ""}
  onChange={(e) =>
    setFormData({ ...formData, position_id: Number(e.target.value) })
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

            {/* Phone */}
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
            {/* Status */}
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
    </div>
  );
}
