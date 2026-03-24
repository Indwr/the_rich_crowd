import { Link } from "react-router-dom";
import { useNotificationUnread } from "src/features/history/hooks/useNotificationUnread";

interface AdminHeaderProps {
  toggleSidebar: () => void;
  onLogout: () => void;
}

const AdminHeader = ({ toggleSidebar, onLogout }: AdminHeaderProps) => {
  const { hasUnread } = useNotificationUnread();

  return (
    <>
      <header className="dashboard-header">
        <button className="burger-menu" onClick={toggleSidebar}>
          <i className="fas fa-bars" />
        </button>

        <div style={{ flexGrow: 1 }} />
        <div className="notification-box">
          <span className={`fa-layers fa-fw${hasUnread ? " active" : ""}`}>
            <Link to="/notifications" className="notification-header-link">
              <i className="fas fa-bell bell"></i>
            </Link>
            <span className="fa-layers-counter notification-bubble"></span>
          </span>
          <Link to="/notifications" className="notification-header-link">
            <span className="notification-text">Notification</span>
          </Link>
        </div>
        <Link
          to="https://linktr.ee/KSN_Token"
          className="btn-update header-btn"
          target="_blank"
          style={{ padding: "0.6rem 1.2rem", fontSize: "0.8rem" }}
        >
          <i className="fa-solid fa-share-from-square"></i>
          Our Social
        </Link>
        <Link
          to="https://keysystem.in"
          className="btn-update header-btn"
          target="_blank"
          style={{ padding: "0.6rem 1.2rem", fontSize: "0.8rem" }}
        >
          <i className="fa-solid fa-key"></i>
          Key
        </Link>

        <button type="button" className="btn-logout" onClick={onLogout}>
          <i className="fas fa-sign-out-alt" />
          <span className="logout-text">Logout</span>
        </button>
      </header>
    </>
  );
};

export default AdminHeader;
