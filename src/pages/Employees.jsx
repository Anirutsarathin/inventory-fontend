import { useState, useEffect } from "react";
import ComponentShow from "../components/ComponentShow";
import EmployeeAddDialog from "../components/dialogs/employees/EmployeeAddDialog";
import EmployeeEditDialog from "../components/dialogs/employees/EmployeeEditDialog";
import EmployeeDeleteDialog from "../components/dialogs/employees/EmployeeDeleteDialog";

export default function Employees() {
  const [data, setData] = useState([]);
  const [error, setError] = useState("");

  // state dialog
  const [showAdd, setShowAdd] = useState(false);
  const [editRow, setEditRow] = useState(null);
  const [deleteRow, setDeleteRow] = useState(null);

  // ✅ โหลดข้อมูลพนักงาน
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const token = localStorage.getItem("auth_token");
        if (!token) {
          setError("No token found, please login.");
          return;
        }

        const res = await fetch("http://localhost:3000/api/employees", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          const errData = await res.json();
          setError(errData.error || "Failed to fetch employees");
          return;
        }

        const result = await res.json();

        // map ข้อมูลให้มี id
        const mappedData = (result.employees || []).map((e) => ({
          id: e.employee_id,
          first_name: e.first_name,
          last_name: e.last_name,
          name: e.name,
          position_id: e.position_id,
          position: e.position,
          phone: e.phone,
          status: e.status,
          status_label: e.status_label,
        }));

        setData(mappedData);
      } catch (err) {
        console.error("Fetch employees error:", err);
        setError("Server error, please try again later.");
      }
    };

    fetchEmployees();
  }, []);

  // ✅ columns สำหรับตาราง
  const columns = [
    { Header: "Name", accessor: "name" },
    { Header: "Position", accessor: "position" },
    { Header: "Phone", accessor: "phone" },
    { Header: "Status", accessor: "status_label" },
  ];

  // ✅ ฟังก์ชันลบพนักงาน
  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("auth_token");
      const res = await fetch(`http://localhost:3000/api/employees/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const result = await res.json();
      if (!res.ok) {
        alert(result.error || "Delete failed");
        return;
      }

      alert("Delete success ✅");
      setData((prev) => prev.filter((row) => row.id !== id));
    } catch (err) {
      console.error("Delete Error:", err);
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
              onAdd={() => setShowAdd(true)}
              onEdit={(row) => setEditRow(row)}
              onDelete={(row) => setDeleteRow(row)} // ส่ง row ทั้งก้อน
            />

            {/* ✅ Add Dialog */}
            {showAdd && (
              <EmployeeAddDialog
                onClose={() => setShowAdd(false)}
                onSuccess={(newEmp) =>
                  setData((prev) => [...prev, newEmp])
                }
              />
            )}

            {/* ✅ Edit Dialog */}
            {editRow && (
              <EmployeeEditDialog
                row={editRow}
                onClose={() => setEditRow(null)}
                onSuccess={(updated) =>
                  setData((prev) =>
                    prev.map((row) =>
                      row.id === updated.id ? updated : row
                    )
                  )
                }
              />
            )}

            {/* ✅ Delete Dialog */}
            {deleteRow && (
              <EmployeeDeleteDialog
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
