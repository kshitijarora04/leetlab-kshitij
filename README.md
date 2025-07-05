# Leetlab-A leetcode Like Platform

LeetLab is a coding practice platform inspired by LeetCode, designed to help developers improve their problem-solving skills. It supports solutions in Python, Java, and JavaScript, allowing users to write, test, and submit code directly in the browser. Whether you're preparing for interviews or sharpening your coding skills, LeetLab offers a clean and focused environment for hands-on practice across multiple languages.

# Features

1. Interactive Code Editor
Real-time syntax highlighting using the Monaco Editor.
Supports JavaScript, Python, and Java.

2. Dynamic Input Parsing
Users can submit input dynamically via readline or predefined test cases.

3. Problem Details
Each problem includes:
Description
Examples with inputs, outputs, and explanations
Constraints
Editorial (hints and optimal solutions)

4. Execution and Submission
Run code directly in the browser and get instant feedback.
View execution results, including runtime, memory usage, and error messages.

5. User Authentication
Secure login and registration for tracking user progress and submissions.

6. Admin Panel
Admins can add new problems, manage submissions.

# Tech Stack

Frontend: React.js, Tailwind CSS, Monaco Editor

Backend: Node.js, Express.js

Database: PostgreSQL (or Prisma ORM)

Authentication: JWT (JSON Web Tokens)

Code Execution: Judge0 API (for running and validating code submissions)

State Management: Zustand (React state management library)

Version Control: Git, GitHub

# Installation and Setup

1. Clone the repository

```
git clone https://github.com/kshitijarora04/leetlab-kshitij
cd backend
cd frontend
```

2. Install Dependencies 

```
cd backend
npm install

cd..

cd frontend
npm install

```

3. Set Up Environment Variables Create a .env file in the root directory and add the following variables

You can deploy Judge0 API on localhost or can use an online API, modify the backend code accordingly if not deploying judge0 on local host

```
PORT =
DATABASE_URL=
JWT_SECRET=
JUDGE0_API_URL= http://localhost:2358/

```
4. Run the Development Server

``` 
cd backend
npm run dev

cd .. 

cd frontend
npm run dev

```
