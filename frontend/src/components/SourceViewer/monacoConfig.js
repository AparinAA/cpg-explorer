export const editorOptions = {
  readOnly: true,
  minimap: { enabled: true },
  scrollBeyondLastLine: false,
  fontSize: 13,
  lineNumbers: 'on',
  renderLineHighlight: 'all',
  folding: true,
  wordWrap: 'off',
};

export const defineCustomTheme = monaco => {
  monaco.editor.defineTheme('cpg-dark', {
    base: 'vs-dark',
    inherit: true,
    rules: [],
    colors: {
      'editor.background': '#0d1117',
      'editor.lineHighlightBackground': '#161b22',
      'editorLineNumber.foreground': '#484f58',
      'editorLineNumber.activeForeground': '#c9d1d9',
    },
  });
};

export const highlightStyles = `
  .highlighted-line {
    background-color: rgba(88, 166, 255, 0.15) !important;
    border-left: 3px solid #58a6ff !important;
  }
  .highlighted-glyph {
    background-color: #58a6ff;
  }
`;
