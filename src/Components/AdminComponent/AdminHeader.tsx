
interface AdminHeaderProps {
  toggleSidebar: () => void;
}

const AdminHeader = ({ toggleSidebar }: AdminHeaderProps) => {
  return (
    <>
      <header className="dashboard-header">
        
        <button
          className="burger-menu"
          onClick={toggleSidebar}
        >
          <i className="fas fa-bars" />
        </button>

        <div style={{ flexGrow: 1 }} />

        <button
          type="button"
          className="btn-logout"
          onClick={undefined}
        >
          <i className="fas fa-sign-out-alt" />
          <span className="logout-text">Logout</span>
        </button>

      </header>

    </>
  );
};

export default AdminHeader;