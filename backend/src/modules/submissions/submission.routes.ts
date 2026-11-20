
import { Router } from "express";
import { authMiddleware } from "../../common/middleware/auth.middleware.js";
import { createSubmissionController, getSubmissionController , getMySubmissionsController, runCodeController} from "./submission.controller.js";

const submissionRouter = Router();


submissionRouter.post("/", authMiddleware, createSubmissionController );
submissionRouter.post("/run", authMiddleware, runCodeController);
submissionRouter.get("/me", authMiddleware, getMySubmissionsController)
submissionRouter.get("/:submissionId", authMiddleware, getSubmissionController);


export default submissionRouter;
