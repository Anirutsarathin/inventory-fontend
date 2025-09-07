import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../styles/sidebar.css";
import { FiLogOut } from "react-icons/fi"; 


const MENU = [
  { name: "Dashboard", path: "/dashboard", children: [] },
  { 
    name: "Chemical", 
    children: [
      { name: "Chemical Master", path: "/chemical/master" },
      { name: "Stock In", path: "/chemical/stock-in" },
      { name: "Count", path: "/chemical/count" },
      { name: "Destroy", path: "/chemical/destroy" }
    ] 
  },
  { name: "Document", path: "/document", children: [] },
  { name: "Approve", path: "/approve", children: [] },
  { 
    name: "Admin Settings", 
    children: [
      { name: "Employees", path: "/admin/employees" },
      { name: "Manage Role", path: "/admin/roles" }
    ] 
  },
];

export default function Sidebar({ onLogout }) {
  const [openMenu, setOpenMenu] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const toggleMenu = (menuName) => {
    setOpenMenu(openMenu === menuName ? null : menuName);
  };

  return (
    <div className="sidebar">
      <div className="sidebar-top">  
        <h3>
          CHEMICAL INVENTORY
          <br /> MANAGEMENT SYSTEM
        </h3>
      </div>

      <div className="sidebar-middle">
        <nav className="menu">
          {MENU.map((item) => (
            <div key={item.name}>
              {item.children.length > 0 ? (
                <>
                  <button
                    className={`menu-button ${openMenu === item.name ? "is-active" : ""}`}
                    onClick={() => toggleMenu(item.name)}
                  >
                    {item.name}
                  </button>
                  {openMenu === item.name && (
                    <ul className="submenu">
                      {item.children.map((sub) => (
                        <li
                          key={sub.name}
                          className={`submenu-item ${location.pathname === sub.path ? "is-active" : ""}`}
                          onClick={() => navigate(sub.path)}
                        >
                          ▶ {sub.name}
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              ) : (
                <button
                  className={`menu-button ${location.pathname === item.path ? "is-active" : ""}`}
                  onClick={() => navigate(item.path)}
                >
                  {item.name}
                </button>
              )}
            </div>
          ))}
        </nav>
      </div>

      <div className="sidebar-bottom" onClick={onLogout}>
        <FiLogOut size={24} />
      </div>
    </div>
  );
}
