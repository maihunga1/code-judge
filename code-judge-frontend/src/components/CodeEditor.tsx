import React, { useRef, useEffect } from "react";
import Editor, { Monaco } from "@monaco-editor/react";
import { editor } from "monaco-editor";
import "../styles/CodeEditor.css";
import { getSample } from "../api/api";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";

export interface CodeEditorProps {
  titleSlug: string;
  language: string;
  onLanguageChange: (language: string) => void;
  onSubmit: (data: {
    titleSlug: string;
    codeFileContent: string;
    language: string;
  }) => void;
  onCodeChange: (content: string) => void; // New prop
}

const CodeEditor: React.FC<CodeEditorProps> = React.memo(
  ({ language, onLanguageChange, onSubmit, titleSlug, onCodeChange }) => {
    const monacoRef = useRef<editor.IStandaloneCodeEditor | null>(null);
    const [sample, setSample] = React.useState<string>("");

    const token = useSelector((state: RootState) => state.user.idToken);

    function handleEditorWillMount(monaco: Monaco) {
      monaco.languages.typescript.javascriptDefaults.setEagerModelSync(true);
    }

    function handleEditorDidMount(
      editor: editor.IStandaloneCodeEditor,
      monaco: Monaco
    ) {
      monacoRef.current = editor;

      // Handle code changes
      editor.onDidChangeModelContent(() => {
        if (monacoRef.current) {
          const content = monacoRef.current.getValue();
          onCodeChange(content); // Notify parent of code changes
        }
      });
    }

    const handleSubmit = () => {
      if (monacoRef.current) {
        const codeFileContent = monacoRef.current.getValue() || "";
        onSubmit({ titleSlug, codeFileContent, language });
      } else {
        console.error("Editor is not initialized.");
      }
    };

    function handleLanguageChange(event: React.ChangeEvent<HTMLSelectElement>) {
      onLanguageChange(event.target.value);
      if (monacoRef.current) {
        const model = monacoRef.current.getModel();
        if (model) {
          editor.setModelLanguage(model, event.target.value);
        }
      }
    }

    useEffect(() => {
      if (!token) return;

      if (titleSlug) {
        getSample(titleSlug, token)
          .then((sample) => setSample(sample))
          .catch((error) => console.error(error));
      }
    }, [titleSlug, token]);

    return (
      <div className="editor-container h-[80vh]">
        <div className="language-selector">
          <label htmlFor="language-select" style={{ marginRight: "10px" }}>
            Choose a language:
          </label>
          <select
            id="language-select"
            value={language}
            onChange={handleLanguageChange}
          >
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
            <option value="go">Go</option>
          </select>
        </div>
        <div className="editor-wrapper">
          <Editor
            height="calc(80vh - 80px)"
            language={language}
            defaultValue={sample}
            beforeMount={handleEditorWillMount}
            onMount={handleEditorDidMount}
          />
          <div className="w-full flex justify-end">
            <button className="submit-button" onClick={handleSubmit}>
              Submit
            </button>
          </div>
        </div>
      </div>
    );
  }
);

export default CodeEditor;
