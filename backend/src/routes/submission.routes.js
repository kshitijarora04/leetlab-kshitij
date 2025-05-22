import express from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import {
  getAllSubmissions,
  getAllTheSubmissionForProblem,
  getSubMissionsForProblem,
} from "../controllers/submission.controller.js";

const submissionRoutes = express.Router();

submissionRoutes.get("/get-all-submissions", authMiddleware, getAllSubmissions);

submissionRoutes.get(
  "/get-submission/:problemId",
  authMiddleware,
  getSubMissionsForProblem
);

submissionRoutes.get(
  "/get-submission-count/:problemId",
  authMiddleware,
  getAllTheSubmissionForProblem
);

export default submissionRoutes;
