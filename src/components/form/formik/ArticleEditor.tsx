import React, { useRef, useEffect, useState, useCallback, FC } from 'react';
import JoditEditor from 'jodit-react';
import { useField } from 'formik';
import SaveIcon from '@material-ui/icons/Save';
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
  const [showSaveButton, setShowSaveButton] = useState<boolean>(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [field, mata] = useField('htmlFile');

  const getErrorMessage = (): string => {
    if (showError && mata.error) {
      return mata.error;
    }
    return '';
  };

  const showSaveButtonHandle = () => {
    setShowSaveButton(true);
    setTimeout(() => {
      setShowSaveButton(false);
    }, 5000);
  };

  const updateFileHandler = (file: string) => {
    showSaveButtonHandle();
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
    // all options check: https://xdsoft.net/jodit/doc/
    height: 600,
    readonly: false,
    useSplitMode: true,
  };

  return (
    <>
      {content !== null && (
        <div style={{ position: 'relative' }}>
          {showSaveButton && (
            <SaveIcon
              style={{
                position: 'absolute',
                zIndex: 1000,
                right: 50,
                top: 50,
                backgroundColor: '#fff',
                color: '#099000FF',
                fontSize: 'xxx-large',
              }}
            />
          )}
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
        </div>
      )}
    </>
  );
};

export default ArticleEditor;
