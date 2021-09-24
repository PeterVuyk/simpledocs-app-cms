import React, { useRef, useEffect, useState, useCallback, FC } from 'react';
import JoditEditor from 'jodit-react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import BottomToolbox from '../toolbox/BottomToolbox';
import FileDropzoneArea from '../../../FileDropzoneArea';
import ErrorTextTypography from '../../../../text/ErrorTextTypography';
import LoadingSpinner from '../../../../LoadingSpinner';
import artifactsRepository from '../../../../../firebase/database/artifactsRepository';
import { ARTIFACT_TYPE_TEMPLATE } from '../../../../../model/ArtifactType';
import base64Helper from '../../../../../helper/base64Helper';
import useStylesheet from '../../../../hooks/useStylesheet';
import { CONTENT_TYPE_HTML } from '../../../../../model/Artifact';
import SaveIndicator from '../../SaveIndicator';
import useHtmlModifier from '../../../../hooks/useHtmlModifier';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    button: {
      marginLeft: 8,
    },
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

const HtmlEditor: FC<Props> = ({ formik, initialFile, showError, meta }) => {
  const editor = useRef<JoditEditor | null>(null);
  const [content, setContent] = useState<string | null>(null);
  const [saveButtonVisible, setSaveButtonVisible] = useState<boolean>(false);
  const stylesheet = useStylesheet();
  const { modifyHtmlAfterUpload } = useHtmlModifier();
  const classes = useStyles();

  const getErrorMessage = (): string => {
    if (showError && meta.error) {
      return meta.error;
    }
    return '';
  };

  const showSaveButton = () => {
    setSaveButtonVisible(true);
    setTimeout(() => {
      setSaveButtonVisible(false);
    }, 5000);
  };

  const handleUpdateFile = (file: string) => {
    if (content === file) {
      return;
    }
    const html = modifyHtmlAfterUpload(file);
    formik.current?.setFieldValue('htmlContent', html);
    setContent(html);
    showSaveButton();
  };

  const handleUpdateFileFromBase64 = useCallback(
    (file: string | null) => {
      let html = file
        ? base64Helper.getBodyFromBase64(file, CONTENT_TYPE_HTML)
        : '';
      html = modifyHtmlAfterUpload(html);
      formik.current?.setFieldValue('htmlContent', html);
      setContent(html);
    },
    [formik, modifyHtmlAfterUpload]
  );

  const getBase64HtmlContent = (): string | null => {
    if (content === null || content === '') {
      return null;
    }
    return base64Helper.getBase64FromFile(content, CONTENT_TYPE_HTML);
  };

  useEffect(() => {
    if (content !== null) {
      return;
    }
    async function setInitialHtmlContent() {
      if (stylesheet === undefined) {
        return;
      }
      let html = initialFile;
      if (html) {
        html = modifyHtmlAfterUpload(html);
      } else {
        // Use the 'default' template.
        html = await artifactsRepository
          .getArtifactByTitle(
            'Standaard',
            ARTIFACT_TYPE_TEMPLATE,
            CONTENT_TYPE_HTML
          )
          .then((artifact) =>
            artifact?.content ? modifyHtmlAfterUpload(artifact.content) : ''
          );
      }
      formik.current?.setFieldValue('htmlContent', html);
      setContent(html);
    }
    setInitialHtmlContent();
  }, [content, formik, initialFile, modifyHtmlAfterUpload, stylesheet]);

  const config = {
    // all options check: https://xdsoft.net/jodit/doc/
    height: 600,
    readonly: false,
    iframe: true,
    askBeforePasteHTML: false,
    askBeforePasteFromWord: false,
  };

  if (content === null || stylesheet === null) {
    return <LoadingSpinner />;
  }

  return (
    <div className={classes.relativeContainer}>
      {getErrorMessage() !== '' && (
        <ErrorTextTypography>{getErrorMessage()}</ErrorTextTypography>
      )}
      {saveButtonVisible && <SaveIndicator />}
      <div className={classes.relativeContainer}>
        <div className={classes.formControl}>
          <BottomToolbox
            contentType={CONTENT_TYPE_HTML}
            onUpdateFile={handleUpdateFile}
          />
        </div>
        <JoditEditor
          ref={editor}
          value={content ?? ''}
          // @ts-ignore
          config={config}
          onBlur={handleUpdateFile}
        />
      </div>
      <FileDropzoneArea
        allowedExtension=".html"
        allowedMimeTypes={['text/html']}
        initialFile={getBase64HtmlContent()}
        onUpdateFile={handleUpdateFileFromBase64}
      />
    </div>
  );
};

export default HtmlEditor;
