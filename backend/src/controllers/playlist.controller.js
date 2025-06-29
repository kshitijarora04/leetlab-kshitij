import { db } from "../../libs/db.js";
import { deleteProblem } from "./problem.controller.js";

export const createPlaylist = async (req, res) => {
  try {
    const { name, description } = req.body;
    const userId = req.user.id;
    const playlist = await db.playlist.create({
      data: {
        name,
        description,
        userId,
      },
    });
    res.status(200).json({
      success: true,
      message: "Playlist created successfully",
      playlist,
    });
  } catch (error) {
    console.error("Error while creating playlist", error);
    return res.status(404).json({ error: "Error while creating playlist" });
  }
};

export const getAllListDetails = async (req, res) => {
  try {
    const playlists = await db.playlist.findMany({
      where: {
        userId: req.user.id,
      },
      include: {
        problems: {
          include: {
            problem: true,
          },
        },
      },
    });

    res.status(200).json({
      success: true,
      message: "Playlists Fetched Successfully",
      playlists,
    });
  } catch (error) {
    console.error("Error while fetching playlists", error);
    return res.status(404).json({ error: "Error while fetching playlists" });
  }
};

export const getplayListDetails = async (req, res) => {
  try {
    const { playlistId } = req.params;
    const playlist = await db.playlist.findUnique({
      where: {
        id: playlistId,
        userId: req.user.id,
      },
      include: {
        problems: {
          include: {
            problem: true,
          },
        },
      },
    });

    if (!playlist) {
      return res.status(404).json({ error: "Playlist not found" });
    }

    res.status(200).json({
      success: true,
      message: "Playlists Fetched Successfully",
      playlist,
    });
  } catch (error) {
    console.error("Error while fetching playlists", error);
    return res.status(404).json({ error: "Error while fetching playlists" });
  }
};

export const addProblemToPlaylist = async (req, res) => {
  try {
    const { playlistId } = req.params;
    const { problemIds } = req.body;

    if (!Array.isArray(problemIds) || problemIds.length === 0) {
      return res.status(400).json({ error: "Invalid or missing problems" });
    }

    // create records for each problem
    const problemsInPlaylist = await db.problemInPlaylist.createMany({
      data: problemIds.map((problemId) => ({
        playlistId,
        problemId,
      })),
    });

    res.status(201).json({
      success: true,
      message: "Problems added to playlist ",
      problemsInPlaylist,
    });
  } catch (error) {
    console.error("Error while adding problems to playlists", error);
    return res
      .status(404)
      .json({ error: "Error while adding problems to playlists" });
  }
};

export const deletePlaylist = async (req, res) => {
  try {
    const { playlistId } = req.params;
    const deletedPlaylist = await db.playlist.delete({
      where: {
        id: playlistId,
      },
    });

    res.status(200).json({
      success: true,
      message: "Playlist deleted successfully",
      deletedPlaylist,
    });
  } catch (error) {
    console.error("Error while deleting playlists", error);
    return res.status(404).json({ error: "Error while deleting playlists" });
  }
};

export const removeProblemFromPlayList = async (req, res) => {
  try {
    const { playlistId } = req.params;
    const { problemIds } = req.body;

    if (!Array.isArray(problemIds) || problemIds.length == 0) {
      return res.status(400).json({ error: "Inavlid or missing problem Ids" });
    }

    const deletedProblem = await db.problemsInPlaylist.deleteMany({
      where: {
        playlistId,
        problemId: {
          in: problemIds,
        },
      },
    });

    return res.status(200).json({
      success: true,
      message: "Problems deleted from Playlist successfully",
      deletedProblem,
    });
  } catch (error) {}
};
