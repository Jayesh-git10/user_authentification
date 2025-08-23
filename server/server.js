import express from "express";
import cors from "cors";
import 'dotenv/config';
import cookieParser from "cookie-parser";
import connectDB from "./config/mongodb.js";
import authRouter from './routes/authRoutes.js'; 
import userRouter from "./routes/userRouter.js";
import userAuth from "./middleware/userAuth.js";

const app = express();
const port = process.env.PORT || 3000;

connectDB();

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);

    const allowedOrigins = [
      "http://localhost:5173",
      "https://user-authentification-frontend.vercel.app"
    ];

    if (
      allowedOrigins.includes(origin) ||
      /\.vercel\.app$/.test(new URL(origin).hostname)
    ) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));

app.get("/", (req, res) => res.send("API Connected"));
app.use("/api/auth", authRouter);
app.use("/api/user", userAuth, userRouter); // ✅ Protected with middleware

app.listen(port, () => {
  console.log(`✅ Server running on port: ${port}`);
});
