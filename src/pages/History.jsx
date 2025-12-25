import { useState, useEffect } from "react";
import ComponentShow from "../components/ComponentShow";
import "../styles/component_show.css";

export default function History() {
  const [data, setData] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  // ✅ โหลดข้อมูลจาก API จริง
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await fetch("http://localhost:3000/api/chemicals/his");
        const result = await res.json();

        if (!res.ok)
          throw new Error(result.error || "Failed to fetch chemical history");

        // ✅ ฟังก์ชันแปลงวันที่ให้ตรง timezone ไทย
        const formatDate = (dateString) => {
          if (!dateString) return "-";
          const date = new Date(dateString);
          return date.toLocaleDateString("en-CA", { timeZone: "Asia/Bangkok" }); // YYYY-MM-DD
        };

        // ✅ แปลงข้อมูลและวันที่
        const mappedData = (result.history || []).map((item) => ({
          ...item,
          ReceivedDate: formatDate(item.ReceivedDate),
          ExpiryDate: formatDate(item.ExpiryDate),
          create_date: formatDate(item.create_date),
        }));

        setData(mappedData);
      } catch (err) {
        console.error("🚨 Fetch Error:", err);
        setError("ไม่สามารถโหลดข้อมูลได้จากเซิร์ฟเวอร์");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  // ✅ คอลัมน์ของตาราง
  const columns = [
    { Header: "Chemical Name", accessor: "ChemicalName" },
    { Header: "Type", accessor: "ChemicalType" },
    { Header: "Quantity(KG)", accessor: "Quantity" },
    { Header: "Received Date", accessor: "ReceivedDate" },
    { Header: "Expiry Date", accessor: "ExpiryDate" },
    { Header: "Condition", accessor: "Condition" },
    { Header: "Company", accessor: "CompanyName" },
    { Header: "Price", accessor: "Price" },
    { Header: "Date", accessor: "create_date" },
    { Header: "Person", accessor: "create_by" },
  ];

  return (
    <div className="table-container history-page">
      <div className="rectangle">
        {loading ? (
          <p style={{ textAlign: "center", marginTop: "30px" }}>
            ⏳ กำลังโหลดข้อมูล...
          </p>
        ) : error ? (
          <p className="error">{error}</p>
        ) : (
          // ✅ ส่ง props rowsPerPage ให้ ComponentShow แสดงได้ 20 แถวต่อหน้า
          <ComponentShow data={data} columns={columns} rowsPerPage={20} />
        )}
      </div>
    </div>
  );
}
