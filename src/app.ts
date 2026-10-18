
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import { errorMiddleware } from "./common/middleware/error.middleware.js";
import { notFoundMiddleware } from "./common/middleware/notFound.middleware.js";
import apiRouter from "./routes/index.routes.js"

const app = express();

app.use(helmet());

app.use(
    cors({
        origin: process.env.CLIENT_URL,
        credentials: true
    }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Leetcode Clone API is healthy"
    });
});


app.use("/api/v1", apiRouter);


app.use(notFoundMiddleware);
app.use(errorMiddleware);


export default app;