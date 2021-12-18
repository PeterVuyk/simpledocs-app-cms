import React, { useRef, useMemo } from 'react';
import JoditEditor from 'jodit-react';

const config = {
  // all options check: https://xdsoft.net/jodit/doc/
  height: 600,
  readonly: false,
  iframe: true,
  askBeforePasteHTML: false,
  askBeforePasteFromWord: false,
  extraButtons: ['source'],
};

// @ts-ignore
const JoditEditorWrapper = ({ content, onChange }) => {
  const editor = useRef<JoditEditor | null>(null);

  const debounce = (func: (file: string) => void, ms: number) => {
    let timeout: any;
    return (file: string) => {
      clearTimeout(timeout);
      // @ts-ignore
      timeout = setTimeout(() => func(file), ms);
    };
  };

  return useMemo(
    () => (
      <JoditEditor
        ref={editor}
        value={content}
        config={config}
        onChange={debounce(onChange, 500)}
      />
    ),
    [content, onChange]
  );
};

export default JoditEditorWrapper;
