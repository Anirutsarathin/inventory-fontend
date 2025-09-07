

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Employees from "./pages/Employees.jsx";
import Layout from "./pages/Layout.jsx";
import Managerole from "./pages/Managerole.jsx";
import Chemical_master from "./pages/Chemical_master.jsx";
import Chemical_stock from "./pages/Chemical_stock.jsx";


export default function App() {
  const [loggedIn, setLoggedIn] = useState(!!localStorage.getItem("auth_token"));

  const handleLogout = () => {
    localStorage.removeItem("auth_token");
    setLoggedIn(false);
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* หน้า login */}
        <Route path="/login" element={<Login onLoginSuccess={() => setLoggedIn(true)} />} />

        {/* ถ้า login แล้ว ให้เข้า Layout */}
        {loggedIn ? (
          <Route element={<Layout onLogout={handleLogout} />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/chemical/master" element={<Chemical_master/>} />
            <Route path="/chemical/stock-in" element={<Chemical_stock/>} />
            <Route path="/chemical/count" element={<h2>Count</h2>} />
            <Route path="/chemical/destroy" element={<h2>Destroy</h2>} />
            <Route path="/document" element={<h2>Document</h2>} />
            <Route path="/approve" element={<h2>Approve1</h2>} />
            <Route path="/admin/employees" element={<Employees />} />
            <Route path="/admin/roles" element={<Managerole />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Route>
        ) : (
          <Route path="*" element={<Navigate to="/login" replace />} />
        )}
      </Routes>
    </BrowserRouter>
  );
}
