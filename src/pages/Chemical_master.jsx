import { useState, useEffect } from "react";
import ComponentShow from "../components/ComponentShow";
import ChemicalTagButton from "../components/dialogs/chemical/ChemicalTagButton";
import ChemicalEditButton from "../components/dialogs/chemical/ChemicalEditButton";
import ChemicalDeleteDialog from "../components/dialogs/chemical/ChemicalDeleteButton"; // 👈 import ใหม่

export default function Chemical_master() {
  const [data, setData] = useState([]);
  const [error, setError] = useState("");
  const [selectedChemical, setSelectedChemical] = useState(null); // 👈 state สำหรับ Dialog

  const fetchChemicals = async () => {
    try {
      const token = localStorage.getItem("auth_token");
      const res = await fetch("http://localhost:3000/api/chemicals/all", {
        headers: { Authorization: `Bearer ${token}` },
      });
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
            onEdited={() => fetchChemicals()}
          />
        ),
        delete: (
          <button
            onClick={() =>
              setSelectedChemical({
                chemical_id: c.chemical_id,
                chemical_name: c.chemical_name,
              })
            }
            style={{
              background: "#d9534f",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              padding: "3px 8px",
              cursor: "pointer",
              fontSize: "13px",
              fontWeight: "300",
              transition: "0.2s",
            }}
            onMouseEnter={(e) => (e.target.style.background = "#c9302c")}
            onMouseLeave={(e) => (e.target.style.background = "#d9534f")}
          >
            Delete
          </button>
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
    { Header: "Edit", accessor: "edit" },
    { Header: "Delete", accessor: "delete" },
  ];

  return (
    <div className="table-container">
      <div className="rectangle">
        {error ? (
          <p className="error">{error}</p>
        ) : (
          <>
            <ComponentShow data={data} columns={columns} />
            {/* 🔹 Dialog แสดงเมื่อเลือกสารเคมี */}
            {selectedChemical && (
              <ChemicalDeleteDialog
                row={selectedChemical}
                onClose={() => setSelectedChemical(null)}
                onConfirm={async (id) => {
                  const token = localStorage.getItem("auth_token");
                  await fetch(`http://localhost:3000/api/chemicals/${id}`, {
                    method: "DELETE",
                    headers: { Authorization: `Bearer ${token}` },
                  });
                  fetchChemicals();
                }}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}
