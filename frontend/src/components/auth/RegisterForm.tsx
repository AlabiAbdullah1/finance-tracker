import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../../api/authApi";
import { useAuth } from "../../contexts/AuthContext";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export const RegisterForm: React.FC = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        setIsLoading(true);

        try {
            const response = await registerUser(name, email, password);
            login(response.token, response);
            navigate("/check-email");
        } catch (err: any) {
            setError(err.response?.data?.error || "Registration failed");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="auth-form">
            <h2>Register</h2>
            {error && <div className="error-message">{error}</div>}
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="name">Name</label>
                    <input
                        id="name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        disabled={isLoading}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={isLoading}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <div className="password-input-wrapper">
                        <input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            minLength={6}
                            disabled={isLoading}
                        />
                        <span
                            className="toggle-password"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </span>
                    </div>
                </div>
                <div className="form-group">
                    <label htmlFor="confirmPassword">Confirm Password</label>
                    <div className="password-input-wrapper">
                        <input
                            id="confirmPassword"
                            type={showConfirmPassword ? "text" : "password"}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            minLength={6}
                            disabled={isLoading}
                        />
                        <span
                            className="toggle-password"
                            onClick={() =>
                                setShowConfirmPassword(!showConfirmPassword)
                            }
                        >
                            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                        </span>
                    </div>
                </div>
                <button type="submit" disabled={isLoading}>
                    {isLoading ? "Registering..." : "Register"}
                </button>
            </form>
        </div>
    );
};
