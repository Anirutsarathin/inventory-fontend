// import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// import { useState, useEffect } from "react";
// import Login from "./pages/Login.jsx";
// import Dashboard from "./pages/Dashboard.jsx";
// import Employees from "./pages/Employees.jsx";
// import Layout from "./pages/Layout.jsx";
// import Managerole from "./pages/Managerole.jsx";
// import Chemical_master from "./pages/Chemical_master.jsx";
// import Chemical_stock from "./pages/Chemical_stock.jsx";

// // ✅ helper: เช็คสิทธิ์
// function hasPermission(page) {
//   const permissions = JSON.parse(localStorage.getItem("permissions")) || [];
//   return permissions.includes(page);
// }

// // ✅ route ป้องกันสิทธิ์
// function ProtectedRoute({ page, children }) {
//   if (!hasPermission(page)) {
//     return (
//       <h2 style={{ padding: "20px", color: "red" }}>
//         🚫 ไม่มีสิทธิ์เข้าหน้านี้
//       </h2>
//     );
//   }
//   return children;
// }

// export default function App() {
//   const [loggedIn, setLoggedIn] = useState(false);

//   useEffect(() => {
//     setLoggedIn(!!localStorage.getItem("auth_token"));
//   }, []);

//   const handleLogout = () => {
//     localStorage.removeItem("auth_token");
//     localStorage.removeItem("user");
//     localStorage.removeItem("permissions");
//     setLoggedIn(false);
//   };

//   return (
//     <BrowserRouter>
//       <Routes>
//         {/* หน้า login */}
//         <Route
//           path="/login"
//           element={<Login onLoginSuccess={() => setLoggedIn(true)} />}
//         />

//         {/* ถ้า login แล้ว ให้เข้า Layout */}
//         {loggedIn ? (
//           <Route element={<Layout onLogout={handleLogout} />}>
//             <Route
//               path="/dashboard"
//               element={
//                 <ProtectedRoute page="Page Dashboard">
//                   <Dashboard />
//                 </ProtectedRoute>
//               }
//             />
//             <Route
//               path="/chemical/master"
//               element={
//                 <ProtectedRoute page="Page Chemical">
//                   <Chemical_master />
//                 </ProtectedRoute>
//               }
//             />
//             <Route
//               path="/chemical/stock-in"
//               element={
//                 <ProtectedRoute page="Page Chemical">
//                   <Chemical_stock />
//                 </ProtectedRoute>
//               }
//             />
//             <Route
//               path="/chemical/count"
//               element={
//                 <ProtectedRoute page="Page Chemical">
//                   <h2>Count</h2>
//                 </ProtectedRoute>
//               }
//             />
//             <Route
//               path="/chemical/destroy"
//               element={
//                 <ProtectedRoute page="Page Chemical">
//                   <h2>Destroy</h2>
//                 </ProtectedRoute>
//               }
//             />
//             <Route
//               path="/document"
//               element={
//                 <ProtectedRoute page="Page Document">
//                   <h2>Document</h2>
//                 </ProtectedRoute>
//               }
//             />
//             <Route
//               path="/approve"
//               element={
//                 <ProtectedRoute page="Page Approval">
//                   <h2>Approve</h2>
//                 </ProtectedRoute>
//               }
//             />
//             <Route
//               path="/admin/employees"
//               element={
//                 <ProtectedRoute page="Page Admin">
//                   <Employees />
//                 </ProtectedRoute>
//               }
//             />
//             <Route
//               path="/admin/roles"
//               element={
//                 <ProtectedRoute page="Page Admin">
//                   <Managerole />
//                 </ProtectedRoute>
//               }
//             />

//             {/* ถ้า path ไม่เจอ → redirect ไป dashboard */}
//             <Route path="*" element={<Navigate to="/dashboard" replace />} />
//           </Route>
//         ) : (
//           // ถ้ายังไม่ login → บังคับไปหน้า login
//           <Route path="*" element={<Navigate to="/login" replace />} />
//         )}
//       </Routes>
//     </BrowserRouter>
//   );
// }

// ✅ นำเข้าโมดูลพื้นฐานของ React Router
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// ✅ ใช้ useState / useEffect เพื่อจัดการ state ของการ login
import { useState, useEffect } from "react";

// ✅ นำเข้า Page ต่าง ๆ ของระบบ
import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Employees from "./pages/Employees.jsx";
import Layout from "./pages/Render_main.jsx";
import Managerole from "./pages/Managerole.jsx";
import Chemical_master from "./pages/Chemical_master.jsx";
import Chemical_stock from "./pages/Chemical_stock.jsx";


// ---------------------------------------------------------------------
// 🔹 Helper Function: ตรวจสอบสิทธิ์การเข้าถึงหน้า
// ---------------------------------------------------------------------
function hasPermission(page) {
  // ดึงรายการสิทธิ์จาก localStorage
  const permissions = JSON.parse(localStorage.getItem("permissions")) || [];

  // คืนค่า true ถ้าสิทธิ์นั้นมีในรายการ
  return permissions.includes(page);
}


// ---------------------------------------------------------------------
// 🔹 ProtectedRoute Component: ใช้ห่อหน้าเพื่อตรวจสอบสิทธิ์ก่อนเข้า
// ---------------------------------------------------------------------
function ProtectedRoute({ page, children }) {
  // ถ้าไม่มีสิทธิ์ (hasPermission = false)
  if (!hasPermission(page)) {
    return (
      <h2 style={{ padding: "20px", color: "red" }}>
        🚫 ไม่มีสิทธิ์เข้าหน้านี้
      </h2>
    );
  }

  // ถ้ามีสิทธิ์ → แสดงเนื้อหาปกติ
  return children;
}


