import React from "react";
import { useAuth } from "../contexts/AuthContext";
import TransactionManager from "../components/transactions/TransactionManager";
import { downloadTransactionsCSV } from "../api/transactionsApi";

const DashboardPage: React.FC = () => {
    const { user } = useAuth();

    const handleDownload = () => {
        downloadTransactionsCSV().catch((error) => {
            console.error("Download failed:", error);
            alert("Failed to download transactions.");
        });
    };

    return (
        <div className="dashboard-page">
            <div className="dashboard-header">
                <h1>Welcome, {user?.name}!</h1>
                <p className="subtitle">Manage your finances with ease</p>
            </div>

            <div className="dashboard-content">
                <TransactionManager />
                <button onClick={handleDownload} className="download-button">
                    Download Transactions (CSV)
                </button>
            </div>
        </div>
    );
};

export default DashboardPage;
