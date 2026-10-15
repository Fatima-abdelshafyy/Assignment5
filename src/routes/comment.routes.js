import { Router } from "express";
import {
  bulkCreateComments,
  updateComment,
  findOrCreateComment,
  searchComments,
  getNewestComments,
  getCommentDetails
} from "../controllers/comment.controller.js";

const router = Router();

router.post("/find-or-create", findOrCreateComment);
router.get("/search", searchComments);
router.get("/newest/:postId", getNewestComments);
router.get("/details/:id", getCommentDetails);
router.post("/", bulkCreateComments);
router.patch("/:commentId", updateComment);

export default router;
