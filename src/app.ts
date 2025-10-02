import compression from "compression";
import cors from "cors";
import express from "express";
import { userRouter } from "./nodules/user/user.routes";
import cookieParser from "cookie-parser";
import { blogRouter } from "./nodules/blogs/blogs.router";
 
const app = express();
app.use(cookieParser());

 
// Middleware
app.use(cors({
  origin: ["https://jhondon.vercel.app","http://localhost:3000"],
  credentials: true,
}));

app.use(compression());
app.use(express.json());

// Default route for testing
app.get("/", (_req, res) => {
  res.send("API is running");
});

app.use("/api/user", userRouter);
app.use("/api/blog", blogRouter);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route Not Found",
  });
});

export default app;
