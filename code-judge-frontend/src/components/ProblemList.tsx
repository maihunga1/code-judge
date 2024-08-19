import { useState, useEffect } from "react";
import { getAllProblems } from "../api/api";
import { IProblem } from "@codingsnack/leetcode-api/lib/models/IProblem";
import { Link } from "react-router-dom";
import "../styles/ProblemList.css"; // Import the CSS file

function ProblemList() {
  const [problemList, setProblemList] = useState<IProblem[]>([]);

  useEffect(() => {
    getAllProblems()
      .then((problems) => setProblemList(problems))
      .catch((error) => console.error(error));
  }, [problemList]);

  return (
    <div className="problem-list">
      {problemList.map((problem) => (
        <div key={problem.questionFrontendId} className="problem-item">
          <span className="problem-id">{problem.questionFrontendId}</span>
          <Link to={`/editor/${problem.titleSlug}`}>{problem.titleSlug}</Link>
          <span
            className={`problem-difficulty ${problem.difficulty.toLowerCase()}`}
          >
            {problem.difficulty}
          </span>
        </div>
      ))}
    </div>
  );
}

export default ProblemList;
