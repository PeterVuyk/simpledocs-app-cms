import React, { FC, useCallback, useEffect, useRef, useState } from 'react';
import { Editor } from '@toast-ui/react-editor';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import chart from '@toast-ui/editor-plugin-chart';
import tableMergedCell from '@toast-ui/editor-plugin-color-syntax';
import uml from '@toast-ui/editor-plugin-uml';
import { CONTENT_TYPE_MARKDOWN } from '../../../../model/Artifact';
import base64Helper from '../../../../helper/base64Helper';
import ErrorTextTypography from '../../../text/ErrorTextTypography';
import FileDropzoneArea from '../../FileDropzoneArea';
import '@toast-ui/editor/dist/toastui-editor.css';
import SaveIndicator from '../SaveIndicator';

const useStyles = makeStyles(() =>
  createStyles({
    relativeContainer: {
      position: 'relative',
    },
  })
);

interface Props {
  meta: any;
  initialFile: string | null;
  formik: any;
  showError: boolean;
}

const MarkdownEditor: FC<Props> = ({
  formik,
  initialFile,
  showError,
  meta,
}) => {
  const [content, setContent] = useState<string | null>(null);
  const [saveButtonVisible, setSaveButtonVisible] = useState<boolean>(false);
  const classes = useStyles();
  const editorRef = useRef<any>();

  useEffect(() => {
    const markdown = initialFile === null ? '' : initialFile;
    formik.current?.setFieldValue('markdownContent', markdown);
    setContent(markdown);
  }, [formik, initialFile]);

  const getErrorMessage = (): string => {
    if (showError && meta.error) {
      return meta.error;
    }
    return '';
  };

  const getBase64MarkdownContent = (): string | null => {
    if (content === null || content === '') {
      return null;
    }
    return base64Helper.getBase64FromFile(content, CONTENT_TYPE_MARKDOWN);
  };

  const handleUpdateFileFromBase64 = useCallback(
    (file: string | null) => {
      const markdown = file
        ? base64Helper.getBodyFromBase64(file, CONTENT_TYPE_MARKDOWN)
        : '';
      formik.current?.setFieldValue('markdownContent', markdown);
      editorRef.current.editorInst.setMarkdown(markdown);
      setContent(markdown);
    },
    [formik]
  );

  const showSaveButton = () => {
    setSaveButtonVisible(true);
    setTimeout(() => {
      setSaveButtonVisible(false);
    }, 5000);
  };

  const handleUpdateFile = () => {
    const markdown = editorRef.current.editorInst.getMarkdown();
    if (content !== markdown) {
      formik.current?.setFieldValue('markdownContent', markdown);
      setContent(markdown);
    }
    showSaveButton();
  };

  return (
    <div className={classes.relativeContainer}>
      {getErrorMessage() !== '' && (
        <ErrorTextTypography>{getErrorMessage()}</ErrorTextTypography>
      )}
      {saveButtonVisible && <SaveIndicator />}
      {content !== null && (
        <Editor
          ref={editorRef}
          initialValue={content ?? ''}
          previewStyle="vertical"
          height="600px"
          initialEditType="markdown"
          useCommandShortcut
          usageStatistics={false}
          onBlur={handleUpdateFile}
          plugins={[chart, tableMergedCell, uml]}
        />
      )}
      <FileDropzoneArea
        allowedExtension=".md"
        allowedMimeTypes={['text/markdown']}
        initialFile={getBase64MarkdownContent()}
        onUpdateFile={handleUpdateFileFromBase64}
      />
    </div>
  );
};

export default MarkdownEditor;
