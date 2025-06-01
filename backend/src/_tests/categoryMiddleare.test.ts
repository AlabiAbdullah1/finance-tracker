import { getCategoryMiddleware } from "../middleware/categoryMiddleware";
import Category from "../models/Category";

jest.mock("../models/Category");

describe("getCategoryMiddleware", () => {
  let req: any;
  let res: any;
  let next: jest.Mock;

  beforeEach(() => {
    req = {
      body: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  it("should return 400 if category or type is missing", async () => {
    req.body = { category: "Food" }; // type missing

    await getCategoryMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: "Category name and type are required",
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("should return 404 if category not found", async () => {
    req.body = { category: "Food", type: "Expense" };
    (Category.findOne as jest.Mock).mockResolvedValue(null);

    await getCategoryMiddleware(req, res, next);

    expect(Category.findOne).toHaveBeenCalledWith({
      name: { $regex: /^Food$/i },
      type: { $regex: /^Expense$/i },
    });
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      error: "Category 'Food' of type 'Expense' not found. Please Create it first",
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("should add categoryId to req.body and call next if category found", async () => {
    req.body = { category: "Food", type: "Expense" };
    const foundCategory = { _id: "category123" };
    (Category.findOne as jest.Mock).mockResolvedValue(foundCategory);

    await getCategoryMiddleware(req, res, next);

    expect(req.body.categoryId).toBe("category123");
    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });

  it("should handle exceptions and return 500", async () => {
    req.body = { category: "Food", type: "Expense" };
    (Category.findOne as jest.Mock).mockRejectedValue(new Error("DB error"));

    await getCategoryMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: "Internal Server Error",
    });
    expect(next).not.toHaveBeenCalled();
  });
});
