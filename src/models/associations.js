import { User } from "./user.model.js";
import { Post } from "./post.model.js";
import { Comment } from "./comment.model.js";

User.hasMany(Post, { foreignKey: "userId", as: "posts" });
Post.belongsTo(User, { foreignKey: "userId", as: "user" });

User.hasMany(Comment, { foreignKey: "userId", as: "comments" });
Comment.belongsTo(User, { foreignKey: "userId", as: "user" });

Post.hasMany(Comment, { foreignKey: "postId", as: "comments" });
Comment.belongsTo(Post, { foreignKey: "postId", as: "post" });

export { User, Post, Comment };
