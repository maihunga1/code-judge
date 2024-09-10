import React, { useState, useEffect } from "react";
import { getAllProblems } from "../api/api";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/ProblemList.css";

interface IProblem {
  titleSlug: string;
}

function ProblemList() {
  const [problemList, setProblemList] = useState<IProblem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    getAllProblems()
      .then((problems) => {
        console.log("API Problems:", problems);
        setProblemList(problems);
      })
      .catch((error) => {
        console.error("API Error:", error);
        setError("Failed to load problems.");
      })
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="problem-list-container">
      <div className="header">
        <h1>Hello, {user?.username}</h1>
        <button onClick={handleLogout} className="logout-button">
          Log out
        </button>
      </div>
      <div className="problem-list">
        {problemList && problemList.length > 0 ? (
          problemList.map((problem) => (
            <div key={problem.titleSlug} className="problem-item">
              <Link to={`/problems/${problem.titleSlug}`}>
                {problem.titleSlug}
              </Link>
            </div>
          ))
        ) : (
          <p>No problems found.</p>
        )}
      </div>
    </div>
  );
}

export default ProblemList;
