import { Post, User, Comment } from "../models/associations.js";
import { handleError } from "../utils/handle-error.js";

export async function createPost(req, res) {
  try {
    const { title, content, userId } = req.body;
    if (!title || !content || !userId) {
      return res.status(400).json({ message: "title, content, and userId are required." });
    }

    // Required: instantiate with new and then save().
    const post = new Post({ title, content, userId });
    await post.save();
    return res.status(201).json({ message: "Post created successfully.", post });
  } catch (error) {
    return handleError(res, error);
  }
}

export async function deletePost(req, res) {
  try {
    const post = await Post.findByPk(req.params.postId);
    if (!post) return res.status(404).json({ message: "Post not found." });

    const userId = Number(req.body.userId);
    if (!userId) {
      return res.status(400).json({ message: "Provide userId in the JSON body." });
    }
    if (post.userId !== userId) {
      return res.status(403).json({ message: "Only the post owner can delete this post." });
    }

    await post.destroy(); // paranoid:true means soft-delete
    return res.json({ message: "Post soft-deleted successfully." });
  } catch (error) {
    return handleError(res, error);
  }
}

export async function getPostDetails(req, res) {
  try {
    const posts = await Post.findAll({
      attributes: ["id", "title"],
      include: [
        { model: User, as: "user", attributes: ["id", "name"] },
        { model: Comment, as: "comments", attributes: ["id", "content"] }
      ],
      order: [["createdAt", "DESC"]]
    });
    return res.json(posts);
  } catch (error) {
    return handleError(res, error);
  }
}

export async function getPostCommentCounts(req, res) {
  try {
    const posts = await Post.findAll({
      attributes: [
        "id",
        "title",
        [Post.sequelize.fn("COUNT", Post.sequelize.col("comments.id")), "commentCount"]
      ],
      include: [{ model: Comment, as: "comments", attributes: [], required: false }],
      group: ["Post.id", "Post.title"],
      order: [["id", "ASC"]]
    });
    return res.json(posts);
  } catch (error) {
    return handleError(res, error);
  }
}
