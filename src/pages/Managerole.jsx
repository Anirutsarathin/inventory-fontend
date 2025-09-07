import { useState, useEffect } from "react";
import ComponentShow from "../components/ComponentShow";

export default function Managerole() {
  const [data, setData] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const token = localStorage.getItem("auth_token");
        if (!token) {
          setError("No token found, please login.");
          return;
        }

        const res = await fetch("http://localhost:3000/api/role", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          const errData = await res.json();
          setError(errData.error || "Failed to fetch roles");
          return;
        }

        const result = await res.json();

        // ✅ Group by position_name
        const grouped = {};
        (result.roles || []).forEach((r) => {
          if (!grouped[r.position_name]) {
            grouped[r.position_name] = {
              name: r.position_name,
              dashboard: "❌",
              chemical: "❌",
              document: "❌",
              approve: "❌",
              admin: "❌",
            };
          }

          if (r.page_name.includes("Dashboard"))
            grouped[r.position_name].dashboard = "✅";
          if (r.page_name.includes("Chemical"))
            grouped[r.position_name].chemical = "✅";
          if (r.page_name.includes("Document"))
            grouped[r.position_name].document = "✅";
          if (r.page_name.includes("Approval"))
            grouped[r.position_name].approve = "✅";
          if (r.page_name.includes("Admin"))
            grouped[r.position_name].admin = "✅";
        });

        setData(Object.values(grouped));
      } catch (err) {
        console.error("Fetch roles error:", err);
        setError("Server error, please try again later.");
      }
    };

    fetchRoles();
  }, []);

  // ✅ Columns
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
          <ComponentShow data={data} columns={columns} />
        )}
      </div>
    </div>
  );
}
