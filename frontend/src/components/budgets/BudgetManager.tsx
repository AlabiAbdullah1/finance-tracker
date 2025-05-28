// import React, { useEffect, useState } from "react";
// import { Budget, Category } from "../../types";
// import { getBudgets, createBudget, deleteBudget } from "../../api/budget";
// import { getCategories } from "../../api/categoriesApi"; // Adjust path as needed
// import BudgetForm from "./BudgetForm";
// import BudgetList from "./BudgetList";

// const BudgetManager: React.FC = () => {
//     const [budgets, setBudgets] = useState<Budget[]>([]);
//     const [categories, setCategories] = useState<Category[]>([]);
//     const [loading, setLoading] = useState(false);

//     const loadBudgets = async () => {
//         setLoading(true);
//         const [budgetData, categoryData] = await Promise.all([
//             getBudgets(),
//             getCategories(),
//         ]);
//         setBudgets(budgetData);
//         setCategories(categoryData);
//         setLoading(false);
//     };

//     useEffect(() => {
//         loadBudgets();
//     }, []);

//     const handleCreate = async (budget: Omit<Budget, "_id" | "user">) => {
//         setLoading(true);
//         const newBudget = await createBudget(budget);
//         setBudgets((prev) => [newBudget, ...prev]);
//         setLoading(false);
//     };

//     const handleDelete = async (id: string) => {
//         setLoading(true);
//         await deleteBudget(id);
//         setBudgets((prev) => prev.filter((b) => b._id !== id));
//         setLoading(false);
//     };

//     return (
//         <div className="budget-manager">
//             <h2>Budget Manager</h2>
//             <BudgetForm categories={categories} onSubmit={handleCreate} isLoading={loading} />
//             <BudgetList
//                 budgets={budgets}
//                 onDelete={handleDelete}
//                 categories={categories}
//                 isLoading={loading}
//             />
//         </div>
//     );
// };

// export default BudgetManager;
