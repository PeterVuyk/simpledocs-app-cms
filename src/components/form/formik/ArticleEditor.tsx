import React, { useRef, useEffect, useState, useCallback, FC } from 'react';
import JoditEditor from 'jodit-react';
import { useField } from 'formik';
import FileDropzoneArea from '../FileDropzoneArea';
import ErrorTextTypography from '../../text/ErrorTextTypography';
import htmlFileHelper from '../../../helper/htmlFileHelper';

interface Props {
  initialFile: string | null;
  formik: any;
  showError: boolean;
}

const ArticleEditor: FC<Props> = ({ formik, initialFile, showError }) => {
  const editor = useRef<JoditEditor | null>(null);
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
      const html = file ? htmlFileHelper.getHTMLBodyFromBase64(file) : '';
      formik.current.setFieldValue('htmlFile', html);
      setContent(html);
    },
    [formik]
  );

  const getBase64HtmlFile = (): string | null => {
    if (content === null || content === '') {
      return null;
    }
    return htmlFileHelper.getBase64FromHtml(content);
  };

  useEffect(() => {
    let html = initialFile;
    if (html) {
      html = htmlFileHelper.stripMetaTags(html);
    } else {
      html = htmlFileHelper.getDefaultHtmlTemplate();
    }
    formik.current.setFieldValue('htmlFile', html);
    setContent(html);
  }, [formik, initialFile]);

  const config = {
    height: 600,
    readonly: false, // all options check: https://xdsoft.net/jodit/doc/
    useSplitMode: true,
  };

  return (
    <>
      {content !== null && (
        <>
          <JoditEditor
            ref={editor}
            value={content ?? ''}
            // @ts-ignore
            config={config}
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
