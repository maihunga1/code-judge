import React, { useState, useEffect } from "react";
import { getAllProblems } from "../api/api";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/ProblemList.css";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";

interface IProblem {
  titleSlug: string;
}

function ProblemList() {
  const [problemList, setProblemList] = useState<IProblem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const token = useSelector((state: RootState) => state.user.idToken);

  useEffect(() => {
    if (!token) return;

    getAllProblems(token)
      .then((problems) => {
        console.log("API Problems:", problems);
        setProblemList(problems);
      })
      .catch((error) => {
        console.error("API Error:", error);
        setError("Failed to load problems.");
      })
      .finally(() => setLoading(false));
  }, [token]);

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
        <h1>Leetcode</h1>
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
