import { createCategory, getCategories, updateCategory, deleteCategory } from "../controllers/categoryController";
import Category from "../models/Category";

jest.mock("../models/Category");

describe("Category Controller", () => {
  const mockUserId = "user123";

  let req: any;
  let res: any;

  beforeEach(() => {
    req = {
      user: { _id: mockUserId },
      body: {},
      params: {}
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    jest.clearAllMocks();
  });

  describe("createCategory", () => {
    it("should create a category and return 201 with category data", async () => {
      req.body = { name: "Food", type: "expense" };
      const fakeCategory = { _id: "cat123", user: mockUserId, name: "Food", type: "expense" };
      (Category.create as jest.Mock).mockResolvedValue(fakeCategory);

      await createCategory(req, res);

      expect(Category.create).toHaveBeenCalledWith({ user: mockUserId, name: "Food", type: "expense" });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(fakeCategory);
    });

    it("should handle errors and return 400 with error message", async () => {
      (Category.create as jest.Mock).mockRejectedValue(new Error("Validation failed"));

      await createCategory(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: "Validation failed" });
    });
  });

  describe("getCategories", () => {
    it("should return categories for the user", async () => {
      const fakeCategories = [{ name: "Food" }, { name: "Travel" }];
      (Category.find as jest.Mock).mockResolvedValue(fakeCategories);

      await getCategories(req, res);

      expect(Category.find).toHaveBeenCalledWith({ user: mockUserId });
      expect(res.json).toHaveBeenCalledWith(fakeCategories);
    });

    it("should handle errors and return 400 with error message", async () => {
      (Category.find as jest.Mock).mockRejectedValue(new Error("Database error"));

      await getCategories(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: "Database error" });
    });
  });

  describe("updateCategory", () => {
    it("should update category and return updated category", async () => {
      req.params.id = "cat123";
      req.body = { name: "New Name", type: "income" };
      const updatedCategory = { _id: "cat123", name: "New Name", type: "income", user: mockUserId };
      (Category.findOneAndUpdate as jest.Mock).mockResolvedValue(updatedCategory);

      await updateCategory(req, res);

      expect(Category.findOneAndUpdate).toHaveBeenCalledWith(
        { _id: "cat123", user: mockUserId },
        { name: "New Name", type: "income" },
        { new: true }
      );
      expect(res.json).toHaveBeenCalledWith(updatedCategory);
    });

    it("should return 404 if category not found", async () => {
      (Category.findOneAndUpdate as jest.Mock).mockResolvedValue(null);
      req.params.id = "notfound";

      await updateCategory(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: "Category not found" });
    });

    it("should handle errors and return 400", async () => {
      (Category.findOneAndUpdate as jest.Mock).mockRejectedValue(new Error("Update failed"));

      await updateCategory(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: "Update failed" });
    });
  });

  describe("deleteCategory", () => {
    it("should delete category and return success message", async () => {
      req.params.id = "cat123";
      (Category.findOneAndDelete as jest.Mock).mockResolvedValue({ _id: "cat123" });

      await deleteCategory(req, res);

      expect(Category.findOneAndDelete).toHaveBeenCalledWith({ _id: "cat123", user: mockUserId });
      expect(res.json).toHaveBeenCalledWith({ message: "Category deleted" });
    });

    it("should return 404 if category not found", async () => {
      req.params.id = "notfound";
      (Category.findOneAndDelete as jest.Mock).mockResolvedValue(null);

      await deleteCategory(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: "Category not found" });
    });

    it("should handle errors and return 400", async () => {
      (Category.findOneAndDelete as jest.Mock).mockRejectedValue(new Error("Delete failed"));

      await deleteCategory(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: "Delete failed" });
    });
  });
});
