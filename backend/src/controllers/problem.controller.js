import { db } from "../../libs/db.js";
import {
  getJudge0LanguageId,
  pollBatchResults,
} from "../../libs/judge0.lib.js";

import { submitBatch } from "../../libs/judge0.lib.js";

import dotenv from "dotenv";
dotenv.config();

export const createProblem = async (req, res) => {
  //going to get all the data from the request body

  const {
    title,
    description,
    difficulty,
    tags,
    examples,
    constraints,
    testcases,
    codeSnippet,
    referenceSolutions,
  } = req.body;

  //going to check the user role once again
  if (req.user.role !== "ADMIN") {
    return res
      .status(403)
      .json({ message: "You are not allowed to create a problem" });
  }

  //loop through each refrence solution for different languages
  try {
    for (const [language, solutionCode] of Object.entries(referenceSolutions)) {
      const languageId = getJudge0LanguageId(language);
      // console.log(languageId);
      // console.log(solutionCode);
      // console.log([languageId, solutionCode]);

      if (!languageId) {
        return res
          .status(400)
          .json({ error: `Language ${language} is not supported` });
      }

      const submissions = testcases.map(({ input, output }) => ({
        language_id: languageId,
        source_code: solutionCode,
        stdin: input,
        expected_output: output,
      }));
      // console.log(submissions);
      // console.log(process.env.JUDGE0_API_URL);

      const submissionResults = await submitBatch(submissions);
      // submission results returns an array of object of tokens
      // console.log(submissionResults);

      // tokens is a new array with only the tokens from the original array of objects
      const tokens = submissionResults.map((res) => res.token);
      // console.log(tokens);

      const results = await pollBatchResults(tokens);
      // results is an array of objects

      // console.log(results.length);

      for (let i = 0; i < results.length; i++) {
        const result = results[i];
        // console.log("------------------------->");
        // console.log(result);

        if (result.status.id !== 3) {
          return res.status(400).json({
            error: `Testcase ${i + 1} failed for language ${language}`,
          });
        }
        // console.log(result);
      }

      // save the problem to the database
      const newProblem = await db.problem.create({
        data: {
          title,
          description,
          difficulty,
          tags,
          examples,
          constraints,
          testcases,
          codeSnippet,
          referenceSolutions,
          userId: req.user.id,
        },
      });
      console.log("Problem Created Successfully");
      return res.status(201).json(newProblem);
    }
  } catch (error) {
    console.log(error);
    // console.log("Error creating Problem");
    return res.status(501).json({ error: "Error creating Problem" });
  }
};

export const getAllProblems = async (req, res) => {
  try {
    const problems = await db.problem.findMany();

    if (!problems) {
      return res.status(404).json({
        error: "No problems found",
      });
    }

    res.status(200).json({
      success: "true",
      message: "Message Fetched Successfully",
      problems,
    });
  } catch (error) {
    console.log(error);
    // console.log("Error creating Problem");
    return res.status(501).json({ error: "Error fetching Problems" });
  }
};

export const getProblemById = async (req, res) => {
  
};

export const updateproblem = async (req, res) => {};

export const deleteProblem = async (req, res) => {};

export const getAllProblemsSolvedByUser = async (req, res) => {};
