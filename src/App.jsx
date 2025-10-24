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
import History from "./pages/History.jsx"; // 🆕 เพิ่มหน้า History ใหม่

// ---------------------------------------------------------------------
// 🔹 Helper Function: ตรวจสอบสิทธิ์การเข้าถึงหน้า
// ---------------------------------------------------------------------
function hasPermission(page) {
  const permissions = JSON.parse(localStorage.getItem("permissions")) || [];
  return permissions.includes(page);
}

// ---------------------------------------------------------------------
// 🔹 ProtectedRoute Component: ใช้ห่อหน้าเพื่อตรวจสอบสิทธิ์ก่อนเข้า
// ---------------------------------------------------------------------
function ProtectedRoute({ page, children }) {
  if (!hasPermission(page)) {
    return (
      <h2 style={{ padding: "20px", color: "red" }}>🚫 ไม่มีสิทธิ์เข้าหน้านี้</h2>
    );
  }
  return children;
}

// ---------------------------------------------------------------------
// 🔹 App Component: จุดเริ่มต้นของแอป (จัดการ Routing หลักทั้งหมด)
// ---------------------------------------------------------------------
export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    setLoggedIn(!!localStorage.getItem("auth_token"));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user");
    localStorage.removeItem("permissions");
    setLoggedIn(false);
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* 🔸 หน้า Login */}
        <Route
          path="/login"
          element={<Login onLoginSuccess={() => setLoggedIn(true)} />}
        />

        {/* 🔸 ถ้า login แล้ว → เข้า Layout หลัก */}
        {loggedIn ? (
          <Route element={<Layout onLogout={handleLogout} />}>
            {/* 📊 Dashboard */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute page="Page Dashboard">
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            {/* ⚗️ Chemical Master */}
            <Route
              path="/chemical/master"
              element={
                <ProtectedRoute page="Page Chemical">
                  <Chemical_master />
                </ProtectedRoute>
              }
            />

            {/* 📦 Stock In */}
            <Route
              path="/chemical/stock-in"
              element={
                <ProtectedRoute page="Page Chemical">
                  <Chemical_stock />
                </ProtectedRoute>
              }
            />

            {/* 🔢 Count */}
            <Route
              path="/chemical/count"
              element={
                <ProtectedRoute page="Page Chemical">
                  <h2>Count</h2>
                </ProtectedRoute>
              }
            />

            {/* ☠️ Destroy */}
            <Route
              path="/chemical/destroy"
              element={
                <ProtectedRoute page="Page Chemical">
                  <h2>Destroy</h2>
                </ProtectedRoute>
              }
            />

            {/* 📜 History (เข้าได้ทุกคน) */}
            <Route
              path="/history"
              element={<History />} // ❌ ไม่ใช้ ProtectedRoute
            />

            {/* 📄 Document */}
            <Route
              path="/document"
              element={
                <ProtectedRoute page="Page Document">
                  <h2>Document</h2>
                </ProtectedRoute>
              }
            />

            {/* ✅ Approve */}
            <Route
              path="/approve"
              element={
                <ProtectedRoute page="Page Approval">
                  <h2>Approve</h2>
                </ProtectedRoute>
              }
            />

            {/* 👥 Employees */}
            <Route
              path="/admin/employees"
              element={
                <ProtectedRoute page="Page Admin">
                  <Employees />
                </ProtectedRoute>
              }
            />

            {/* 🧩 Role Management */}
            <Route
              path="/admin/roles"
              element={
                <ProtectedRoute page="Page Admin">
                  <Managerole />
                </ProtectedRoute>
              }
            />

            {/* 🧭 Default route */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Route>
        ) : (
          // 🔒 ถ้ายังไม่ login → redirect ไปหน้า login
          <Route path="*" element={<Navigate to="/login" replace />} />
        )}
      </Routes>
    </BrowserRouter>
  );
}
