import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/login.css";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai"; // ✅ import ไอคอนตา


// 🔹 คอมโพเนนต์หลักสำหรับหน้า Login
export default function Login({ onLoginSuccess }) {
  // -------------------------------
  // ✅ กำหนด state สำหรับเก็บค่าต่าง ๆ
  // -------------------------------
  const [username, setUsername] = useState("");   // เก็บค่าชื่อผู้ใช้ (เบอร์โทรหรืออีเมล)
  const [password, setPassword] = useState("");   // เก็บค่ารหัสผ่าน
  const [showPwd, setShowPwd] = useState(false);  // สำหรับเปิด/ปิดการแสดงรหัสผ่าน
  const [error, setError] = useState("");         // สำหรับแสดงข้อความ error
  const navigate = useNavigate();                 // ใช้สำหรับเปลี่ยนหน้า (redirect)

  // -------------------------------
  // ✅ ฟังก์ชันเมื่อกดปุ่ม Submit (เข้าสู่ระบบ)
  // -------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault(); // ป้องกันหน้ารีเฟรชเมื่อกด submit
    setError("");       // เคลียร์ error เดิมก่อนเริ่มใหม่

    try {
      // 🔹 เรียก API ฝั่ง backend ที่ URL /api/login
      const res = await fetch("http://localhost:3000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user: username, password }), // ส่งข้อมูล username และ password ไปตรวจสอบ
      });

      // 🔹 ถ้า status code ไม่ใช่ 200 (เช่น 401 หรือ 500)
      if (!res.ok) {
        const errData = await res.json();
        setError(errData.error || "User or password incorrect"); // แสดงข้อความ error
        return;
      }

      // 🔹 ถ้าเข้าสู่ระบบสำเร็จ ดึงข้อมูล response จาก backend
      const data = await res.json();

      // ✅ บันทึกข้อมูล token และสิทธิ์ลง localStorage
      localStorage.setItem("auth_token", data.token);                     // token สำหรับยืนยันตัวตน (ใช้กับ API อื่น)
      localStorage.setItem("user", JSON.stringify(data.user));            // เก็บข้อมูลผู้ใช้ (เช่น ชื่อ, แผนก)
      localStorage.setItem("permissions", JSON.stringify(data.permissions || [])); // เก็บสิทธิ์ของผู้ใช้แต่ละหน้า

      // ✅ แจ้ง parent component ว่า login สำเร็จ
      onLoginSuccess();

      // ✅ เปลี่ยนหน้าไปที่ Dashboard หลังจาก login สำเร็จ
      navigate("/dashboard");
    } catch (err) {
      // 🔹 กรณี server ล่ม หรือ fetch ไม่สำเร็จ
      console.error("Login error:", err);
      setError("Server error, please try again later.");
    }
  };

  // -------------------------------
  // ✅ ส่วนของการแสดงผลหน้าเว็บ (UI)
  // -------------------------------
  return (
    <div className="container">
      <div className="login-box">
        {/* หัวข้อใหญ่ของระบบ */}
        <h1>
          CHEMICAL INVENTORY
          <br /> MANAGEMENT SYSTEM
        </h1>

        {/* ฟอร์มเข้าสู่ระบบ */}
        <form onSubmit={handleSubmit}>
          {/* ช่องกรอกชื่อผู้ใช้ */}
          <input
            type="text"
            placeholder="Phone or Email"
            value={username}
            onChange={(e) => setUsername(e.target.value)} // อัปเดต state เมื่อพิมพ์
          />

          {/* ช่องกรอกรหัสผ่าน + ปุ่ม toggle แสดง/ซ่อน */}
          <div className="password-box">
            <input
              type={showPwd ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <span className="toggle" onClick={() => setShowPwd((v) => !v)}>
              {showPwd ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
            </span>
          </div>


          {/* แสดงข้อความ error ถ้ามี */}
          {error && <p className="error">{error}</p>}

          {/* ปุ่มเข้าสู่ระบบ */}
          <button type="submit">LOG IN</button>
        </form>
      </div>
    </div>
  );
}
