import {
  getJudge0LanguageName,
  pollBatchResults,
  submitBatch,
} from "../../libs/judge0.lib.js";
import { db } from "../../libs/db.js";

export const executeCode = async (req, res) => {
  try {
    const { source_code, language_id, stdin, expected_outputs, problemId } =
      req.body;
    const userId = req.user.id;

    // valdiate test cases
    if (
      !Array.isArray(stdin) ||
      stdin.length === 0 ||
      !Array.isArray(expected_outputs) ||
      expected_outputs.length !== stdin.length
    ) {
      return res.status(400).json({ error: "Invalid or missing test cases" });
    }

    // Step 2--> Prepare each test cases for judge 0 batch submission
    const submissions = stdin.map((input) => ({
      source_code,
      language_id,
      stdin: input,
    }));

    // Submit the submission
    // this returns tokens
    const submitResponse = await submitBatch(submissions);

    const tokens = submitResponse.map((res) => res.token);
    console.log(tokens);

    // Poll Judge0 for the results of all submitted testcases
    const results = await pollBatchResults(tokens);

    console.log("Result------------------------------------>");
    console.log(results, "\n");

    // Analyze test case result
    let allPassed = true;
    const detailedResults = results.map((result, index) => {
      const stdout = result.stdout?.trim();
      const expected_output = expected_outputs[index]?.trim();
      const passed = stdout === expected_output;

      if (!passed) {
        allPassed = false;
      }

      return {
        testCase: index + 1,
        passed,
        stdout,
        expected: expected_output,
        stderr: result.stderr || null,
        compile_output: result.compile_output || null,
        status: result.status.description,
        memory: result.memory ? `${result.memory}KB` : undefined,
        time: result.time ? `${result.time}s` : undefined,
      };

      // console.log(`Testcase #${index + 1}`);
      // console.log(`Input for Testcase #${index + 1} #${stdin[index]}`);
      // console.log(
      //   `Expected Output for Testcase #${index + 1} ${expected_output}`
      // );
      // console.log(`Actual Output Testcase #${index + 1} #${stdout}`);
      // console.log(`Matched Testcase #${index + 1} :${passed}`);
      // console.log("\n");
    });

    console.log(detailedResults);

    // store the submission summary
    const submission = await db.submission.create({
      data: {
        userId,
        problemId,
        sourceCode: source_code,
        language: getJudge0LanguageName(language_id),
        stdin: stdin.join("/n"),
        stdout: JSON.stringify(detailedResults.map((r) => r.stdout)),
        stderr: detailedResults.some((r) => r.stderr)
          ? JSON.stringify(detailedResults.map((r) => r.stderr))
          : null,
        compileOutput: detailedResults.some((r) => r.compile_output)
          ? JSON.stringify(detailedResults.map((r) => r.compile_output))
          : null,
        status: allPassed ? "Accepted" : "Wrong Answer",
        memory: detailedResults.some((r) => r.memory)
          ? JSON.stringify(detailedResults.map((r) => r.memory))
          : null,
        time: detailedResults.some((r) => r.time)
          ? JSON.stringify(detailedResults.map((r) => r.time))
          : null,
      },
    });

    // If all passed=true then mark problem as solved for the current user
    if (allPassed) {
      await db.problemSolved.upsert({
        where: {
          userId_problemId: {
            userId,
            problemId,
          },
        },
        update: {},
        create: {
          userId,
          problemId,
        },
      });
    }

    // Save Individual test case results using detailedResult

    const testCaseResults = detailedResults.map((result) => ({
      submissionId: submission.id,
      testCase: result.testCase,
      passed: result.passed,
      stdout: result.stdout,
      expected: result.expected,
      stderr: result.stderr,
      compileOutput: result.compile_output,
      status: result.status,
      memory: result.memory,
      time: result.time,
    }));

    await db.testCaseResult.createMany({
      data: testCaseResults,
    });

    const submissionWithTestCase = await db.submission.findUnique({
      where: {
        id: submission.id,
      },
      include: {
        testcases: true,
      },
    });

    return res.status(200).json({
      success: "true",
      message: "Code Executed Successfully",
      submission: submissionWithTestCase,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error: "Problem not submitted" });
  }
};
