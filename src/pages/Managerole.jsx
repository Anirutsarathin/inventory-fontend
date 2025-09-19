import { useState, useEffect } from "react";
import ComponentShow from "../components/ComponentShow";
import RoleEditDialog from "../components/dialogs/role/RoleEditDialog";
import Swal from "sweetalert2";

export default function Managerole() {
  const [data, setData] = useState([]);
  const [positions, setPositions] = useState([]);
  const [pages, setPages] = useState([]);
  const [error, setError] = useState("");
  const [editRow, setEditRow] = useState(null); // ✅ state edit

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
            id: r.position_id,     // ✅ เก็บ id ด้วย
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
      const res = await fetch("http://localhost:3000/api/employees/position", {
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
              onEdit={(row) => setEditRow(row)} // ✅ ใช้งาน edit
            />

            {editRow && (
              <RoleEditDialog
                row={editRow}
                pages={pages}
                onClose={() => setEditRow(null)}
                onSuccess={() => {
                  setEditRow(null);
                  fetchRoles(); // โหลดใหม่
                }}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}
