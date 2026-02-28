import { useState, useEffect } from "react";
import { NavLink, useLocation, Link } from "react-router-dom";
import { Logo } from "../../assets/Images/image";

interface AdminSidebarProps {
  sidebarActive: boolean;
  setSidebarActive: React.Dispatch<React.SetStateAction<boolean>>;
}

const AdminSidebar = ({
  sidebarActive,
  setSidebarActive,
}: AdminSidebarProps) => {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const location = useLocation();

  const toggleDropdown = (menu: string) => {
    setOpenDropdown(openDropdown === menu ? null : menu);
  };

  // Auto open dropdown when child route active
  useEffect(() => {
    const path = location.pathname;

    if (
      path.startsWith("/mytree") ||
      path.startsWith("/directs") ||
      path.startsWith("/downlines")
    ) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setOpenDropdown("team");
    }

    if (path.startsWith("/x2")) {
      setOpenDropdown("x2");
    }

    if (path.startsWith("/x3")) {
      setOpenDropdown("x3");
    }

    if (path.startsWith("/income-x2")) {
      setOpenDropdown("incomeX2");
    }

    if (
      path.startsWith("/income-x3") ||
      path.startsWith("/mpr-income")
    ) {
      setOpenDropdown("incomeX3");
    }
  }, [location.pathname]);

  return (
    <nav className={`nav-sidebar ${sidebarActive ? "active" : ""}`}>
      <button
        className="sidebar-close"
        onClick={() => setSidebarActive(false)}
      >
        ×
      </button>

      <div className="brand-logo">
        <Link to="/dashboard">
          <img src={Logo} style={{ width: 160 }} alt="The Rich Crowd" />
        </Link>
      </div>

      <div className="nav-menu">

        {/* Dashboard */}
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            isActive ? "nav-item active" : "nav-item"
          }
        >
          <i className="fas fa-chart-line" />
          <span>Dashboard</span>
        </NavLink>

        {/* Profile */}
        <NavLink
          to="/profile"
          className={({ isActive }) =>
            isActive ? "nav-item active" : "nav-item"
          }
        >
          <i className="fas fa-user" />
          <span>Profile</span>
        </NavLink>

        {/* My Team */}
        <div className={`nav-dropdown ${openDropdown === "team" ? "dropdown-open active" : ""}`}>
          <a
            href="#"
            className="nav-item dropdown-trigger"
            onClick={(e) => {
              e.preventDefault();
              toggleDropdown("team");
            }}
          >
            <i className="fas fa-users" />
            <span>My Team</span>
            <i className="fas fa-chevron-down dropdown-icon" />
          </a>

          <div className="dropdown-menu">
            <NavLink to="/mytree" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
              <span>My Tree</span>
            </NavLink>
            <NavLink to="/directs" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
              <span>My Directs</span>
            </NavLink>
            <NavLink to="/downlines" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
              <span>Total Team</span>
            </NavLink>
          </div>
        </div>

        {/* X2 Deposit */}
        <div className={`nav-dropdown ${openDropdown === "x2" ? "dropdown-open active" : ""}`}>
          <a
            href="#"
            className="nav-item dropdown-trigger"
            onClick={(e) => {
              e.preventDefault();
              toggleDropdown("x2");
            }}
          >
            <i className="fas fa-wallet" />
            <span>X2 Deposit</span>
            <i className="fas fa-chevron-down dropdown-icon" />
          </a>

          <div className="dropdown-menu">
            <NavLink to="/x2-deposit" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
              <span>X2 BEP20 KSN Deposit</span>
            </NavLink>
            <NavLink to="/x2-deposit-history" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
              <span>X2 Deposit History</span>
            </NavLink>
            <NavLink to="/holding-history" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
              <span>Holding History</span>
            </NavLink>
            <NavLink to="/activate-upgrade-history" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
              <span>Activate & Upgrade History</span>
            </NavLink>
          </div>
        </div>

        {/* X3 Deposit */}
        <div className={`nav-dropdown ${openDropdown === "x3" ? "dropdown-open active" : ""}`}>
          <a
            href="#"
            className="nav-item dropdown-trigger"
            onClick={(e) => {
              e.preventDefault();
              toggleDropdown("x3");
            }}
          >
            <i className="fas fa-layer-group" />
            <span>X3 Deposit</span>
            <i className="fas fa-chevron-down dropdown-icon" />
          </a>

          <div className="dropdown-menu">
            <NavLink to="/x3-deposit" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
              <span>X3 BEP20 KSN Deposit</span>
            </NavLink>
            <NavLink to="/x3-deposit-history" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
              <span>X3 Deposit History</span>
            </NavLink>
            <NavLink to="/x3-staking-history" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
              <span>X3 Staking History</span>
            </NavLink>
            <NavLink to="/auto-compounding-history" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
              <span>Auto Compounding History</span>
            </NavLink>
          </div>
        </div>

        {/* Income X2 */}
        <div className={`nav-dropdown ${openDropdown === "incomeX2" ? "dropdown-open active" : ""}`}>
          <a
            href="#"
            className="nav-item dropdown-trigger"
            onClick={(e) => {
              e.preventDefault();
              toggleDropdown("incomeX2");
            }}
          >
            <i className="fas fa-money-bill-wave" />
            <span>Income X2</span>
            <i className="fas fa-chevron-down dropdown-icon" />
          </a>

          <div className="dropdown-menu">
            <NavLink to="/income-x2/direct-income" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
              <span>Direct Income</span>
            </NavLink>
            <NavLink to="/income-x2/hybrid-level-income" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
              <span>Hybrid Level Income</span>
            </NavLink>
            <NavLink to="/income-x2/trc-special-income" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
              <span>TRC Special Income</span>
            </NavLink>
            <NavLink to="/income-x2/royalty-income" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
              <span>Royalty Income</span>
            </NavLink>
            <NavLink to="/income-x2/reward-income" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
              <span>Reward Income</span>
            </NavLink>
            <NavLink to="/income-x2/income-ledger" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
              <span>Income Ledger</span>
            </NavLink>
          </div>
        </div>

        {/* Income X3 */}
        <div className={`nav-dropdown ${openDropdown === "incomeX3" ? "dropdown-open active" : ""}`}>
          <a
            href="#"
            className="nav-item dropdown-trigger"
            onClick={(e) => {
              e.preventDefault();
              toggleDropdown("incomeX3");
            }}
          >
            <i className="fas fa-hand-holding-usd" />
            <span>Income X3</span>
            <i className="fas fa-chevron-down dropdown-icon" />
          </a>

          <div className="dropdown-menu">
            <NavLink to="/mpr-income" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
              <span>MPR (Monthly Return)</span>
            </NavLink>
            <NavLink to="/income-x3/x3-direct-income" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
              <span>Direct Income</span>
            </NavLink>
            <NavLink to="/x3-hybrid-level-income" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
              <span>Hybrid Level Income</span>
            </NavLink>
            <NavLink to="/x3-income-ledger" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
              <span>Income Ledger</span>
            </NavLink>
          </div>
        </div>

        {/* Bonanza */}
        <NavLink
          to="/bonanza-business"
          className={({ isActive }) =>
            isActive ? "nav-item active" : "nav-item"
          }
        >
          <i className="fas fa-gift" />
          <span>Bonanza Business</span>
        </NavLink>

      </div>
    </nav>
  );
};

export default AdminSidebar;