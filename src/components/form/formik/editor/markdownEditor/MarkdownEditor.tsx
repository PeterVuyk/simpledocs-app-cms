import React, { FC, useCallback, useEffect, useRef, useState } from 'react';
import { Editor } from '@toast-ui/react-editor';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { CONTENT_TYPE_MARKDOWN } from '../../../../../model/Artifact';
import base64Helper from '../../../../../helper/base64Helper';
import ErrorTextTypography from '../../../../text/ErrorTextTypography';
import FileDropzoneArea from '../../../FileDropzoneArea';
import '@toast-ui/editor/dist/toastui-editor.css';
import SaveIndicator from '../../SaveIndicator';
import BottomToolbox from '../toolbox/BottomToolbox';
import artifactsRepository from '../../../../../firebase/database/artifactsRepository';
import { ARTIFACT_TYPE_TEMPLATE } from '../../../../../model/ArtifactType';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    relativeContainer: {
      position: 'relative',
    },
    formControl: {
      margin: theme.spacing(1),
      position: 'absolute',
      zIndex: 1000,
      right: 10,
      bottom: 30,
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
    async function setInitialHtmlContent() {
      let markdown = initialFile === null ? '' : initialFile;
      if (!markdown) {
        // Use the 'default' template.
        markdown = await artifactsRepository
          .getArtifactByTitle(
            'Standaard',
            ARTIFACT_TYPE_TEMPLATE,
            CONTENT_TYPE_MARKDOWN
          )
          .then((artifact) => (artifact?.content ? artifact.content : ''));
      }
      formik.current?.setFieldValue('markdownContent', markdown);
      setContent(markdown);
    }
    setInitialHtmlContent();
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
      editorRef.current?.editorInst.setMarkdown(markdown);
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

  const handleUpdateFile = (file: string) => {
    if (file !== 'markdown') {
      editorRef.current?.editorInst.setMarkdown(file);
      setContent(file);
      showSaveButton();
      return;
    }
    const markdown = editorRef.current?.editorInst.getMarkdown();
    if (content !== markdown) {
      formik.current?.setFieldValue('markdownContent', markdown);
      setContent(markdown);
      showSaveButton();
    }
  };

  return (
    <div className={classes.relativeContainer}>
      {getErrorMessage() !== '' && (
        <ErrorTextTypography>{getErrorMessage()}</ErrorTextTypography>
      )}
      {saveButtonVisible && <SaveIndicator />}
      {content !== null && (
        <div className={classes.relativeContainer}>
          <div className={classes.formControl}>
            <BottomToolbox
              contentType={CONTENT_TYPE_MARKDOWN}
              onUpdateFile={handleUpdateFile}
            />
          </div>
          <Editor
            previewHighlight={false}
            ref={editorRef}
            initialValue={content ?? ''}
            previewStyle="vertical"
            height="600px"
            initialEditType="markdown"
            useCommandShortcut
            usageStatistics={false}
            onBlur={handleUpdateFile}
          />
        </div>
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
