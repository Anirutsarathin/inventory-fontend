import { useState, useEffect } from "react";
import ComponentShow from "../components/ComponentShow";
import RoleAddDialog from "../components/dialogs/role/RoleAddDialog";   // ✅ import
import RoleEditDialog from "../components/dialogs/role/RoleEditDialog";
import RoleDeleteDialog from "../components/dialogs/role/RoleDeleteDialog";
import Swal from "sweetalert2";

export default function Managerole() {
  const [data, setData] = useState([]);
  const [positions, setPositions] = useState([]);
  const [pages, setPages] = useState([]);
  const [error, setError] = useState("");
  const [showAdd, setShowAdd] = useState(false);  // ✅ state add
  const [editRow, setEditRow] = useState(null); 
  const [deleteRow, setDeleteRow] = useState(null);

  // โหลด role/position/page
  useEffect(() => {
    fetchRoles();
    fetchPositions();
    fetchPages();
  }, []);

  const fetchRoles = async () => {
    try {
      const token = localStorage.getItem("auth_token");
      const res = await fetch("http://localhost:3000/api/role", {
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      });
      const result = await res.json();

      const grouped = {};
      (result.roles || []).forEach((r) => {
        if (!grouped[r.position_name]) {
          grouped[r.position_name] = {
            id: r.position_id, // ✅ ใช้ id ตรงกันกับ Add/Edit/Delete
            name: r.position_name,
            dashboard: "❌",
            chemical: "❌",
            document: "❌",
            approve: "❌",
            admin: "❌",
          };
        }

        if (r.page_name.includes("Dashboard")) grouped[r.position_name].dashboard = "✅";
        if (r.page_name.includes("Chemical")) grouped[r.position_name].chemical = "✅";
        if (r.page_name.includes("Document")) grouped[r.position_name].document = "✅";
        if (r.page_name.includes("Approval")) grouped[r.position_name].approve = "✅";
        if (r.page_name.includes("Admin")) grouped[r.position_name].admin = "✅";
      });

      setData(Object.values(grouped));
    } catch (err) {
      console.error("Fetch roles error:", err);
      setError("Server error, please try again later.");
    }
  };

  const fetchPositions = async () => {
    try {
      const token = localStorage.getItem("auth_token");
      const res = await fetch("http://localhost:3000/api/employees/position/role", {
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      });
      const result = await res.json();
      setPositions(result.employees || []);
    } catch (err) {
      console.error("Fetch positions error:", err);
    }
  };

  const fetchPages = async () => {
    try {
      const token = localStorage.getItem("auth_token");
      const res = await fetch("http://localhost:3000/api/page", {
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      });
      const result = await res.json();
      setPages(result.page || []);
    } catch (err) {
      console.error("Fetch pages error:", err);
    }
  };

  // Columns
  const columns = [
    { Header: "Position", accessor: "name" },
    { Header: "Page Dashboard", accessor: "dashboard" },
    { Header: "Page Chemical", accessor: "chemical" },
    { Header: "Page Document", accessor: "document" },
    { Header: "Page Approve", accessor: "approve" },
    { Header: "Page Admin", accessor: "admin" },
  ];

  // ✅ ลบ role
  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("auth_token");
      const res = await fetch(`http://localhost:3000/api/permissions/position/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const result = await res.json();
      if (!res.ok) {
        alert(result.error || "Delete failed");
        return;
      }

      Swal.fire({
        icon: "success",
        title: "Success",
        text: "ลบสิทธิ์ตำแหน่งเรียบร้อย ✅",
        timer: 2000,
        showConfirmButton: false,
      });

      setDeleteRow(null);
      fetchRoles();
    } catch (err) {
      console.error("Delete error:", err);
      alert("Server error, please try again later.");
    }
  };

  return (
    <div className="table-container">
      <div className="rectangle">
        {error ? (
          <p className="error">{error}</p>
        ) : (
          <>
            <ComponentShow
              data={data}
              columns={columns}
              onAdd={() => setShowAdd(true)}       // ✅ ใช้งาน Add
              onEdit={(row) => setEditRow(row)}
              onDelete={(row) => setDeleteRow(row)}
            />

            {/* Add */}
            {showAdd && (
              <RoleAddDialog
                positions={positions}
                pages={pages}
                onClose={() => setShowAdd(false)}
                onSuccess={() => {
                  setShowAdd(false);
                  fetchRoles();
                }}
              />
            )}

            {/* Edit */}
            {editRow && (
              <RoleEditDialog
                row={editRow}
                pages={pages}
                onClose={() => setEditRow(null)}
                onSuccess={() => {
                  setEditRow(null);
                  fetchRoles();
                }}
              />
            )}

            {/* Delete */}
            {deleteRow && (
              <RoleDeleteDialog
                row={deleteRow}
                onClose={() => setDeleteRow(null)}
                onConfirm={handleDelete}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}
