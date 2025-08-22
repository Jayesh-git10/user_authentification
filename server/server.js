import express from "express";
import cors from "cors";
import 'dotenv/config';
import cookieParser from "cookie-parser";
import connectDB from "./conifg/mongodb.js";
import authRouter from './routes/authRoutes.js' 
import userRouter from "./routes/userRouter.js";

const app = express();
const port = process.env.PORT || 3000;
connectDB()
const allowedOrigins = [process.env.FRONTEND_URL]
app.use(express.json());
app.use(cookieParser());
app.use(cors({origin: allowedOrigins ,credentials:true}));

app.get('/',(req,res)=>res.send("API Connected"));
app.use('/api/auth',authRouter);
app.use('/api/user',userRouter);
console.log(`Server started on PORT : ${port}`);

export default app