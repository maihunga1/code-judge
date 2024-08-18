import React, { useState, useCallback } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./components/Login";
import ProblemComponent from "./components/Problems";
import CodeEditor, { CodeEditorProps } from "./components/CodeEditor";
import { AuthProvider } from "./context/AuthContext";
import Register from "./components/Register";
import Result from "./components/Result";
import ProblemList from "./components/ProblemList";

const App: React.FC = () => {
  const [language, setLanguage] =
    useState<CodeEditorProps["language"]>("javascript");
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  const handleLanguageChange: CodeEditorProps["onLanguageChange"] = (
    language
  ) => {
    setLanguage(language);
  };

  const handleSubmit = useCallback(() => {
    setIsSubmitted((prevState: boolean) => !prevState);
  }, []);

  const handleReturn = useCallback(() => {
    setIsSubmitted((prevState: boolean) => !prevState);
  }, []);
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/problems" element={<ProblemList />} />
          <Route
            path="/editor/:titleSlug"
            element={
              <div className="container">
                <div className="sidebar">
                  {isSubmitted ? (
                    <Result onReturn={handleReturn} />
                  ) : (
                    <ProblemComponent />
                  )}
                </div>
                <CodeEditor
                  language={language}
                  onLanguageChange={handleLanguageChange}
                  onSubmit={handleSubmit}
                />
              </div>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
