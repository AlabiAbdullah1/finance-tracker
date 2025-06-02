import { Router } from "express";
import { protect } from "../middleware/authMiddleware";
import { validateRequest } from "../middleware/validateRequest";
import { transactionSchema } from "../validators/transactionValidators";
import {
    createTransaction,
    deleteTransaction,
    downloadTransactions,
    getTransactions,
    getTransactionStats,
} from "../controllers/transactionController";

const router = Router();

router.use(protect);

router.get("/", getTransactions);
router.post("/", validateRequest(transactionSchema), createTransaction);
router.delete("/:id", deleteTransaction);
router.get("/stats", getTransactionStats);
router.get("/download", downloadTransactions);

export default router;
