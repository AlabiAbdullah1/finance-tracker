import axiosInstance from "./axiosInstance";
import { Transaction, TransactionsResponse } from "../types";

interface TransactionFilters {
    filter?: string;
    sort?: string;
    order?: string;
    page?: number;
    limit?: number;
    startDate?: string;
    endDate?: string;
}

export const getTransactions = async (filters: TransactionFilters = {}): Promise<TransactionsResponse> => {
    const { data } = await axiosInstance.get("/transactions", { params: filters });
    return data;
};

export const createTransaction = async (
    transaction: Omit<Transaction, "_id" | "user">
): Promise<Transaction> => {
    const { data } = await axiosInstance.post("/transactions", transaction);
    return data;
};

export const deleteTransaction = async (id: string): Promise<void> => {
    await axiosInstance.delete(`/transactions/${id}`);
};

export const getTransactionStats = async (startDate?: string, endDate?: string) => {
    const params: { startDate?: string; endDate?: string } = {};
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;

    const { data } = await axiosInstance.get("/transactions/stats", { params });
    return data;
};

// transactionsApi.ts
export const downloadTransactionsCSV = async () => {
    const response = await axiosInstance.get("/transactions/download", {
        responseType: "blob", // Important for downloading files
    });

    // Create a blob link to download
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "transactions.csv");
    document.body.appendChild(link);
    link.click();
    link.remove();
};
