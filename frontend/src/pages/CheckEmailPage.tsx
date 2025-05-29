// src/pages/CheckEmailPage.tsx
import React from "react";
// import { Link } from "react-router-dom";
import { FaEnvelopeOpenText } from "react-icons/fa";

const CheckEmailPage: React.FC = () => {
    return (
        <div className="verify-page">
            <div className="verify-container">
                <FaEnvelopeOpenText className="verify-icon" />
                <h2>Verify Your Email</h2>
                <p>We've sent a verification link to your email address.</p>
                <p>Please check your inbox and click the link to activate your account.</p>
                {/* <p>
                    Didn’t receive it? <Link to="/resend-verification">Resend Email</Link>
                </p> */}
            </div>
        </div>
    );
};

export default CheckEmailPage;
