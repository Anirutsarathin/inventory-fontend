import { useState, useEffect } from "react";
import ComponentShow from "../components/ComponentShow";
import Swal from "sweetalert2";

export default function Managerole() {
  const [data, setData] = useState([]);
  const [positions, setPositions] = useState([]); // ✅ ตำแหน่ง
  const [pages, setPages] = useState([]);         // ✅ หน้า
  const [error, setError] = useState("");

  // ✅ ดึงข้อมูล role + position + page
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

    const fetchPositions = async () => {
      try {
        const token = localStorage.getItem("auth_token");
        const res = await fetch("http://localhost:3000/api/employees/position", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
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
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const result = await res.json();
        setPages(result.page || []);
      } catch (err) {
        console.error("Fetch pages error:", err);
      }
    };

    fetchRoles();
    fetchPositions();
    fetchPages();
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

const handleAdd = async () => {
  // dropdown ของตำแหน่ง (ใช้ id เป็น value)
  const optionsHtml = positions
    .map((p) => `<option value="${p.id}">${p.name}</option>`)
    .join("");

  // checkbox ของ pages (ใช้ page_id เป็น value)
  const pagesHtml = pages
    .map(
      (pg) => `
      <label style="display:flex;align-items:center;gap:5px;margin:5px 0">
        <input type="checkbox" id="swal-page-${pg.page_id}" value="${pg.page_id}">
        ${pg.page_name}
      </label>
    `
    )
    .join("");

 const { value: formValues } = await Swal.fire({
  title: "Add New Role",
  html: `
    <label>Position:</label>
    <select id="swal-position" class="swal2-select">
      ${optionsHtml}
    </select>
    <hr />
    <div style="text-align:left">${pagesHtml}</div>
  `,
  focusConfirm: false,
  showCancelButton: true,
  width: "300px", // ✅ ทำให้ popup เล็กลง
  customClass: {
    popup: "my-swal-popuprole" // ✅ ใช้ CSS ปรับตำแหน่ง
  },
  preConfirm: () => {
    const position_id = document.getElementById("swal-position").value;

    const selectedPageIds = pages
      .filter((pg) => document.getElementById(`swal-page-${pg.page_id}`).checked)
      .map((pg) => pg.page_id);

    return { position_id, selectedPageIds };
  },
});


  if (formValues) {
    try {
      const token = localStorage.getItem("auth_token");
      for (const page_id of formValues.selectedPageIds) {
        await fetch("http://localhost:3000/api/permissions/add", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            position_id: formValues.position_id,
            page_id: page_id,
          }),
        });
      }

       Swal.fire({
                icon: "success",
                title: "Success",
                text: "Role added successfully!",
                width: "280px",
                showConfirmButton: false,
                timer: 2000,
                customClass: { popup: "my-swal-popup" },
              });

      // 👉 refresh roles ใหม่หลังเพิ่ม
      setData((prev) => [...prev]); 
    } catch (err) {
      console.error("Add permission error:", err);
      Swal.fire("Error", "Failed to add role", "error");
    }
  }
};


  return (
    <div className="table-container">
      <div className="rectangle">
        {error ? (
          <p className="error">{error}</p>
        ) : (
          <ComponentShow data={data} columns={columns} onAdd={handleAdd} />
        )}
      </div>
    </div>
  );
}
