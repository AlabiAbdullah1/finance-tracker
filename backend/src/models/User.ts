import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
    _id: mongoose.Types.ObjectId;
    name: string;
    email: string;
    password: string;
    verificationToken?: string;
    isVerified?: boolean;
}

const UserSchema = new Schema<IUser>(
    {
        name: { type: String, required: true },
        email: { type: String, unique: true, required: true },
        password: { type: String, required: true },
        verificationToken: {type:String, required:false},
        isVerified:{type:Boolean, default:false}

    },
    { timestamps: true }
);

const User = mongoose.model<IUser>("User", UserSchema);
export default User;
