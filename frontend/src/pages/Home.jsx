import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <>
      {/* HERO SECTION */}
      <div className="hero">
        <div className="hero-overlay"></div>

        <div className="hero-content">
          <h1>Plan Your Perfect Event</h1>

          <p>
            Weddings • Birthdays • Corporate Events • Parties
            <br />
            We handle everything for you.
          </p>

          <div className="hero-buttons">
            <button
              className="primary"
              onClick={() => navigate("/register")}
            >
              Get Started
            </button>

            <button
              className="outline"
              onClick={() => navigate("/login")}
            >
              Login
            </button>
          </div>
        </div>
      </div>

      {/* STATS SECTION */}
      <div className="stats-section">
        <div className="stat-box">
          <h2>500+</h2>
          <p>Events Managed</p>
        </div>

        <div className="stat-box">
          <h2>300+</h2>
          <p>Happy Clients</p>
        </div>

        <div className="stat-box">
          <h2>50+</h2>
          <p>Event Types</p>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-content">
          <h3>Eventify</h3>

          <p>
            Making your celebrations memorable with
            seamless planning and management.
          </p>

          <div className="footer-links">
            <span onClick={() => navigate("/")}>Home</span>
            <span onClick={() => navigate("/login")}>Login</span>
            <span onClick={() => navigate("/register")}>Register</span>
          </div>

          <p className="footer-copy">
            © {new Date().getFullYear()} Eventify. All rights reserved.
          </p>
        </div>
      </footer>
    </>
  );
}
