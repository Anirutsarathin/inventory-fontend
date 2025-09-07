import { useState, useEffect } from "react";
import ComponentShow from "../components/ComponentShow";

export default function Chemical_master() {
  const [data, setData] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchChemicals = async () => {
      try {
        const token = localStorage.getItem("auth_token");
        if (!token) {
          setError("No token found, please login.");
          return;
        }

        const res = await fetch("http://localhost:3000/api/chemicals/all", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          const errData = await res.json();
          setError(errData.error || "Failed to fetch chemicals");
          return;
        }

        const result = await res.json();

        // ✅ Map API → Table format
        const mappedData = (result.chemicals || []).map((c) => ({
          name: c.chemical_name,
          id: c.chemical_id,
          type: c.chemical_type,
          quantity: c.quantity,
          unit: "g", // 👈 default unit
                    tag: (
            <button
              onClick={() => alert(`QR for ${c.chemical_id}`)}
              style={{
                padding: "2px 2px",
                background: "#f497b6",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              QR
            </button>
          ),
          expiry: c.expiry_date,
        }));

        setData(mappedData);
      } catch (err) {
        console.error("Fetch chemicals error:", err);
        setError("Server error, please try again later.");
      }
    };

    fetchChemicals();
  }, []);

  // ✅ กำหนด columns สำหรับ Table
  const columns = [
    { Header: "Name", accessor: "name" },
    { Header: "Id", accessor: "id" },
    { Header: "Type", accessor: "type" },
    { Header: "Quantity", accessor: "quantity" },
    { Header: "Unit", accessor: "unit" },
    { Header: "Expiry", accessor: "expiry" },
    { Header: "Tag", accessor: "tag" },
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
