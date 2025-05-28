import React from 'react';
// import '../styles/Budget.css';

interface BudgetListProps {
  budgets: any[];
  onEdit: (budget: any) => void;
  onDelete: (id: string) => void;
}

const BudgetList: React.FC<BudgetListProps> = ({ budgets, onEdit, onDelete }) => {
    console.log(budgets)
  return (
    <div className="budget-list">
      <h2>Budgets</h2>
      {budgets.map((budget) => (
        
        <div key={budget._id} className="budget-item">
          <h3>{budget.title}</h3>
          <p>Total Amount: {budget.totalAmount}</p>
          <button onClick={() => onEdit(budget)}>Edit</button>
          <button onClick={() => onDelete(budget._id)}>Delete</button>
        </div>
      ))}
    </div>
  );
};

export default BudgetList;
