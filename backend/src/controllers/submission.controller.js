import { db } from "../../libs/db.js";

export const getAllSubmissions = async (req, res) => {
  try {
    const userId = req.user.id;
    const submissions = await db.submission.findMany({
      where: {
        userId,
      },
    });

    res.status(200).json({
      success: true,
      message: "Submissions fetched successfully",
      submissions,
    });
  } catch (error) {
    console.error("Fetch submissions error:", error);
    res.status(500).json({ error: "Failed to Fetch submissions" });
  }
};

export const getSubMissionsForProblem = async (req, res) => {
  try {
    const userId = req.user.id;

    const problemId = req.params.problemId;

    const submissions = await db.submission.findMany({
      where: {
        userId,
        problemId,
      },
    });

    res.status(200).json({
      success: true,
      message: "Submission fetched successfully",
      submissions,
    });
  } catch (error) {
    console.error("Fetch submissions error:", error);
    res.status(500).json({ error: "Failed to Fetch submissions" });
  }
};

export const getAllTheSubmissionForProblem = async (req, res) => {
  try {
    const problemId = req.params.problemId;
    const submissions = await db.submission.count({
      where: {
        problemId,
      },
    });

    res.status(200).json({
      success: true,
      message: "Submission fetched successfully",
      submissions,
    });
  } catch (error) {
    console.error("Fetch submissions error:", error);
    res.status(500).json({ error: "Failed to Fetch submissions" });
  }
};
