import { Request, Response } from "express";
import Budget from "../models/Budget";
import BudgetItem from "../models/BudgetItems";

export const getBudget = async (req: Request, res: Response) => {
  try {
    const userId = req.user._id;

    const budgets = await Budget.find({ user: userId });
    
    if (!budgets || budgets.length === 0) {
      return res.status(404).json({
        message: "This user hasn't created any budget.",
      });
    }

    const budgetIds = budgets.map(b => b._id);

  

    const budgetItems = await BudgetItem.find({ budgetID: { $in: budgetIds } });
    

    return res.status(200).json({
      budgets,
      budgetItems,
    });

  } catch (error: any) {
    console.error(error.message);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const updateBudget = async (req: Request, res: Response) => {
  try {
    const budget = await Budget.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },  
      req.body,
      { new: true, runValidators: true }
    );

    if (!budget) {
      return res.status(404).json({ message: "Budget not found or you're not authorized." });
    }

    return res.status(200).json({
      message: "Budget updated successfully.",
      budget,
    });
  } catch (error: any) {
    console.error(error.message);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};


 export const deleteBudget = async (req: Request, res: Response) => {
  try {
    const budget = await Budget.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id, 
    });

    if (!budget) {
      return res.status(404).json({
        error: "Budget not found or you're not authorized to delete this.",
      });
    }

    // Optionally delete related budget items too
    await BudgetItem.deleteMany({ budgetID: budget.value?._id });

    return res.status(200).json({
      message: "Budget and related items deleted successfully!",
    });
  } catch (error: any) {
    console.error(error.message);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};


 export const createBudget= async(req:Request, res:Response)=>{
    try {

        const {title, items}: { title: string, items: { amount: number, name:string }[] } = req.body;

        const totalAmount = items.reduce((sum: number, item: { amount: number }) => sum + item.amount, 0);

        const budget= await Budget.create({
            title,
            totalAmount, 
            user:req.user.id
        })

        for(const item of items){
            await BudgetItem.create({
                user:req.user.id,
                category:req.body.categoryId,
                name:item.name,
                amount:item.amount,
                budgetID: budget.id,
            })
        }


        res.status(201).json({
            "message":"Budget created Successfully",
            budget
        })
    } catch (error:any) {
        res.status(500).json({
            "message":"Internal server error",
            "error":error.message
        })
    }
 }