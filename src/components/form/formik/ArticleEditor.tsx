import React, { useRef, useEffect, useState, useCallback } from 'react';
import JoditEditor from 'jodit-react';
import { useField } from 'formik';
import FileDropzoneArea from '../FileDropzoneArea';
import ErrorTextTypography from '../../text/ErrorTextTypography';
import fileHelper from '../../../helper/fileHelper';

interface Props {
  initialFile: string | null;
  formik: any;
  showError: boolean;
}

const ArticleEditor: React.FC<Props> = ({ formik, initialFile, showError }) => {
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

  const updateFileHandler = (file: string) => {
    formik.current.setFieldValue('htmlFile', file);
    setContent(file);
  };

  const updateFileFromBase64Handler = useCallback(
    (file: string | null) => {
      const html = file ? fileHelper.getHTMLBodyFromBase64(file) : '';
      formik.current.setFieldValue('htmlFile', html);
      setContent(html);
    },
    [formik]
  );

  const getBase64HtmlFile = (): string | null => {
    if (content === null || content === '') {
      return null;
    }
    return fileHelper.getBase64FromHtml(content);
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

export default ArticleEditor;
