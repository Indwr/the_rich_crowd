// layouts/DashboardLayout.tsx
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "../dashboard.css"
import AdminHeader from "../Components/AdminComponent/AdminHeader";
import AdminSidebar from "../Components/AdminComponent/AdminSidebar";
import { useAppSelector } from "../store/redux";
import { useLogout } from "../features/auth/hooks/useLogout";
import { useDashboardData } from "../features/dashboard/hooks/useDashboardData";

const PROFILE_PATH = "/profile";

const DashboardLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const token = useAppSelector((state) => state.auth.token);
  const { logout } = useLogout();
  const { dashboardResponse, isDashboardLoading } = useDashboardData();
  const [sidebarActive, setSidebarActive] = useState(false);

  const toggleSidebar = () => {
    setSidebarActive(!sidebarActive);
  };

  useEffect(() => {
    if (!token) navigate('/login', { replace: true });
  }, [navigate, token]);

  const isProfileUpdated = dashboardResponse?.data?.user?.isProfileUpdated;

  useEffect(() => {
    if (!token || isDashboardLoading) return;
    const needsProfile = Number(isProfileUpdated) === 0;
    if (!needsProfile) return;
    const path = location.pathname.replace(/\/$/, "") || "/";
    const onProfilePage = path === PROFILE_PATH;
    if (!onProfilePage) {
      navigate(PROFILE_PATH, { replace: true });
    }
  }, [token, isDashboardLoading, isProfileUpdated, location.pathname, navigate]);

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