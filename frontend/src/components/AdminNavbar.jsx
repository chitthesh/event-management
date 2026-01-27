import { NavLink, useNavigate } from "react-router-dom";

export default function AdminNavbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user || user.role !== "admin") return null;

  const logout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <nav
      className="navbar admin-navbar"
      style={{ width: "100vw", marginLeft: "calc(-50vw + 50%)" }}
    >
      <div className="navbar-inner">
        
        {/* BRAND */}
        <div className="navbar-brand">
          Master Unique
        </div>

        {/* LINKS */}
        <div className="navbar-links">
          
          <NavLink
            to="/admin"
            className={({ isActive }) =>
              isActive ? "active-link" : undefined
            }
          >
            Dashboard
          </NavLink>

          <NavLink
            to="/admin/event-types"
            className={({ isActive }) =>
              isActive ? "active-link" : undefined
            }
          >
            Event Types
          </NavLink>

          <NavLink
            to="/admin/catering"
            className={({ isActive }) =>
              isActive ? "active-link" : undefined
            }
          >
            Catering
          </NavLink>

          {/* ✅ NEW DECORATION LINK */}
          <NavLink
            to="/admin/decorations"
            className={({ isActive }) =>
              isActive ? "active-link" : undefined
            }
          >
            Decorations
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
