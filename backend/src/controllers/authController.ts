import { Request, Response } from "express";
import User, { IUser } from "../models/User";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/generateToken";
import { sendVerificationEmail } from "../utils/mail";
import { v4 as uuidv4 } from "uuid";

export const registerUser = async (req: Request, res: Response) => {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });
    const userNameExists = await User.findOne({ name });
    if (userExists) {
        return res.status(400).json({ error: "email already exists" });
    }

    if(userNameExists){
        return res.status(400).json({ error: "Username already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = uuidv4();

    const user = await User.create({
        name,
        email,
        password: hashedPassword,
        verificationToken,
        isVerified: false,
    }) as IUser;

    await sendVerificationEmail(email, verificationToken);

    res.status(201).json({
        message: "User created successfully. Please check your email to verify your account.",
        user
    });
};

export const verifyEmail = async (req: Request, res: Response) => {
    const { token } = req.params;

    const user = await User.findOne({ verificationToken: token });

    console.log(user?.verificationToken)
    console.log(token)


    if (!user) {
        return res.status(400).json({ error: "Invalid or expired verification link" });
    }

    user.isVerified = true;
    user.verificationToken = ""; 
    await user.save();

    res.status(200).json({ message: "Email verified successfully. You can now log in." });
};


export const loginUser = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email }) as IUser | null;
    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: "Invalid credentials" });

    if (!user.isVerified) {
        return res.status(403).json({
            error: "Please verify your email before logging in.",
        });
    }

    res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id.toString()),
    });
};


export const getMe = async (req: Request, res: Response) => {
    const user = req.user;
    if (!user) return res.status(401).json({ error: "Not authorized" });
    res.json(user);
};
