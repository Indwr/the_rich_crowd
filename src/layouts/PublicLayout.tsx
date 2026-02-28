// layouts/PublicLayout.tsx
import { Outlet } from "react-router-dom";
import '../index.css'

const PublicLayout = () => {
  return (
    <div className="public-layout">

      <Outlet />
    </div>
  );
};

export default PublicLayout;