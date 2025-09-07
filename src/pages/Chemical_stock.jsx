import { useState, useEffect } from "react";
import "../styles/component_show.css";
import Swal from "sweetalert2";

export default function Chemical_stock() {
  const [formData, setFormData] = useState({
    chemical_name: "",
    chemical_type: "",
    quantity: "",
    received_date: "",
    expiry_date: "",
    company_name: "",
    price: "",
  });

  const [types, setTypes] = useState([]); // ✅ เก็บรายการ chemical types

  // ✅ โหลด types จาก API
  useEffect(() => {
    const fetchTypes = async () => {
      try {
        const token = localStorage.getItem("auth_token");
        if (!token) return;

        const res = await fetch("http://localhost:3000/api/chemicals/types", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const result = await res.json();
        if (res.ok) {
          setTypes(result.types || []);
        }
      } catch (err) {
        console.error("Fetch chemical types error:", err);
      }
    };

    fetchTypes();
  }, []);

  // ✅ handle change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ✅ handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("auth_token");
      if (!token) {
        Swal.fire({
          icon: "error",
          title: "No token found",
          text: "Please login again.",
        });
        return;
      }

      const res = await fetch("http://localhost:3000/api/chemicals/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const result = await res.json();

      if (!res.ok) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: result.error || "Add chemical failed",
          width: "280px",
          showConfirmButton: true,
          customClass: { popup: "my-swal-popup" },
        });
      } else {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Chemical added successfully!",
          width: "280px",
          showConfirmButton: false,
          timer: 2000,
          customClass: { popup: "my-swal-popup" },
        });

        // ✅ reset form
        setFormData({
          chemical_name: "",
          chemical_type: "",
          quantity: "",
          received_date: "",
          expiry_date: "",
          company_name: "",
          price: "",
        });
      }
    } catch (err) {
      console.error("Add chemical error:", err);
      Swal.fire({
        icon: "error",
        title: "Server Error",
        text: "Please try again later.",
      });
    }
  };

  return (
    <div className="table-container">
      <div className="rectangle">
        <div className="table-wrapper">
          <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
            Chemical Stock In
          </h2>

          <form onSubmit={handleSubmit} className="form-chemical">
            <label>
              Chemical Name:
              <input
                type="text"
                name="chemical_name"
                placeholder="Accohol"
                value={formData.chemical_name}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              Type:
              <select
                name="chemical_type"
                value={formData.chemical_type}
                onChange={handleChange}
                required
              >
                <option value="">-- Select Type --</option>
                {types.map((t, idx) => (
                  <option key={idx} value={t.type_name}>
                    {t.type_name}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Quantity:
              <input
                type="number"
                name="quantity"
                  placeholder="100"
                value={formData.quantity}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              Received Date:
              <input
                type="date"
                name="received_date"
                value={formData.received_date}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              Expiry Date:
              <input
                type="date"
                name="expiry_date"
                value={formData.expiry_date}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              Company Name:
              <input
                type="text"
                name="company_name"
                  placeholder="PTT"
                value={formData.company_name}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              Price:
              <input
                type="number"
                name="price"
                  placeholder="1000"
                value={formData.price}
                onChange={handleChange}
                required
              />
            </label>

            <button type="submit" className="submit-btn">
              Save Chemical
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
