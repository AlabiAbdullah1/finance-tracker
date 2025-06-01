import {
  getTransactions,
  createTransaction,
  deleteTransaction,
  getTransactionStats,
} from "../controllers/transactionController";
import Transaction from "../models/Transaction";
import Category from "../models/Category";

jest.mock("../models/Transaction");
jest.mock("../models/Category");

describe("Transaction Controller", () => {
  const mockUserId = "user123";

  let req: any;
  let res: any;

  beforeEach(() => {
    req = {
      user: { _id: mockUserId },
      body: {},
      params: {},
      query: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.clearAllMocks();
  });

  describe("getTransactions", () => {
    it("should return paginated transactions with metadata", async () => {
      const fakeTransactions = [{ _id: "t1" }, { _id: "t2" }];
      (Transaction.find as jest.Mock).mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue(fakeTransactions),
      });
      (Transaction.countDocuments as jest.Mock).mockResolvedValue(2);

      req.query = { filter: "all", sort: "date", order: "desc", page: "1", limit: "10" };

      await getTransactions(req, res);

      expect(Transaction.find).toHaveBeenCalledWith({ user: mockUserId });
      expect(res.json).toHaveBeenCalledWith({
        transactions: fakeTransactions,
        pagination: {
          total: 2,
          page: 1,
          limit: 10,
          totalPages: 1,
        },
      });
    });

    it("should handle errors", async () => {
      (Transaction.find as jest.Mock).mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockRejectedValue(new Error("DB error")),
      });

      await getTransactions(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: "DB error" });
    });
  });

  describe("createTransaction", () => {
    it("should create a transaction and return it populated", async () => {
      req.body = {
        type: "income",
        category: "cat123",
        amount: 100,
        date: "2023-01-01",
        description: "Test desc",
      };

      const categoryDoc = { _id: "cat123", user: mockUserId };
      (Category.findOne as jest.Mock).mockResolvedValue(categoryDoc);

      const newTransaction = { _id: "t123", ...req.body, user: mockUserId };
      (Transaction.create as jest.Mock).mockResolvedValue(newTransaction);

      (Transaction.findById as jest.Mock).mockReturnValue({
        populate: jest.fn().mockResolvedValue({ ...newTransaction, category: categoryDoc }),
      });

      await createTransaction(req, res);

      expect(Category.findOne).toHaveBeenCalledWith({ _id: "cat123", user: mockUserId });
      expect(Transaction.create).toHaveBeenCalledWith({
        user: mockUserId,
        type: "income",
        category: "cat123",
        amount: 100,
        date: new Date("2023-01-01"),
        description: "Test desc",
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ category: categoryDoc }));
    });

    it("should return 400 if category not found", async () => {
      (Category.findOne as jest.Mock).mockResolvedValue(null);

      await createTransaction(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: "Invalid category or category not found" });
    });

    it("should handle errors", async () => {
      (Category.findOne as jest.Mock).mockRejectedValue(new Error("Category error"));

      await createTransaction(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: "Category error" });
    });
  });

  describe("deleteTransaction", () => {
    it("should delete transaction and return message", async () => {
      req.params.id = "t123";
      (Transaction.findOneAndDelete as jest.Mock).mockResolvedValue({ _id: "t123" });

      await deleteTransaction(req, res);

      expect(Transaction.findOneAndDelete).toHaveBeenCalledWith({ _id: "t123", user: mockUserId });
      expect(res.json).toHaveBeenCalledWith({ message: "Transaction deleted" });
    });

    it("should return 404 if transaction not found", async () => {
      (Transaction.findOneAndDelete as jest.Mock).mockResolvedValue(null);

      await deleteTransaction(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: "Transaction not found" });
    });

    it("should handle errors", async () => {
      (Transaction.findOneAndDelete as jest.Mock).mockRejectedValue(new Error("Delete error"));

      await deleteTransaction(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: "Delete error" });
    });
  });

  describe("getTransactionStats", () => {
    it("should return aggregated stats", async () => {
      req.query = { startDate: "2023-01-01", endDate: "2023-12-31" };

      const aggregateResult = [
        { _id: "income", total: 1000, count: 5 },
        { _id: "expense", total: 400, count: 3 },
      ];

      (Transaction.aggregate as jest.Mock).mockResolvedValue(aggregateResult);

      await getTransactionStats(req, res);

      expect(Transaction.aggregate).toHaveBeenCalled();

      expect(res.json).toHaveBeenCalledWith({
        income: { total: 1000, count: 5 },
        expense: { total: 400, count: 3 },
        balance: 600,
      });
    });

    it("should return zero stats if no transactions", async () => {
      (Transaction.aggregate as jest.Mock).mockResolvedValue([]);

      await getTransactionStats(req, res);

      expect(res.json).toHaveBeenCalledWith({
        income: { total: 0, count: 0 },
        expense: { total: 0, count: 0 },
        balance: 0,
      });
    });

    it("should handle errors", async () => {
      (Transaction.aggregate as jest.Mock).mockRejectedValue(new Error("Aggregate error"));

      await getTransactionStats(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: "Aggregate error" });
    });
  });
});
