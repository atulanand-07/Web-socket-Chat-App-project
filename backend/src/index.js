import express from "express";
import dotenv from "dotenv";
import cookieparser from "cookie-parser";
import cors from "cors";

import { connectDB } from "./lib/db.js";
import authRoutes from "./routes/auth.routes.js";


dotenv.config()

const PORT = process.env.PORT || 8080

const app = express();

app.use(express.json());
app.use(cookieparser());
app.use(
    cors({
        origin:["http://localhost:5173"],
        credentials:true
    })
)


// Routes
app.use("/api/auth", authRoutes);

const startServer = async () => {
    await connectDB();

    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
};

startServer().catch(() => {
    process.exitCode = 1;
});