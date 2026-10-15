import { Op } from "sequelize";
import { Comment, User, Post } from "../models/associations.js";
import { handleError } from "../utils/handle-error.js";

export async function bulkCreateComments(req, res) {
  try {
    const comments = Array.isArray(req.body) ? req.body : req.body.comments;
    if (!Array.isArray(comments) || comments.length === 0) {
      return res.status(400).json({
        message: 'Send a non-empty array, either as the body or as {"comments":[...]}'
      });
    }

    const created = await Comment.bulkCreate(comments, {
      validate: true,
      returning: true
    });
    return res.status(201).json({ message: "Comments created successfully.", count: created.length, comments: created });
  } catch (error) {
    return handleError(res, error);
  }
}

export async function updateComment(req, res) {
  try {
    const comment = await Comment.findByPk(req.params.commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found." });

    const userId = Number(req.body.userId);
    if (!userId || !req.body.content) {
      return res.status(400).json({ message: "userId and content are required in the body." });
    }
    if (comment.userId !== userId) {
      return res.status(403).json({ message: "Only the comment owner can update this comment." });
    }

    await comment.update({ content: req.body.content });
    return res.json({ message: "Comment updated successfully.", comment });
  } catch (error) {
    return handleError(res, error);
  }
}

export async function findOrCreateComment(req, res) {
  try {
    const { content, postId, userId } = req.body;
    if (!content || !postId || !userId) {
      return res.status(400).json({ message: "content, postId, and userId are required." });
    }

    const [comment, created] = await Comment.findOrCreate({
      where: { content, postId, userId },
      defaults: { content, postId, userId }
    });
    return res.status(created ? 201 : 200).json({
      message: created ? "Comment did not exist; created it." : "Matching comment found.",
      created,
      comment
    });
  } catch (error) {
    return handleError(res, error);
  }
}

export async function searchComments(req, res) {
  try {
    const { word } = req.query;
    if (!word) return res.status(400).json({ message: "Query parameter word is required." });

    const where = { content: { [Op.like]: `%${word}%` } };
    const comments = await Comment.findAll({ where, order: [["createdAt", "DESC"]] });
    const count = await Comment.count({ where });
    return res.json({ count, comments });
  } catch (error) {
    return handleError(res, error);
  }
}

export async function getNewestComments(req, res) {
  try {
    const comments = await Comment.findAll({
      where: { postId: req.params.postId },
      order: [["createdAt", "DESC"]],
      limit: 3
    });
    return res.json(comments);
  } catch (error) {
    return handleError(res, error);
  }
}

export async function getCommentDetails(req, res) {
  try {
    const comment = await Comment.findByPk(req.params.id, {
      include: [
        { model: User, as: "user", attributes: ["id", "name", "email"] },
        { model: Post, as: "post", attributes: ["id", "title", "content", "userId"] }
      ]
    });
    if (!comment) return res.status(404).json({ message: "Comment not found." });
    return res.json(comment);
  } catch (error) {
    return handleError(res, error);
  }
}
