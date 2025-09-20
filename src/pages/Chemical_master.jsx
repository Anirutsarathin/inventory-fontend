import { useState, useEffect } from "react";
import ComponentShow from "../components/ComponentShow";
import ChemicalTagButton from "../components/chemical/ChemicalTagButton";
import ChemicalDeleteButton from "../components/chemical/ChemicalDeleteButton";
import ChemicalEditButton from "../components/chemical/ChemicalEditButton"; // 👈 import

export default function Chemical_master() {
  const [data, setData] = useState([]);
  const [error, setError] = useState("");

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

      const mappedData = (result.chemicals || []).map((c) => ({
        name: c.chemical_name,
        id: c.chemical_id,
        type: c.chemical_type,
        quantity: c.quantity,
        unit: "g",
        expiry: c.expiry_date,
        tag: <ChemicalTagButton chemical={c} />,
        edit: (
          <ChemicalEditButton
            chemical={c}
            onEdited={() => fetchChemicals()} // refresh หลัง edit
          />
        ),
        delete: (
          <ChemicalDeleteButton
            chemicalId={c.chemical_id}
            onDeleted={() => fetchChemicals()} // refresh หลังลบ
          />
        ),
      }));

      setData(mappedData);
    } catch (err) {
      console.error("Fetch chemicals error:", err);
      setError("Server error, please try again later.");
    }
  };

  useEffect(() => {
    fetchChemicals();
  }, []);

  const columns = [
    { Header: "Name", accessor: "name" },
    { Header: "Id", accessor: "id" },
    { Header: "Type", accessor: "type" },
    { Header: "Quantity", accessor: "quantity" },
    { Header: "Unit", accessor: "unit" },
    { Header: "Expiry", accessor: "expiry" },
    { Header: "Tag", accessor: "tag" },
    { Header: "Edit", accessor: "edit" }, // 👈 เพิ่มคอลัมน์ Edit
    { Header: "Delete", accessor: "delete" },
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
