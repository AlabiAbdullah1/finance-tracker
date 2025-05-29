import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { NavLink } from "react-router-dom";

export const Header: React.FC = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <header className="header">
            <div className="header-content">
                <div className="header-left">
                    <a href="/"><h1>SmartSpend</h1></a>
                </div>
                <nav className="header-nav">
                    {user ? (
                        <>
                            <Link to="/">Dashboard</Link>
                            <Link to="/categories">Categories</Link>
                            <Link to="/budgets">Budget</Link> 
                            <div className="header-user">
                                <span>Welcome, {user.name}</span>
                                <button onClick={handleLogout} className="logout-button">
                                    Logout
                                </button>
                            </div>
                        </>
                    ) : (
                        <>
                            <Link to="/login">Login</Link>
                            <Link to="/register">Register</Link>
                        </>
                    )}
                </nav>
            </div>
        </header>
    );
};

export default Header;
