import React from "react";

interface ResultProps {
  onReturn: () => void;
}

const Result: React.FC<ResultProps> = ({ onReturn }) => {
  return (
    <div>
      <button onClick={onReturn}>Return</button>
      <h1>Result</h1>
      <p>Success</p>
    </div>
  );
};

export default Result;
