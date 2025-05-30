import React from "react";
import { Link, useNavigate, NavLink } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

export const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };
  const [menuOpen, setMenuOpen] = React.useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
   <header className="header">
  <div className="header-content">
    <div className="logo">
      <NavLink to="/" className="logo-text">Finance<span>Tracker</span></NavLink>
    </div>

    {/* Hamburger for mobile */}
    <div
      className={`hamburger ${menuOpen ? "active" : ""}`}
      onClick={toggleMenu}
      aria-label="Toggle navigation menu"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') toggleMenu();
      }}
    >
      <span></span>
      <span></span>
      <span></span>
    </div>

    <nav className={`nav-links ${menuOpen ? "active" : ""}`}>
      {user ? (
        <>
          <NavLink to="/" className="nav-link" onClick={() => setMenuOpen(false)}>Dashboard</NavLink>
          <NavLink to="/categories" className="nav-link" onClick={() => setMenuOpen(false)}>Categories</NavLink>
          <NavLink to="/budgets" className="nav-link" onClick={() => setMenuOpen(false)}>Budget</NavLink>
          <div className="user-info">
            <span className="welcome-text">Hi, {user.name}</span>
            <button onClick={() => { handleLogout(); setMenuOpen(false); }} className="btn-logout">Logout</button>
          </div>
        </>
      ) : (
        <>
          <NavLink to="/login" className="nav-link" onClick={() => setMenuOpen(false)}>Login</NavLink>
          <NavLink to="/register" className="nav-link" onClick={() => setMenuOpen(false)}>Register</NavLink>
        </>
      )}
    </nav>
  </div>
</header>

  );
};

export default Header;
