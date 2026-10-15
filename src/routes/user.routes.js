import { Router } from "express";
import {
  signup,
  upsertUserById,
  getUserByEmail,
  getUserByIdWithoutRole
} from "../controllers/user.controller.js";

const router = Router();

router.post("/signup", signup);
router.put("/:id", upsertUserById);
router.get("/by-email", getUserByEmail);

// Assignment PDF specifically specifies GET /user/:id (singular).
export const singleUserRouter = Router();
singleUserRouter.get("/:id", getUserByIdWithoutRole);

export default router;
