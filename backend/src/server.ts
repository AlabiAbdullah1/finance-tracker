import { ENV } from "./config/env";
import connectDB from "./config/db";
import app from "./app";
import { startBudgetAdvisorCron } from "./budgetAdvisorCron";

const startServer = async () => {
    try {
        await connectDB();
        
        app.listen(ENV.PORT, () => {
            console.log(`Server running on port ${ENV.PORT}`);
        });
        startBudgetAdvisorCron()
    } catch (error) {
        console.error("Failed to start server:", error);
        process.exit(1);
    }
};

startServer();