// ---------------------------------------------------------------------
// 🔹 App Component: จุดเริ่มต้นของแอป (จัดการ Routing หลักทั้งหมด)
// ---------------------------------------------------------------------
export default function App() {
  // ✅ สถานะการ login (true = login แล้ว)
  const [loggedIn, setLoggedIn] = useState(false);

  // ✅ เมื่อ component ถูก mount ครั้งแรก → ตรวจสอบว่าเคย login หรือไม่
  useEffect(() => {
    // ถ้ามี token เก็บอยู่ใน localStorage → ถือว่าผ่านการ login แล้ว
    setLoggedIn(!!localStorage.getItem("auth_token"));
  }, []);

  // ✅ ฟังก์ชัน logout (ใช้ใน Layout)
  const handleLogout = () => {
    // ลบข้อมูลที่เกี่ยวข้องออกจาก localStorage ทั้งหมด
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user");
    localStorage.removeItem("permissions");

    // อัปเดต state loggedIn = false เพื่อ redirect กลับหน้า login
    setLoggedIn(false);
  };

  // ---------------------------------------------------------------------
  // 🔹 ส่วนการ Routing หลักของระบบ (React Router v6)
  // ---------------------------------------------------------------------
  return (
    <BrowserRouter>
      <Routes>
        {/* ====================== */}
        {/* 🔸 Route หน้า Login */}
        {/* ====================== */}
        <Route
          path="/login"
          element={
            <Login
              // เมื่อ login สำเร็จ → setLoggedIn(true)
              onLoginSuccess={() => setLoggedIn(true)}
            />
          }
        />

        {/* ================================================================== */}
        {/* 🔸 ถ้า login แล้ว → แสดง Layout หลัก พร้อมเมนูด้านซ้าย/บน (Sidebar, Navbar) */}
        {/* ================================================================== */}
        {loggedIn ? (
          <Route element={<Layout onLogout={handleLogout} />}>
            {/* -------------------------------------------------------------- */}
            {/* 📊 Dashboard */}
            {/* -------------------------------------------------------------- */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute page="Page Dashboard">
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            {/* -------------------------------------------------------------- */}
            {/* ⚗️ Chemical Master Page (จัดการสารเคมีหลัก) */}
            {/* -------------------------------------------------------------- */}
            <Route
              path="/chemical/master"
              element={
                <ProtectedRoute page="Page Chemical">
                  <Chemical_master />
                </ProtectedRoute>
              }
            />

            {/* -------------------------------------------------------------- */}
            {/* 📦 Chemical Stock In (รับเข้าคลังสารเคมี) */}
            {/* -------------------------------------------------------------- */}
            <Route
              path="/chemical/stock-in"
              element={
                <ProtectedRoute page="Page Chemical">
                  <Chemical_stock />
                </ProtectedRoute>
              }
            />

            {/* -------------------------------------------------------------- */}
            {/* 🔢 Chemical Count (นับสต็อก) */}
            {/* -------------------------------------------------------------- */}
            <Route
              path="/chemical/count"
              element={
                <ProtectedRoute page="Page Chemical">
                  <h2>Count</h2>
                </ProtectedRoute>
              }
            />

            {/* -------------------------------------------------------------- */}
            {/* ☠️ Chemical Destroy (ทำลายสารเคมี) */}
            {/* -------------------------------------------------------------- */}
            <Route
              path="/chemical/destroy"
              element={
                <ProtectedRoute page="Page Chemical">
                  <h2>Destroy</h2>
                </ProtectedRoute>
              }
            />

            {/* -------------------------------------------------------------- */}
            {/* 📄 Document Management (จัดการเอกสาร) */}
            {/* -------------------------------------------------------------- */}
            <Route
              path="/document"
              element={
                <ProtectedRoute page="Page Document">
                  <h2>Document</h2>
                </ProtectedRoute>
              }
            />

            {/* -------------------------------------------------------------- */}
            {/* ✅ Approval Page (อนุมัติคำขอ) */}
            {/* -------------------------------------------------------------- */}
            <Route
              path="/approve"
              element={
                <ProtectedRoute page="Page Approval">
                  <h2>Approve</h2>
                </ProtectedRoute>
              }
            />

            {/* -------------------------------------------------------------- */}
            {/* 👥 Admin → Employee Management */}
            {/* -------------------------------------------------------------- */}
            <Route
              path="/admin/employees"
              element={
                <ProtectedRoute page="Page Admin">
                  <Employees />
                </ProtectedRoute>
              }
            />

            {/* -------------------------------------------------------------- */}
            {/* 🧩 Admin → Role Management */}
            {/* -------------------------------------------------------------- */}
            <Route
              path="/admin/roles"
              element={
                <ProtectedRoute page="Page Admin">
                  <Managerole />
                </ProtectedRoute>
              }
            />

            {/* -------------------------------------------------------------- */}
            {/* 🧭 Default route: ถ้า path ไม่เจอ → redirect ไป Dashboard */}
            {/* -------------------------------------------------------------- */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Route>
        ) : (
          // --------------------------------------------------------------
          // 🔒 ถ้ายังไม่ login → redirect ไปหน้า login เสมอ
          // --------------------------------------------------------------
          <Route path="*" element={<Navigate to="/login" replace />} />
        )}
      </Routes>
    </BrowserRouter>
  );
}
