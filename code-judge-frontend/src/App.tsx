import React, { useState, useCallback, memo } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import EditorWrapper from "./components/EditorWrapper";
import { AuthProvider } from "./context/AuthContext";
import { CodeEditorProps } from "./components/CodeEditor";
import { submitSolution } from "./api/api";
import { Provider, useSelector } from "react-redux";
import { RootState, store } from "./store/store";
import { PrivateRoute } from "./routes/ProblemRoute";
import ProblemList from "./components/ProblemList";

const AppContent = memo(function App(): React.ReactElement {
  const [lang, setLang] = useState<CodeEditorProps["language"]>("javascript");
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const token = useSelector((state: RootState) => state.user.idToken); // Use token from Redux store

  const handleLanguageChange = useCallback(
    (lang: CodeEditorProps["language"]) => {
      setLang(lang);
    },
    []
  );

  const handleSubmit = useCallback(
    async ({
      titleSlug = "1",
      codeFileContent,
      language,
    }: {
      titleSlug: string;
      codeFileContent: string;
      language: string;
    }) => {
      try {
        if (token) {
          await submitSolution(titleSlug, codeFileContent, language, token); // Use token from useSelector
          console.log(titleSlug, codeFileContent, language);
          setIsSubmitted((prevState) => !prevState);
        } else {
          console.error("Token is undefined");
        }
      } catch (error) {
        console.error("Error submitting code:", error);
      }
    },
    [token] // Add token as a dependency to ensure it's always up-to-date
  );

  const handleReturn = useCallback(() => {
    setIsSubmitted((prevState) => !prevState);
  }, []);

  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route
            path="/problems"
            element={
              <PrivateRoute>
                <ProblemList />
              </PrivateRoute>
            }
          />
          <Route
            path="/problems/:titleSlug"
            element={
              <PrivateRoute>
                <EditorWrapper
                  isSubmitted={isSubmitted}
                  handleReturn={handleReturn}
                  handleSubmit={handleSubmit}
                  lang={lang}
                  handleLanguageChange={handleLanguageChange}
                />
              </PrivateRoute>
            }
          />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <ProblemList />
              </PrivateRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
});

const App = () => (
  <Provider store={store}>
    <AppContent />
  </Provider>
);

export default App;
