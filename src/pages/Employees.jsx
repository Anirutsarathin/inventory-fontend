import { useState, useEffect } from "react";
import ComponentShow from "../components/ComponentShow";

export default function Employees() {
  const [data, setData] = useState([]);
  const [error, setError] = useState("");

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

        // ✅ เก็บ id ด้วย
        const mappedData = (result.employees || []).map((e) => ({
          id: e.employee_id,
          first_name: e.first_name,
          last_name: e.last_name,
          name: e.name,
          position_id: e.position_id,   // ต้องเก็บ id ไว้ใช้ตอน update
          position: e.position,         // ชื่อ position ไว้โชว์
          phone: e.phone,
          status: e.status,               // เก็บตัวเลข
          status_label: e.status_label,   // เก็บ label

        }));


        setData(mappedData);
      } catch (err) {
        console.error("Fetch employees error:", err);
        setError("Server error, please try again later.");
      }
    };

    fetchEmployees();
  }, []);

  const columns = [
    { Header: "Name", accessor: "name" },
    { Header: "Position", accessor: "position" },
    { Header: "Phone", accessor: "phone" },
    { Header: "Status", accessor: "status_label" },
  ];

  return (
    <div className="table-container">
      <div className="rectangle">
        {error ? (
          <p className="error">{error}</p>
        ) : (
<ComponentShow
  data={data}
  columns={columns}
  onUpdate={(updated) => {
    if (updated._delete) {
      // ✅ ลบจาก state
      setData((prev) => prev.filter((row) => row.id !== updated.id));
    } else {
      // ✅ แก้ไขจาก state
      setData((prev) =>
        prev.map((row) =>
          row.id === updated.id ? { ...row, ...updated } : row
        )
      );
    }
  }}
/>

        )}
      </div>
    </div>
  );
}
