import React, { useState, useEffect } from "react";
import { submitSolution } from "../api/api";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";

// Adjust the ResultProps if necessary to accept parameters or pass required values
interface ResultProps {
  onReturn: () => void;
  titleSlug: string;
  codeFileContent: string;
  language: string;
  submissionData?: SubmissionResult;
}

export interface SubmissionResult {
  result: string;
  message: string;
}

const Result: React.FC<ResultProps> = ({ onReturn, submissionData }) => {
  return (
    <div>
      <button
        className="w-20 border-2 border-sky-500 rounded flex items-center justify-center"
        onClick={onReturn}
      >
        Return
      </button>
      <h1>Submission Result</h1>

      {/* Handle different states */}
      {!submissionData && <p>Loading results...</p>}
      {!!submissionData && (
        <>
          <p>
            <strong>Result:</strong> {submissionData.result}
          </p>
          <p>
            <strong>Message:</strong> {submissionData.message}
          </p>
        </>
      )}
    </div>
  );
};

export default Result;
