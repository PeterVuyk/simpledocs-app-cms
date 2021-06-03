import React, { useRef, useEffect, useState, useCallback } from 'react';
import JoditEditor from 'jodit-react';
import { useField } from 'formik';
import FileDropzoneArea from '../FileDropzoneArea';
import ErrorTextTypography from '../../text/ErrorTextTypography';

interface Props {
  initialFile: string | null;
  formik: any;
  showError: boolean;
}

const RegulationEditor: React.FC<Props> = ({
  formik,
  initialFile,
  showError,
}) => {
  const editor = useRef(null);
  const [content, setContent] = useState<string | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [field, mata] = useField('htmlFile');

  const getErrorMessage = (): string => {
    if (showError && mata.error) {
      return mata.error;
    }
    return '';
  };

  function getHTMLBodyFromBase64(base64HTML: string): string {
    const base64String = base64HTML.split('data:text/html;base64,')[1];
    return Buffer.from(base64String, 'base64').toString('utf-8');
  }

  const updateFileHandler = (file: string) => {
    formik.current.setFieldValue('htmlFile', file);
    setContent(file);
  };

  const updateFileFromBase64Handler = useCallback(
    (file: string | null) => {
      const html = file ? getHTMLBodyFromBase64(file) : '';
      formik.current.setFieldValue('htmlFile', html);
      setContent(html);
    },
    [formik]
  );

  const getBase64HtmlFile = (): string | null => {
    if (content === null || content === '') {
      return null;
    }
    return `data:text/html;base64,${btoa(
      unescape(encodeURIComponent(content))
    )}`;
  };

  useEffect(() => {
    let html = initialFile;
    if (html === null) {
      html = '';
    }
    formik.current.setFieldValue('htmlFile', html);
    setContent(html);
  }, [formik, initialFile]);

  const config = {
    height: 600,
    readonly: false, // all options from https://xdsoft.net/jodit/doc/
  };

  return (
    <>
      {content !== null && (
        <>
          <JoditEditor
            ref={editor}
            value={content ?? ''}
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            config={config}
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            onBlur={(newContent) => updateFileHandler(newContent)}
          />
          <FileDropzoneArea
            allowedExtension=".html"
            allowedMimeTypes={['text/html']}
            initialFile={getBase64HtmlFile()}
            updateFileHandler={updateFileFromBase64Handler}
          />
          {getErrorMessage() !== '' && (
            <ErrorTextTypography>{getErrorMessage()}</ErrorTextTypography>
          )}
        </>
      )}
    </>
  );
};

export default RegulationEditor;
