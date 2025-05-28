import mongoose, {Document, Schema} from "mongoose";

export interface IBudget extends Document{
    _id: mongoose.Types.ObjectId;
    user: mongoose.Types.ObjectId
    category: mongoose.Types.ObjectId
    title:string
    // amount:number
    // period: "monthly"|"weekly"
    // startDate: Date
    // endDate:Date
    alertSent:boolean
    totalAmount:number
    budgetItem:mongoose.Types.ObjectId
}

const BudgetSchema= new Schema<IBudget>(
    {
        user:{type:Schema.Types.ObjectId, ref:"User", required:true},
        category:{type:Schema.Types.ObjectId, ref:"Category", required:false},
        title:{type:String, required:true},
        budgetItem:{type:Schema.Types.ObjectId, ref:"BudgetItems"},
        alertSent: {type:Boolean},
        totalAmount: {type:Number, default:0}
    },
    {timestamps:true}
)

const Budget= mongoose.model<IBudget>("Budget", BudgetSchema)
export default Budget