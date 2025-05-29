import { Router } from "express";
import {  createBudget, deleteBudget, getBudget, updateBudget } from "../controllers/budgetController";
import { protect } from "../middleware/authMiddleware";
import { getCategoryMiddleware } from "../middleware/categoryMiddleware";

const budgetRoute= Router()

budgetRoute.use(protect)
budgetRoute.post("/create", getCategoryMiddleware,  createBudget)
budgetRoute.get("/", getBudget)
budgetRoute.put("/:id", getCategoryMiddleware, updateBudget) 
budgetRoute.delete("/:id", deleteBudget)

export default budgetRoute