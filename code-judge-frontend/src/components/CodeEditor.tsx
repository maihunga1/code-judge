import React, { useRef } from "react";
import Editor, { Monaco } from "@monaco-editor/react";
import { editor } from "monaco-editor";
import "../styles/CodeEditor.css";

export interface CodeEditorProps {
  titleSlug: string;
  language: string;
  onLanguageChange: (language: string) => void;
  onSubmit: (data: {
    titleSlug: string;
    codeFileContent: string;
    language: string;
  }) => void;
}

const CodeEditor: React.FC<CodeEditorProps> = React.memo(
  ({ language, onLanguageChange, onSubmit, titleSlug }) => {
    const monacoRef = useRef<editor.IStandaloneCodeEditor | null>(null);

    function handleEditorWillMount(monaco: Monaco) {
      monaco.languages.typescript.javascriptDefaults.setEagerModelSync(true);
    }

    function handleEditorDidMount(
      editor: editor.IStandaloneCodeEditor,
      monaco: Monaco
    ) {
      monacoRef.current = editor;
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
            <option value="golang">Go</option>
          </select>
        </div>
        <div className="editor-wrapper">
          <Editor
            height="calc(100vh - 160px)"
            language={language}
            defaultValue="// Write your code here"
            beforeMount={handleEditorWillMount}
            onMount={handleEditorDidMount}
          />
        </div>
        <div className="submit-button-container">
          <button className="submit-button" onClick={handleSubmit}>
            Submit
          </button>
        </div>
      </div>
    );
  }
);

export default CodeEditor;
