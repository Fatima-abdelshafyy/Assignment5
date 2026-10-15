import { Router } from "express";
import {
  createPost,
  deletePost,
  getPostDetails,
  getPostCommentCounts
} from "../controllers/post.controller.js";

const router = Router();

router.get("/details", getPostDetails);
router.get("/comment-count", getPostCommentCounts);
router.post("/", createPost);
router.delete("/:postId", deletePost);

export default router;
