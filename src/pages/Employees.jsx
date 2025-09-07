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

        // ✅ Map API → Table format ให้ตรงกับ ComponentShow
        const mappedData = (result.employees || []).map((e) => ({
          name: e.name,
          position: e.position,
          status: e.status,
        }));

        setData(mappedData);
      } catch (err) {
        console.error("Fetch employees error:", err);
        setError("Server error, please try again later.");
      }
    };

    fetchEmployees();
  }, []);

  // ✅ กำหนด columns สำหรับ Table
  const columns = [
    { Header: "Name", accessor: "name" },
    { Header: "Position", accessor: "position" },
    { Header: "Status", accessor: "status" },
  ];

  return (
    <div className="table-container">
      <div className="rectangle">
        {error ? (
          <p className="error">{error}</p>
        ) : (
          <ComponentShow data={data} columns={columns} />
        )}
      </div>
    </div>
  );
}
