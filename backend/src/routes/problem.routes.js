import express from "express";
import { authMiddleware, checkAdmin } from "../middleware/auth.middleware.js";

import {
  createProblem,
  deleteProblem,
  getAllProblems,
  getAllProblemsSolvedByUser,
  getProblemById,
  updateproblem,
} from "../controllers/problem.controller.js";

// Creating a router from express.Router()
const problemRoutes = express.Router();

// Create Problem Route
problemRoutes.post(
  "/create-problem",
  authMiddleware,
  checkAdmin,
  createProblem
);

// Get all problems route
problemRoutes.get("/get-all-problems", authMiddleware, getAllProblems);

// Get Problem via Id Route
problemRoutes.get("/get-problem/:id", authMiddleware, getProblemById);

// Update Problem via id Route
problemRoutes.put(
  "/update-problem/:id",
  authMiddleware,
  checkAdmin,
  updateproblem
);

// Delete problem Route
problemRoutes.delete(
  "delete-problem/:id",
  authMiddleware,
  checkAdmin,
  deleteProblem
);

// Get solved problems route
problemRoutes.get(
  "/get-solved-problems",
  authMiddleware,
  getAllProblemsSolvedByUser
);

export default problemRoutes;
