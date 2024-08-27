import React, { useRef, useEffect } from "react";
import Editor, { Monaco } from "@monaco-editor/react";
import { editor } from "monaco-editor";
import "../styles/CodeEditor.css";
import { getSample } from "../api/api";

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
      if (titleSlug) {
        getSample(titleSlug)
          .then((sample) => setSample(sample))
          .catch((error) => console.error(error));
      }
    }, [titleSlug]);

    return (
      <div className="editor-container">
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
            height="calc(100vh - 160px)"
            language={language}
            defaultValue={sample}
            beforeMount={handleEditorWillMount}
            onMount={handleEditorDidMount}
          />
        </div>
        <div className="submit-button-container">
          <button className="submit-button" onClick={handleSubmit}>
            Submit
          </button>
        </div>
        <div className="fetched-data">{/* Display fetched data here */}</div>
      </div>
    );
  }
);

export default CodeEditor;
