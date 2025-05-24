import express from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import {
  addProblemToPlaylist,
  createPlaylist,
  deletePlaylist,
  getAllListDetails,
  getplayListDetails,
  removeProblemFromPlayList,
} from "../controllers/playlist.controller.js";

const playlistRoutes = express.Router();

playlistRoutes.get("/", authMiddleware, getAllListDetails);

playlistRoutes.get("/:playlistId", authMiddleware, getplayListDetails);

playlistRoutes.post("/create-playlist", authMiddleware, createPlaylist);

playlistRoutes.post(
  "/:playlistId/add-problem",
  authMiddleware,
  addProblemToPlaylist
);

playlistRoutes.delete("/:playlistId", authMiddleware, deletePlaylist);

playlistRoutes.delete(
  "/:playlistId/remove-problem",
  authMiddleware,
  removeProblemFromPlayList
);

export default playlistRoutes;
