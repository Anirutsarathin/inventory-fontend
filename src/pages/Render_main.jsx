import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";

export default function Layout({ onLogout }) {
  return (
    <div className="dashboard">
      <Sidebar onLogout={onLogout} />
      <div className="content">
        <Outlet />   {/* เนื้อหาของแต่ละ Route จะมา render ที่นี่ */}
      </div>
    </div>
  );
}
