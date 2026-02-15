import Editor from '@monaco-editor/react';
import { useEffect, useRef } from 'react';
import { editorOptions, defineCustomTheme, highlightStyles } from './monacoConfig';
import { EmptySource } from './EmptySource';

export default function SourceViewer({ source, highlightLine }) {
  const editorRef = useRef(null);
  const decorationsRef = useRef([]);

  const handleEditorDidMount = editor => {
    editorRef.current = editor;
    editor.updateOptions(editorOptions);
  };

  useEffect(() => {
    if (!editorRef.current || !highlightLine) return;

    const editor = editorRef.current;
    const monaco = window.monaco;

    decorationsRef.current = editor.deltaDecorations(decorationsRef.current, [
      {
        range: new monaco.Range(highlightLine, 1, highlightLine, 1),
        options: {
          isWholeLine: true,
          className: 'highlighted-line',
          glyphMarginClassName: 'highlighted-glyph',
        },
      },
    ]);

    editor.revealLineInCenter(highlightLine);
  }, [highlightLine, source]);

  if (!source) {
    return <EmptySource />;
  }

  return (
    <div className="h-full">
      <Editor
        height="100%"
        language="go"
        theme="vs-dark"
        value={source.content}
        onMount={handleEditorDidMount}
        options={editorOptions}
        beforeMount={defineCustomTheme}
      />
      <style>{highlightStyles}</style>
    </div>
  );
}
