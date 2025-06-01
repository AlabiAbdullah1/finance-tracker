import cron from "node-cron";
import Budget from "../src/models/Budget";
import Transaction from "../src/models/Transaction";
import { sendAdviceEmail } from "../src/utils/mail";

export const startBudgetAdvisorCron = () => {
  // Every Sunday at 8:00 AM
  cron.schedule("0 8 * * * 0", async () => {
    console.log("Running budget advisor...");

    try {
      const allBudgets = await Budget.find({}).populate("user", "email");

      for (const budget of allBudgets) {
        if (
          !budget.user ||
          typeof budget.user === "string" ||
          !("email" in budget.user)
        ) {
          console.warn("User not populated or missing email");
          continue;
        }

        const userId = budget.user._id;
        const userEmail = budget.user.email;

        const transactions = await Transaction.find({
          user: userId,
          //   date: { $gte: budget.createdAt },
        });

        const userIncome = transactions
          .map((tx) => (tx.type === "income" ? tx.amount : 0))
          .reduce((sum, amount) => sum + amount, 0);

        const totalSpent = transactions
          .filter((tx) => tx.type === "expense")
          .reduce((sum, tx) => sum + tx.amount, 0);

        const balance = userIncome - totalSpent;

        const advice = getBudgetAdvice(balance, budget.totalAmount);

        await sendAdviceEmail(userEmail, {
          budgetTitle: budget.title,
          totalBudget: budget.totalAmount,
          totalSpent,
          advice,
        });

        console.log(`Advice email sent to ${userEmail}`);
      }
    } catch (err) {
      console.error("Error running budget advisor cron job:", err);
    }
  });
};

const getBudgetAdvice = (balance: number, budgeted: number) => {
  if (balance === 0)
    return "⚠️ No income recorded yet. Consider logging your earnings.";
  if (balance < 0)
    return "⚠️ You're in debt! Review your expenses and cut unnecessary costs.";

  const ratio = budgeted / balance;

  if (ratio > 1)
    return "⚠️ You've budgeted more than your income. This could lead to debt!";
  if (ratio >= 0.9)
    return "✅ You're budgeting very tightly. Keep a close eye on expenses.";
  if (ratio >= 0.5) return "👍 You're managing your budget wisely. Great job!";
  return "🟢 You have room in your income. Consider saving or investing the excess.";
};
