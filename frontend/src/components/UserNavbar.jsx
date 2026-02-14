import { NavLink, useNavigate } from "react-router-dom";

export default function UserNavbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user || user.role !== "client") return null;

  const logout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <nav
      className="navbar user-navbar"
      style={{ width: "100vw", marginLeft: "calc(-50vw + 50%)" }}
    >
      <div className="navbar-inner">
        {/* Brand */}
        <div className="navbar-brand">Master Unique</div>

        {/* Links */}
        <div className="navbar-links">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              isActive ? "active-link" : undefined
            }
          >
            Dashboard
          </NavLink>

          <NavLink
            to="/create"
            className={({ isActive }) =>
              isActive ? "active-link" : undefined
            }
          >
            Create Event
          </NavLink>

          {/* 🔥 NEW CATERING PAGE */}
          <NavLink
            to="/catering"
            className={({ isActive }) =>
              isActive ? "active-link" : undefined
            }
          >
            Catering
          </NavLink>

          <button
            className="logout-btn"
            onClick={logout}
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
