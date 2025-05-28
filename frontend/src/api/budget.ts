import axios from './axiosInstance';

export const fetchBudgets = () => axios.get('/budget');
export const createBudget = (data: any) => axios.post('/budget/create', data);
export const updateBudget = (id: string, data: any) => axios.patch(`/budget/${id}`, data);
export const deleteBudget = (id: string) => axios.delete(`/budget/${id}`);
