import { useState, useEffect } from "react";
import Swal from "sweetalert2"; // ✅ ใช้แสดง popup แจ้งเตือน

// 🔹 คอมโพเนนต์เพิ่มข้อมูลพนักงาน (EmployeeAddDialog)
export default function EmployeeAddDialog({ onClose, onSuccess }) {
  // -----------------------------------------
  // ✅ state สำหรับเก็บข้อมูล dropdown และสถานะโหลด
  // -----------------------------------------
  const [positions, setPositions] = useState([]); // ตำแหน่งพนักงาน
  const [provinces, setProvinces] = useState([]); // จังหวัด
  const [districts, setDistricts] = useState([]); // อำเภอ
  const [subdistricts, setSubdistricts] = useState([]); // ตำบล
  const [loading, setLoading] = useState(false); // สถานะโหลดตอนบันทึก

  // -----------------------------------------
  // ✅ state ของฟอร์มข้อมูลพนักงาน
  // -----------------------------------------
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    email: "",
    password: "",
    address: "",
    gender: "",
    subdistrict_id: "",
    district_id: "",
    province_id: "",
    position_id: "",
    start_date: "",
    status: 1,
  });

  // -----------------------------------------
  // ✅ โหลดข้อมูลตำแหน่งพนักงานจาก API (ต้องแนบ token)
  // -----------------------------------------
  useEffect(() => {
    const fetchPositions = async () => {
      const token = localStorage.getItem("auth_token");
      const res = await fetch("http://localhost:3000/api/employees/position", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await res.json();
      setPositions(result.employees || []);
    };
    fetchPositions();
  }, []);

  // -----------------------------------------
  // ✅ โหลดข้อมูลจังหวัดทั้งหมด (ไม่ต้องแนบ token)
  // -----------------------------------------
  useEffect(() => {
    const fetchProvinces = async () => {
      const res = await fetch("http://localhost:3000/api/employees/province");
      const result = await res.json();
      setProvinces(result.employees || []);
    };
    fetchProvinces();
  }, []);

  // -----------------------------------------
  // ✅ โหลดข้อมูล "อำเภอ" เมื่อมีการเลือกจังหวัด
  // -----------------------------------------
  useEffect(() => {
    if (!form.province_id) return;
    const fetchDistricts = async () => {
      const res = await fetch(
        `http://localhost:3000/api/employees/district?provinceId=${form.province_id}`
      );
      const result = await res.json();
      setDistricts(result.districts || []);
      setSubdistricts([]); // รีเซ็ตตำบลเมื่อเปลี่ยนจังหวัด
      setForm((prev) => ({ ...prev, district_id: "", subdistrict_id: "" }));
    };
    fetchDistricts();
  }, [form.province_id]);

  // -----------------------------------------
  // ✅ โหลดข้อมูล "ตำบล" เมื่อมีการเลือกอำเภอ
  // -----------------------------------------
  useEffect(() => {
    if (!form.district_id) return;
    const fetchSubdistricts = async () => {
      const res = await fetch(
        `http://localhost:3000/api/employees/sub_district?DistrictID=${form.district_id}`
      );
      const result = await res.json();
      setSubdistricts(result.districts || []);
      setForm((prev) => ({ ...prev, subdistrict_id: "" }));
    };
    fetchSubdistricts();
  }, [form.district_id]);

  // -----------------------------------------
  // ✅ ตรวจสอบความถูกต้องของข้อมูลก่อนส่ง
  // -----------------------------------------
  const validateForm = () => {
    if (!form.first_name.trim() || !form.last_name.trim())
      return "กรุณากรอกชื่อ-นามสกุล";
    if (!form.phone.trim() || form.phone.length < 9)
      return "กรุณากรอกเบอร์โทรให้ถูกต้อง";
    if (!form.email.includes("@")) return "กรุณากรอกอีเมลที่ถูกต้อง";
    if (!form.password.trim()) return "กรุณากรอกรหัสผ่าน";
    if (!form.gender) return "กรุณาเลือกเพศ";
    if (!form.province_id) return "กรุณาเลือกจังหวัด";
    if (!form.district_id) return "กรุณาเลือกอำเภอ";
    if (!form.subdistrict_id) return "กรุณาเลือกตำบล";
    if (!form.position_id) return "กรุณาเลือกตำแหน่ง";
    if (!form.start_date) return "กรุณาเลือกวันที่เริ่มงาน";
    return null; // ✅ ถ้าข้อมูลครบ ส่งค่า null (ไม่มี error)
  };

  // -----------------------------------------
  // ✅ ฟังก์ชันบันทึกข้อมูลพนักงาน
  // -----------------------------------------
  const handleSave = async () => {
    const error = validateForm();
    if (error) {
      Swal.fire({
        icon: "warning",
        title: "⚠️ ข้อมูลไม่ครบ",
        text: error,
        confirmButtonColor: "#ff4a74",
      });
      return;
    }

    try {
      setLoading(true); // แสดงสถานะโหลด
      const token = localStorage.getItem("auth_token");
      const res = await fetch("http://localhost:3000/api/add/employees", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      const result = await res.json();

      // ✅ กรณีเพิ่มสำเร็จ
      if (res.ok) {
        Swal.fire({
          icon: "success",
          title: "✅ Add employee success!",
          text: `${form.first_name} ${form.last_name} ถูกบันทึกเรียบร้อย`,
          showConfirmButton: false,
          timer: 1800,
        });

        // รีเซ็ตฟอร์มให้ว่าง
        setForm({
          first_name: "",
          last_name: "",
          phone: "",
          email: "",
          password: "",
          address: "",
          gender: "",
          subdistrict_id: "",
          district_id: "",
          province_id: "",
          position_id: "",
          start_date: "",
          status: 1,
        });

        onSuccess(result); // อัปเดตข้อมูลหน้า parent
        onClose(); // ปิด dialog
      } else {
        // ❌ กรณีเกิด error จาก backend
        Swal.fire({
          icon: "error",
          title: "❌ Add employee fail!",
          text: result.error || "เกิดข้อผิดพลาดจากเซิร์ฟเวอร์",
          confirmButtonColor: "#ff4a74",
        });
      }
    } catch (err) {
      // 🚨 กรณี server ล่มหรือเชื่อมต่อไม่ได้
      console.error("Add employee error:", err);
      Swal.fire({
        icon: "error",
        title: "🚨 Server Error",
        text: "ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้",
      });
    } finally {
      setLoading(false); // ปิดสถานะโหลด
    }
  };

  // -----------------------------------------
  // ✅ ส่วนของ UI Dialog
  // -----------------------------------------
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
    >
      {/* กล่อง Dialog */}
      <div
        style={{
          background: "#fff",
          borderRadius: "12px",
          width: "80%",
          maxWidth: "900px",
          padding: "24px",
          maxHeight: "90vh", // จำกัดความสูงไม่ให้ล้นจอ
          overflowY: "auto", // ถ้ายาวเกินให้ scroll ได้
          boxShadow: "0 8px 20px rgba(0,0,0,0.25)",
        }}
      >
        {/* หัวข้อ */}
        <h3
          style={{
            textAlign: "center",
            marginBottom: "20px",
            color: "#444",
          }}
        >
          ➕ Add Employee
        </h3>

        {/* ✅ แบ่งฟอร์มเป็น 2 คอลัมน์แบบ grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "16px 20px",
          }}
        >
          {/* คอลัมน์ซ้าย: ข้อมูลส่วนตัว */}
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <input placeholder="First Name" value={form.first_name} onChange={(e) => setForm({ ...form, first_name: e.target.value })} style={inputStyle} />
            <input placeholder="Last Name" value={form.last_name} onChange={(e) => setForm({ ...form, last_name: e.target.value })} style={inputStyle} />
            <input placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} style={inputStyle} />
            <input type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} style={inputStyle} />
            <input type="password" placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} style={inputStyle} />
            <input placeholder="Address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} style={inputStyle} />

            {/* เพศ */}
            <select value={form.gender} onChange={(e) => setForm({ ...form, gender: Number(e.target.value) })} style={inputStyle}>
              <option value="">-- Select Gender --</option>
              <option value={1}>Male</option>
              <option value={2}>Female</option>
            </select>

            {/* ตำแหน่งงาน */}
            <select value={form.position_id} onChange={(e) => setForm({ ...form, position_id: Number(e.target.value) })} style={inputStyle}>
              <option value="">-- Select Position --</option>
              {positions.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          {/* คอลัมน์ขวา: ข้อมูลที่อยู่ */}
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {/* จังหวัด / อำเภอ / ตำบล */}
            <select value={form.province_id} onChange={(e) => setForm({ ...form, province_id: Number(e.target.value) })} style={inputStyle}>
              <option value="">-- Select Province --</option>
              {provinces.map((p) => (
                <option key={p.ProvinceID} value={p.ProvinceID}>
                  {p.ProvinceName}
                </option>
              ))}
            </select>

            <select value={form.district_id} onChange={(e) => setForm({ ...form, district_id: Number(e.target.value) })} style={inputStyle} disabled={!form.province_id}>
              <option value="">-- Select District --</option>
              {districts.map((d) => (
                <option key={d.DistrictID} value={d.DistrictID}>
                  {d.DistrictName}
                </option>
              ))}
            </select>

            <select value={form.subdistrict_id} onChange={(e) => setForm({ ...form, subdistrict_id: Number(e.target.value) })} style={inputStyle} disabled={!form.district_id}>
              <option value="">-- Select Subdistrict --</option>
              {subdistricts.map((s) => (
                <option key={s.SubdistrictID} value={s.SubdistrictID}>
                  {s.SubdistrictName} ({s.PostalCode})
                </option>
              ))}
            </select>

            {/* วันที่เริ่มงาน */}
            <label style={labelStyle}>Start Date:</label>
            <input type="date" value={form.start_date} onChange={(e) => setForm({ ...form, start_date: e.target.value })} style={inputStyle} />

            {/* สถานะพนักงาน */}
            <select value={form.status} onChange={(e) => setForm({ ...form, status: Number(e.target.value) })} style={inputStyle}>
              <option value={1}>ACTIVE</option>
              <option value={0}>INACTIVE</option>
            </select>
          </div>
        </div>

        {/* ปุ่ม Action: Cancel / Save */}
        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "24px", gap: "10px" }}>
          <button style={cancelBtn} onClick={onClose} disabled={loading}>
            ยกเลิก
          </button>
          <button style={saveBtn} onClick={handleSave} disabled={loading}>
            {loading ? "Saving..." : "บันทึก"}
          </button>
        </div>
      </div>
    </div>
  );
}

// -----------------------------------------
// ✅ CSS แบบ Inline ที่ใช้กับองค์ประกอบต่าง ๆ
// -----------------------------------------
const inputStyle = {
  width: "100%",
  padding: "10px",
  borderRadius: "8px",
  border: "1px solid #f8b4c4",
  fontSize: "14px",
};

const labelStyle = {
  fontSize: "13px",
  color: "#666",
  fontWeight: "bold",
  marginTop: "6px",
};

const cancelBtn = {
  padding: "8px 14px",
  border: "1px solid #ccc",
  borderRadius: "8px",
  background: "#f9f9f9",
  cursor: "pointer",
};

const saveBtn = {
  padding: "8px 14px",
  border: "none",
  borderRadius: "8px",
  background: "#ff4a74",
  color: "#fff",
  cursor: "pointer",
  fontWeight: "bold",
};
