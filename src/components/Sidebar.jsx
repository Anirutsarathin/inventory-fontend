// ✅ import hook และเครื่องมือที่จำเป็น
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../styles/sidebar.css";
import { FiLogOut } from "react-icons/fi"; // ไอคอนออกจากระบบ

// ✅ กำหนดเมนูทั้งหมดใน Sidebar
const MENU = [
  { name: "Dashboard", page: "Page Dashboard", path: "/dashboard", children: [] },
  {
    name: "Chemical",
    page: "Page Chemical",
    children: [
      { name: "Chemical Master", page: "Page Chemical", path: "/chemical/master" },
      { name: "Stock In", page: "Page Chemical", path: "/chemical/stock-in" },
      { name: "Count", page: "Page Chemical", path: "/chemical/count" },
      { name: "Destroy", page: "Page Chemical", path: "/chemical/destroy" },
    ],
  },
  { name: "Document", page: "Page Document", path: "/document", children: [] },
  { name: "Approve", page: "Page Approval", path: "/approve", children: [] },
  {
    name: "Admin Settings",
    page: "Page Admin",
    children: [
      { name: "Employees", page: "Page Admin", path: "/admin/employees" },
      { name: "Manage Role", page: "Page Admin", path: "/admin/roles" },
    ],
  },
];

// ✅ Component หลักของ Sidebar
export default function Sidebar({ onLogout }) {
  const [openMenu, setOpenMenu] = useState(null); // เก็บชื่อเมนูที่ถูกเปิดอยู่ (ใช้พับ/ขยาย)
  const navigate = useNavigate(); // ใช้เปลี่ยนหน้า
  const location = useLocation(); // ใช้เช็ค path ปัจจุบันว่าหน้าไหนกำลัง active

  // ✅ อ่านสิทธิ์การเข้าถึงจาก localStorage (ถ้ามี)
  const permissions = JSON.parse(localStorage.getItem("permissions")) || [];

  // ✅ ฟังก์ชันสลับเปิด/ปิดเมนู
  const toggleMenu = (menuName) => {
    // ถ้ากดเมนูเดิมซ้ำ → ปิด (พับ)
    setOpenMenu(openMenu === menuName ? null : menuName);
  };

  // ✅ กรองเมนูตามสิทธิ์ผู้ใช้
  const filteredMenu = MENU.filter(
    (item) => !item.page || permissions.includes(item.page)
  ).map((item) => ({
    ...item,
    children: item.children.filter(
      (sub) => !sub.page || permissions.includes(sub.page)
    ),
  }));

  return (
    <div className="sidebar">
      {/* ส่วนหัว */}
      <div className="sidebar-top">
        <h3>
          CHEMICAL INVENTORY
          <br /> MANAGEMENT SYSTEM
        </h3>
      </div>

      {/* ส่วนเมนูกลาง */}
      <div className="sidebar-middle">
        <nav className="menu">
          {filteredMenu.map((item) => {
            // ✅ เช็คว่า submenu ไหน active
            const isSubActive = item.children.some(
              (sub) => location.pathname === sub.path
            );
            // ✅ เช็คว่าเมนูหลัก active ไหม
            const isMainActive = location.pathname === item.path;

            return (
              <div key={item.name}>
                {/* ===== กรณีมี Submenu ===== */}
                {item.children.length > 0 ? (
                  <>
                    {/* ปุ่มเมนูหลัก */}
                    <button
                      className={`menu-button ${
                        openMenu === item.name ? "is-active" : ""
                      }`}
                      onClick={() => toggleMenu(item.name)}
                    >
                      {/* เปลี่ยนลูกศรแสดงสถานะเปิด/ปิด */}
                      {openMenu === item.name ? "▼" : "▶"} {item.name}
                    </button>

                    {/* แสดงรายการ Submenu เมื่อเมนูนี้ถูกเปิด */}
                    {openMenu === item.name && (
                      <ul className="submenu">
                        {item.children.map((sub) => (
                          <li
                            key={sub.name}
                            className={`submenu-item ${
                              location.pathname === sub.path ? "is-active" : ""
                            }`}
                            onClick={() => {
                              navigate(sub.path); // เมื่อคลิกให้เปลี่ยนหน้า
                            }}
                          >
                            {/* ลูกศรหน้า Submenu */}
                            {location.pathname === sub.path ? "▼" : "▶"} {sub.name}
                          </li>
                        ))}
                      </ul>
                    )}
                  </>
                ) : (
                  // ===== กรณีไม่มี Submenu =====
                  <button
                    className={`menu-button ${isMainActive ? "is-active" : ""}`}
                    onClick={() => {
                      navigate(item.path); // เปลี่ยนหน้า
                      setOpenMenu(null); // ปิดเมนูอื่นเมื่อเปลี่ยนหน้า
                    }}
                  >
                    {item.name}
                  </button>
                )}
              </div>
            );
          })}
        </nav>
      </div>

      {/* ส่วนล่าง - ปุ่ม Logout */}
      <div className="sidebar-bottom" onClick={onLogout}>
        <FiLogOut size={24} />
      </div>
    </div>
  );
}
