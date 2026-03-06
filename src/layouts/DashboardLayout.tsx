// layouts/DashboardLayout.tsx
import { Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../dashboard.css"
import AdminHeader from "../Components/AdminComponent/AdminHeader";
import AdminSidebar from "../Components/AdminComponent/AdminSidebar";
import { useAppSelector } from "../store/redux";
import { useLogout } from "../features/auth/hooks/useLogout";

const DashboardLayout = () => {
  const navigate = useNavigate();
  const token = useAppSelector((state) => state.auth.token);
  const { logout } = useLogout();
  const [sidebarActive, setSidebarActive] = useState(false);

  const toggleSidebar = () => {
    setSidebarActive(!sidebarActive);
  };

  useEffect(() => {
    if (!token) navigate('/login', { replace: true });
  }, [navigate, token]);

  return (
    <div className="dashboard-wrapper">

      <AdminHeader toggleSidebar={toggleSidebar} onLogout={logout} />

      <AdminSidebar
        sidebarActive={sidebarActive}
        setSidebarActive={setSidebarActive}
      />

      <div className="dashboard-content">
        <Outlet />
      </div>

    </div>
  );
};

export default DashboardLayout;