import React, { useEffect, useState } from 'react';
import { fetchBudgets, createBudget, updateBudget, deleteBudget } from '../api/budget';
import BudgetForm from '../components/budgets/BudgetForm';
import BudgetList from '../components/budgets/BudgetList';
// import '../styles/Budget.css';

const BudgetPage: React.FC = () => {
  const [budgets, setBudgets] = useState<any[]>([]);
  const [editingBudget, setEditingBudget] = useState<any | null>(null);

  const loadBudgets = async () => {
    try {
      const response = await fetchBudgets();
      setBudgets(response.data.budgets);
    } catch (error) {
      console.error('Error fetching budgets:', error);
    }
  };

  useEffect(() => {
    loadBudgets();
  }, []);

  const handleCreate = async (data: any) => {
    try {
      await createBudget(data);
      loadBudgets();
    } catch (error) {
      console.error('Error creating budget:', error);
    }
  };

  const handleUpdate = async (data: any) => {
    try {
      if (editingBudget) {
        await updateBudget(editingBudget._id, data);
        setEditingBudget(null);
        loadBudgets();
      }
    } catch (error) {
      console.error('Error updating budget:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteBudget(id);
      loadBudgets();
    } catch (error) {
      console.error('Error deleting budget:', error);
    }
  };

  const handleEdit = (budget: any) => {
    setEditingBudget(budget);
  };

  return (
    <div className="budget-page">
      <BudgetForm onSubmit={editingBudget ? handleUpdate : handleCreate} initialData={editingBudget} />
      <BudgetList budgets={budgets} onEdit={handleEdit} onDelete={handleDelete} />
    </div>
  );
};

export default BudgetPage;
