import express from "express";
import { sequelize } from "./config/database.js";
import "./models/associations.js";
import userRouter, { singleUserRouter } from "./routes/user.routes.js";
import postRouter from "./routes/post.routes.js";
import commentRouter from "./routes/comment.routes.js";

const app = express();
const PORT = 3000;

app.use(express.json());

app.get("/", (_req, res) => {
  res.json({ message: "Assignment 5 Sequelize API is running." });
});

app.use("/users", userRouter);
app.use("/user", singleUserRouter);
app.use("/posts", postRouter);
app.use("/comments", commentRouter);

app.use((req, res) => {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
});

async function startServer() {
  try {
    await sequelize.authenticate();
    console.log("MySQL connection established.");
    await sequelize.sync();
    console.log("Database tables are ready.");
    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Unable to start the application:", error);
    process.exit(1); 
  }
}

startServer();
