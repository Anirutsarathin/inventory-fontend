import { useState } from "react";

export default function ChemicalAddButton({ onAdded }) {
  const [showDialog, setShowDialog] = useState(false);
  const [form, setForm] = useState({
    chemical_name: "",
    chemical_type: "",
    quantity: "",
    received_date: "",
    expiry_date: "",
    company_name: "",
    price: "",
  });

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("auth_token");

      const res = await fetch("http://localhost:3000/api/chemicals/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          chemical_name: form.chemical_name,
          chemical_type: form.chemical_type,
          quantity: Number(form.quantity),
          received_date: form.received_date || null,
          expiry_date: form.expiry_date || null,
          company_name: form.company_name || "",
          price: Number(form.price) || 0,
        }),
      });

      const result = await res.json();
      if (!res.ok) {
        alert(result.error || "Add failed ❌");
        return;
      }

      alert("Add success ✅");
      setShowDialog(false);
      setForm({
        chemical_name: "",
        chemical_type: "",
        quantity: "",
        received_date: "",
        expiry_date: "",
        company_name: "",
        price: "",
      });
      onAdded?.(); // reload
    } catch (err) {
      console.error("Add error:", err);
      alert("Server error");
    }
  };

  return (
    <>
      <button
        onClick={() => setShowDialog(true)}
        style={{
          background: "#2196f3",
          color: "#fff",
          padding: "6px 12px",
          border: "none",
          borderRadius: "4px",
          marginBottom: "10px",
        }}
      >
        + Add Chemical
      </button>

      {showDialog && (
        <div
          className="dialog-overlay"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div
            className="dialog-box"
            style={{
              background: "#fff",
              padding: "20px",
              borderRadius: "8px",
              width: "400px",
            }}
          >
            <h3>Add Chemical</h3>

            <input
              value={form.chemical_name}
              onChange={(e) =>
                setForm({ ...form, chemical_name: e.target.value })
              }
              placeholder="Name"
              style={{ width: "100%", marginBottom: "8px" }}
            />
            <input
              value={form.chemical_type}
              onChange={(e) =>
                setForm({ ...form, chemical_type: e.target.value })
              }
              placeholder="Type"
              style={{ width: "100%", marginBottom: "8px" }}
            />
            <input
              type="number"
              value={form.quantity}
              onChange={(e) =>
                setForm({ ...form, quantity: e.target.value })
              }
              placeholder="Quantity"
              style={{ width: "100%", marginBottom: "8px" }}
            />

            <label>Received Date:</label>
            <input
              type="date"
              value={form.received_date}
              onChange={(e) =>
                setForm({ ...form, received_date: e.target.value })
              }
              style={{ width: "100%", marginBottom: "8px" }}
            />

            <label>Expiry Date:</label>
            <input
              type="date"
              value={form.expiry_date}
              onChange={(e) =>
                setForm({ ...form, expiry_date: e.target.value })
              }
              style={{ width: "100%", marginBottom: "8px" }}
            />

            <input
              value={form.company_name}
              onChange={(e) =>
                setForm({ ...form, company_name: e.target.value })
              }
              placeholder="Company"
              style={{ width: "100%", marginBottom: "8px" }}
            />
            <input
              type="number"
              value={form.price}
              onChange={(e) =>
                setForm({ ...form, price: e.target.value })
              }
              placeholder="Price"
              style={{ width: "100%", marginBottom: "8px" }}
            />

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "8px",
              }}
            >
              <button onClick={() => setShowDialog(false)}>Cancel</button>
              <button
                onClick={handleSave}
                style={{ background: "#2196f3", color: "#fff" }}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
