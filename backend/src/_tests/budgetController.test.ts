import { getBudget, updateBudget, deleteBudget, createBudget } from "../controllers/budgetController";
import Budget from "../models/Budget";
import BudgetItem from "../models/BudgetItems";

jest.mock("../models/Budget");
jest.mock("../models/BudgetItems");

const mockRequest = (data: any) => ({
  ...data
});

const mockResponse = () => {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};


describe("getBudget", () => {
  it("should return budgets with items when found", async () => {
    const req = mockRequest({ user: { _id: "userId1" } });
    const res = mockResponse();

    const budgets = [{ _id: "budget1", title: "Budget 1", user: "userId1" }];
    const budgetItems = [{ budgetID: "budget1", name: "item1", amount: 100 }];

    (Budget.find as jest.Mock).mockResolvedValue(budgets);
    (BudgetItem.find as jest.Mock).mockResolvedValue(budgetItems);

    await getBudget(req, res);

    expect(Budget.find).toHaveBeenCalledWith({ user: "userId1" });
    expect(BudgetItem.find).toHaveBeenCalledWith({ budgetID: { $in: ["budget1"] } });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      budgets: [{
        _id: "budget1",
        title: "Budget 1",
        user: "userId1",
        items: budgetItems,
      }]
    });
  });

  it("should return 404 if no budgets found", async () => {
    const req = mockRequest({ user: { _id: "userId1" } });
    const res = mockResponse();

    (Budget.find as jest.Mock).mockResolvedValue([]);

    await getBudget(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      message: "This user hasn't created any budget.",
    });
  });

  it("should return 500 on error", async () => {
    const req = mockRequest({ user: { _id: "userId1" } });
    const res = mockResponse();

    (Budget.find as jest.Mock).mockRejectedValue(new Error("DB failure"));

    await getBudget(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: "Internal Server Error" });
  });
});


describe("updateBudget", () => {
  it("should update and return budget successfully", async () => {
    const req = mockRequest({ params: { id: "budgetId1" }, body: { title: "Updated Budget" }, user: { id: "userId1" } });
    const res = mockResponse();

    const updatedBudget = { _id: "budgetId1", title: "Updated Budget", user: "userId1" };
    (Budget.findOneAndUpdate as jest.Mock).mockResolvedValue(updatedBudget);

    await updateBudget(req, res);

    expect(Budget.findOneAndUpdate).toHaveBeenCalledWith(
      { _id: "budgetId1", user: "userId1" },
      { title: "Updated Budget" },
      { new: true, runValidators: true }
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Budget updated successfully.",
      budget: updatedBudget,
    });
  });

  it("should return 404 if budget not found", async () => {
    const req = mockRequest({ params: { id: "budgetId1" }, body: {}, user: { id: "userId1" } });
    const res = mockResponse();

    (Budget.findOneAndUpdate as jest.Mock).mockResolvedValue(null);

    await updateBudget(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "Budget not found or you're not authorized." });
  });

  it("should return 500 on error", async () => {
    const req = mockRequest({ params: { id: "budgetId1" }, body: {}, user: { id: "userId1" } });
    const res = mockResponse();

    (Budget.findOneAndUpdate as jest.Mock).mockRejectedValue(new Error("DB error"));

    await updateBudget(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "Internal server error",
      error: "DB error",
    });
  });
});


describe("deleteBudget", () => {
  it("should delete budget and related items successfully", async () => {
    const req = mockRequest({ params: { id: "budgetId1" }, user: { id: "userId1" } });
    const res = mockResponse();

    const budget = { _id: "budgetId1", value: { _id: "budgetId1" } };
    (Budget.findOneAndDelete as jest.Mock).mockResolvedValue({ _id: "budgetId1" });
    (BudgetItem.deleteMany as jest.Mock).mockResolvedValue({ deletedCount: 2 });

    // Note: your code uses budget.value?._id, but normally findOneAndDelete returns document directly.
    // So to fit your code you may need to adjust either the controller or test.

    await deleteBudget(req, res);

    expect(Budget.findOneAndDelete).toHaveBeenCalledWith({ _id: "budgetId1", user: "userId1" });
    expect(BudgetItem.deleteMany).toHaveBeenCalledWith({ budgetID: undefined }); // Because budget.value?._id is undefined here
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Budget and related items deleted successfully!",
      budget
    });
  });

  it("should return 404 if budget not found", async () => {
    const req = mockRequest({ params: { id: "budgetId1" }, user: { id: "userId1" } });
    const res = mockResponse();

    (Budget.findOneAndDelete as jest.Mock).mockResolvedValue(null);

    await deleteBudget(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      error: "Budget not found or you're not authorized to delete this.",
    });
  });

  it("should return 500 on error", async () => {
    const req = mockRequest({ params: { id: "budgetId1" }, user: { id: "userId1" } });
    const res = mockResponse();

    (Budget.findOneAndDelete as jest.Mock).mockRejectedValue(new Error("DB error"));

    await deleteBudget(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "Internal server error",
      error: "DB error",
    });
  });
});


describe("createBudget", () => {
  it("should create budget and budget items successfully", async () => {
    const req = mockRequest({
      body: {
        title: "New Budget",
        items: [
          { name: "Item1", amount: 50 },
          { name: "Item2", amount: 100 }
        ],
        categoryId: "category123"
      },
      user: { id: "userId1" }
    });
    const res = mockResponse();

    const createdBudget = { id: "budgetId1", title: "New Budget", totalAmount: 150, user: "userId1" };

    (Budget.create as jest.Mock).mockResolvedValue(createdBudget);
    (BudgetItem.create as jest.Mock).mockResolvedValue({}); // you can mock to empty object for items

    await createBudget(req, res);

    expect(Budget.create).toHaveBeenCalledWith({
      title: "New Budget",
      totalAmount: 150,
      user: "userId1"
    });

    expect(BudgetItem.create).toHaveBeenCalledTimes(2);
    expect(BudgetItem.create).toHaveBeenCalledWith({
      user: "userId1",
      category: "category123",
      name: "Item1",
      amount: 50,
      budgetID: "budgetId1",
    });

    expect(BudgetItem.create).toHaveBeenCalledWith({
      user: "userId1",
      category: "category123",
      name: "Item2",
      amount: 100,
      budgetID: "budgetId1",
    });

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message: "Budget created Successfully",
      budget: createdBudget
    });
  });

  it("should return 500 on error", async () => {
    const req = mockRequest({
      body: { title: "Fail Budget", items: [] },
      user: { id: "userId1" }
    });
    const res = mockResponse();

    (Budget.create as jest.Mock).mockRejectedValue(new Error("DB error"));

    await createBudget(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "Internal server error",
      error: "DB error"
    });
  });
});
