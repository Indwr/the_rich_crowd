// layouts/DashboardLayout.tsx
import { Outlet } from "react-router-dom";
import "../dashboard.css"
import AdminHeader from "../Components/AdminComponent/AdminHeader";
import AdminSidebar from "../Components/AdminComponent/AdminSidebar";
import { useState } from "react";

const DashboardLayout = () => {
  const [sidebarActive, setSidebarActive] = useState(false);

  const toggleSidebar = () => {
    setSidebarActive(!sidebarActive);
  };

  return (
    <div className="dashboard-wrapper">

      <AdminHeader toggleSidebar={toggleSidebar} />

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