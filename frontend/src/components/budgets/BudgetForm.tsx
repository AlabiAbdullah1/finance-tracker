import React, { useState } from 'react';

interface BudgetFormProps {
  onSubmit: (data: any) => Promise<void>; // assume async function
  initialData?: any;
}

const BudgetForm: React.FC<BudgetFormProps> = ({ onSubmit, initialData }) => {
  const [title, setTitle] = useState(initialData?.title || '');
  const [category, setCategory] = useState(initialData?.category || '');
  const [type, setType] = useState(initialData?.type || 'INCOME');
  const [items, setItems] = useState(initialData?.items || [{ name: '', amount: 0 }]);
  const [submitting, setSubmitting] = useState(false);

  const handleItemChange = (index: number, field: string, value: any) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  const addItem = () => setItems([...items, { name: '', amount: 0 }]);

  const resetForm = () => {
    setTitle('');
    setCategory('');
    setType('INCOME');
    setItems([{ name: '', amount: 0 }]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onSubmit({ title, category, type, items });
      resetForm(); // Clear the form after successful creation
    } catch (err) {
      console.error('Error creating budget:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="budget-form" onSubmit={handleSubmit}>
      <h2>{initialData ? 'Edit Budget' : 'Create Budget'}</h2>

      <label>
        Title:
        <input value={title} onChange={(e) => setTitle(e.target.value)} required />
      </label>

      <label>
        Category:
        <input value={category} onChange={(e) => setCategory(e.target.value)} required />
      </label>

      <label>
        Type:
        <select value={type} onChange={(e) => setType(e.target.value)} required>
          <option value="INCOME">INCOME</option>
          <option value="EXPENSE">EXPENSE</option>
        </select>
      </label>

      <div className="items">
        {items.map((item:any, index:number) => (
          <div key={index} className="item">
            <input
              placeholder="Item Name"
              value={item.name}
              onChange={(e) => handleItemChange(index, 'name', e.target.value)}
              required
            />
            <input
              type="number"
              placeholder="Amount"
              value={item.amount}
              onChange={(e) => handleItemChange(index, 'amount', parseFloat(e.target.value))}
              required
            />
          </div>
        ))}
      </div>

      <button type="button" onClick={addItem}>Add Item</button>
      <button type="submit" disabled={submitting}>
        {submitting ? 'Submitting...' : initialData ? 'Update' : 'Create'}
      </button>
    </form>
  );
};

export default BudgetForm;
