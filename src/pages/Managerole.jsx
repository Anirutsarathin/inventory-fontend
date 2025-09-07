import { useState } from "react";
import ComponentShow from "../components/ComponentShow";

export default function Managerole() {
  const data = [
    { no: 1, name: "ADMIN", dashboard: true, chemical: true, approve: true, admin: true },
    { no: 2, name: "TESTER", dashboard: true, chemical: true, approve: false, admin: false },
    { no: 3, name: "MANAGER", dashboard: true, chemical: false, approve: true, admin: false },
    { no: 4, name: "HR", dashboard: false, chemical: false, approve: true, admin: false },
    { no: 5, name: "DEVELOPER", dashboard: true, chemical: true, approve: false, admin: false },
    { no: 6, name: "QA", dashboard: true, chemical: false, approve: false, admin: false },
    { no: 7, name: "DEVOPS", dashboard: true, chemical: true, approve: true, admin: false },
  ];

  const [error] = useState("");

  // ✅ Map ให้ตรงกับ columns
  const mappedData = data.map((r) => ({
    name: r.name,
    dashboard: r.dashboard ? "✅" : "❌",
    chemical: r.chemical ? "✅" : "❌",
    approve: r.approve ? "✅" : "❌",
    admin: r.admin ? "✅" : "❌",
  }));

  // ✅ Columns
  const columns = [
    { Header: "Position", accessor: "name" },
    { Header: "Page Dashboard", accessor: "dashboard" },
    { Header: "Page Chemical", accessor: "chemical" },
    { Header: "Page Approve", accessor: "approve" },
    { Header: "Page Admin", accessor: "admin" },
  ];

  return (
    <div className="table-container">
      <div className="rectangle">
        {error ? (
          <p className="error">{error}</p>
        ) : (
          <ComponentShow data={mappedData} columns={columns} />
        )}
      </div>
    </div>
  );
}
