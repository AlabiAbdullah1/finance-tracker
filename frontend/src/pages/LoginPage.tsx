import React from "react";
import { Navigate, Link } from "react-router-dom";
import { LoginForm } from "../components/auth/LoginForm";
import { useAuth } from "../contexts/AuthContext";

const LoginPage: React.FC = () => {
    const { user, isLoading } = useAuth();

    if (isLoading) {
        return (
            <div className="loading-container">
                <div className="spinner" aria-label="Loading">Loading...</div>
            </div>
        );
    }

    if (user) {
        return <Navigate to="/" replace />;
    }

   return (
    <div className="auth-page">
        <div className="auth-container">
            <h1 className="auth-heading">Login to Finance Tracker</h1>
            <div className="form-wrapper">
                <LoginForm />
            </div>
            <div className="auth-links">
                <p>
                    Don’t have an account? <Link to="/register" className="auth-link">Register here</Link>
                </p>
            </div>
        </div>
    </div>
);

};

export default LoginPage;
