import React, { FC, useCallback, useEffect, useRef, useState } from 'react';
import { Editor } from '@toast-ui/react-editor';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { useFormikContext } from 'formik';
import base64Helper from '../../../../../helper/base64Helper';
import ErrorTextTypography from '../../../../text/ErrorTextTypography';
import FileDropzoneArea from '../../../FileDropzoneArea';
import '@toast-ui/editor/dist/toastui-editor.css';
import BottomToolbox from '../toolbox/BottomToolbox';
import artifactsRepository from '../../../../../firebase/database/artifactsRepository';
import { ARTIFACT_TYPE_TEMPLATE } from '../../../../../model/artifacts/ArtifactType';
import { CONTENT_TYPE_MARKDOWN } from '../../../../../model/ContentType';

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
  formik: React.MutableRefObject<any>;
  showError: boolean;
}

const MarkdownEditor: FC<Props> = ({
  formik,
  initialFile,
  showError,
  meta,
}) => {
  const [content, setContent] = useState<string | null>(null);
  const classes = useStyles();
  const editorRef = useRef<any>();
  const formikProps = useFormikContext();

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

  const handleUpdateFile = (file: string) => {
    if (file !== 'markdown' && file !== 'wysiwyg') {
      editorRef.current?.editorInst.setMarkdown(file);
      formikProps.setFieldValue('markdownContent', file);
      setContent(file);
      return;
    }
    const markdown = editorRef.current?.editorInst.getMarkdown();
    if (content !== markdown) {
      formikProps.setFieldValue('markdownContent', markdown);
    }
  };

  const debounce = (func: (file: string) => void, ms: number) => {
    let timeout: number;
    return (file: string) => {
      clearTimeout(timeout);
      // @ts-ignore
      timeout = setTimeout(() => func(file), ms);
    };
  };

  return (
    <div className={classes.relativeContainer}>
      {getErrorMessage() !== '' && (
        <ErrorTextTypography>{getErrorMessage()}</ErrorTextTypography>
      )}
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
            initialValue={content}
            previewStyle="vertical"
            height="600px"
            initialEditType="markdown"
            useCommandShortcut
            usageStatistics={false}
            onChange={debounce(handleUpdateFile, 500)}
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

export default React.memo(MarkdownEditor);
