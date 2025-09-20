import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Employees from "./pages/Employees.jsx";
import Layout from "./pages/Layout.jsx";
import Managerole from "./pages/Managerole.jsx";
import Chemical_master from "./pages/Chemical_master.jsx";
import Chemical_stock from "./pages/Chemical_stock.jsx";

// ✅ helper: เช็คสิทธิ์
function hasPermission(page) {
  const permissions = JSON.parse(localStorage.getItem("permissions")) || [];
  return permissions.includes(page);
}

// ✅ route ป้องกันสิทธิ์
function ProtectedRoute({ page, children }) {
  if (!hasPermission(page)) {
    return (
      <h2 style={{ padding: "20px", color: "red" }}>
        🚫 ไม่มีสิทธิ์เข้าหน้านี้
      </h2>
    );
  }
  return children;
}

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
        {/* หน้า login */}
        <Route
          path="/login"
          element={<Login onLoginSuccess={() => setLoggedIn(true)} />}
        />

        {/* ถ้า login แล้ว ให้เข้า Layout */}
        {loggedIn ? (
          <Route element={<Layout onLogout={handleLogout} />}>
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute page="Page Dashboard">
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/chemical/master"
              element={
                <ProtectedRoute page="Page Chemical">
                  <Chemical_master />
                </ProtectedRoute>
              }
            />
            <Route
              path="/chemical/stock-in"
              element={
                <ProtectedRoute page="Page Chemical">
                  <Chemical_stock />
                </ProtectedRoute>
              }
            />
            <Route
              path="/chemical/count"
              element={
                <ProtectedRoute page="Page Chemical">
                  <h2>Count</h2>
                </ProtectedRoute>
              }
            />
            <Route
              path="/chemical/destroy"
              element={
                <ProtectedRoute page="Page Chemical">
                  <h2>Destroy</h2>
                </ProtectedRoute>
              }
            />
            <Route
              path="/document"
              element={
                <ProtectedRoute page="Page Document">
                  <h2>Document</h2>
                </ProtectedRoute>
              }
            />
            <Route
              path="/approve"
              element={
                <ProtectedRoute page="Page Approval">
                  <h2>Approve</h2>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/employees"
              element={
                <ProtectedRoute page="Page Admin">
                  <Employees />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/roles"
              element={
                <ProtectedRoute page="Page Admin">
                  <Managerole />
                </ProtectedRoute>
              }
            />

            {/* ถ้า path ไม่เจอ → redirect ไป dashboard */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Route>
        ) : (
          // ถ้ายังไม่ login → บังคับไปหน้า login
          <Route path="*" element={<Navigate to="/login" replace />} />
        )}
      </Routes>
    </BrowserRouter>
  );
}
