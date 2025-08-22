import express from "express";
import cors from "cors";
import 'dotenv/config';
import cookieParser from "cookie-parser";
import connectDB from "./config/mongodb.js"; // check spelling: should be "config"
import authRouter from './routes/authRoutes.js'; 
import userRouter from "./routes/userRouter.js";

const app = express();
const port = process.env.PORT || 3000;

// connect DB
connectDB();

// Allowed frontend origin
const allowedOrigins = [process.env.FRONTEND_URL];

// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: allowedOrigins, credentials: true }));

// Routes
app.get("/", (req, res) => res.send("API Connected"));
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);

// ✅ Start server (important for Render)
app.listen(port, () => {
  console.log(`✅ Server running on port: ${port}`);
});
