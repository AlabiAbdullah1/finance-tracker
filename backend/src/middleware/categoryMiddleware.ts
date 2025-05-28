import { NextFunction, Request, Response } from "express";
import Category from "../models/Category";

export const getCategoryMiddleware= async (req:Request, res:Response, next:NextFunction)=>{
   try {
    const {category, type}= req.body

    if(!category || !type){
        return res.status(400).json({
            "error":"Category name and type are required"
        })
    }

    const foundCategory= await Category.findOne({
        name: {$regex: new RegExp(`^${category}$`, "i")},
        type: {$regex: new RegExp(`^${type}$`, "i")}
    })

    if(!foundCategory){
        return res.status(404).json({
            "error":`Category '${category}' of type '${type}' not found. Please Create it first`
        })
    }

    req.body.categoryId= foundCategory._id

    next()

   } catch (error) {
    console.error("Error in CategoryMiddleware", error)
    res.status(500).json({
        "error":"Internal Server Error"
    })
   }
}