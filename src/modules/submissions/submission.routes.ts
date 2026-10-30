
import { Router } from "express";
import { authMiddleware } from "../../common/middleware/auth.middleware.js";
import { createSubmissionController } from "./submission.controller.js";

const submissionRouter = Router();


submissionRouter.post("/", authMiddleware, createSubmissionController );

export default submissionRouter;