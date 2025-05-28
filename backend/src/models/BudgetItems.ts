import mongoose, {Document, Schema} from "mongoose";

export interface IBudgetItem extends Document{
    _id:mongoose.Types.ObjectId
    user:mongoose.Types.ObjectId
    category: mongoose.Types.ObjectId
    amount: number
    name:string
    budgetID: mongoose.Types.ObjectId
    
}

const BudgetItems= new Schema<IBudgetItem>({
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    category:{type:Schema.Types.ObjectId, ref:"Category", required:false},
    amount:{type:Number, required:true},
    name:{type:String, required:true},
    budgetID:{type:Schema.Types.ObjectId, ref:"Budget", required:true}
})

const BudgetItem= mongoose.model<IBudgetItem>("BudgetItem", BudgetItems)

export default BudgetItem