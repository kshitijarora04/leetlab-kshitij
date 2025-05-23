// Judge 0 utility methods
import dotenv from "dotenv";
import axios from "axios";
dotenv.config();

export const getJudge0LanguageId = (Language) => {
  const languageMap = {
    PYTHON: 71,
    JAVA: 62,
    JAVASCRIPT: 63,
  };

  return languageMap[Language.toUpperCase()];
};

export const getJudge0LanguageName = (LanguageId) => {
  const languageName = {
    71: "PYTHON",
    62: "JAVA",
    63: "JAVASCRIPT",
  };

  return languageName[LanguageId] || "Unknown";
};

// export const submitBatch = async (submissions) => {
//   const { data } = await axios.post(
//     `${process.env.JUDGE0_API_URL}/submissions/batch?base64_encoded=false`,
//     {
//       submissions,
//     }
//   );
//   console.log("Submission Results:", data);
//   return data; //[{token},{token},{token}]
// };

export const submitBatch = async (submissions) => {
  const { data } = await axios.post(
    `${process.env.JUDGE0_API_URL}/submissions/batch`,
    { submissions },
    {
      params: {
        base64_encoded: false,
        wait: false,
      },
    }
  );
  // console.log("Submission Results:", data);
  return data; // Should return: { submissions: [{ token }, { token }] }
};

const sleep = (ms) => {
  new Promise((resolve) => setTimeout(resolve, ms));
};

export const pollBatchResults = async (tokens) => {
  while (true) {
    const { data } = await axios.get(
      `${process.env.JUDGE0_API_URL}/submissions/batch`,
      {
        params: {
          tokens: tokens.join(","),
          base64_encoded: false,
        },
      }
    );
    // console.log(data);

    const results = data.submissions;
    // results here is an array of objects
    // console.log(results);

    const isAllDone = results.every(
      (r) => r.status.id !== 1 && r.status.id !== 2
    );
    if (isAllDone) {
      return results;
    }
    await sleep(1000);
  }
};
