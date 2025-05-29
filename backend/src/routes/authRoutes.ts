import { Router } from "express";
import { registerUser, loginUser, getMe, verifyEmail } from "../controllers/authController";
import { validateRequest } from "../middleware/validateRequest";
import { registerSchema, loginSchema } from "../validators/authValidators";
import { protect } from "../middleware/authMiddleware";

const router = Router();

router.post("/register", validateRequest(registerSchema), registerUser);
router.post("/login", validateRequest(loginSchema), loginUser);
router.get("/me", protect, getMe);
router.get("/verify/:token", verifyEmail)

export default router;
