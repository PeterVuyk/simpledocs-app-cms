import React, { useRef, useEffect, useState, useCallback, FC } from 'react';
import { useFormikContext } from 'formik';
import { Theme } from '@mui/material/styles';
import { Box } from '@mui/material';
import BottomToolbox from '../toolbox/BottomToolbox';
import FileDropzoneArea from '../../../FileDropzoneArea';
import ErrorTextTypography from '../../../../text/ErrorTextTypography';
import LoadingSpinner from '../../../../LoadingSpinner';
import artifactsRepository from '../../../../../firebase/database/artifactsRepository';
import { ARTIFACT_TYPE_TEMPLATE } from '../../../../../model/artifacts/ArtifactType';
import base64Helper from '../../../../../helper/base64Helper';
import { CONTENT_TYPE_HTML } from '../../../../../model/ContentType';
import useHtmlModifier from '../../../../hooks/useHtmlModifier';
import JoditEditorWrapper from './JoditEditorWrapper';
import getStylesheet from '../../../../hooks/getStylesheet';
import { Artifact } from '../../../../../model/artifacts/Artifact';

interface Props {
  meta: any;
  initialFile: string | null;
  formik: React.MutableRefObject<any>;
  showError: boolean;
}

const HtmlEditor: FC<Props> = ({ formik, initialFile, showError, meta }) => {
  const [content, setContent] = useState<string | null>(null);
  const [stylesheet, setStylesheet] = useState<Artifact | null>(null);
  const currentContent = useRef<string>('');
  const { modifyHtmlAfterUpload } = useHtmlModifier();
  const formikProps = useFormikContext();

  const getErrorMessage = (): string => {
    if (showError && meta.error) {
      return meta.error;
    }
    return '';
  };

  const handleUpdateFromStylesheet = async (file: string) => {
    if (currentContent.current === file) {
      return;
    }
    const html = await modifyHtmlAfterUpload(file);
    formikProps.setFieldValue('htmlContent', html);
    setContent(html);
  };

  const handleEditorOnChange = (file: string) => {
    formikProps.setFieldValue('htmlContent', file);
  };

  const handleUpdateFileFromBase64 = useCallback(
    async (file: string | null) => {
      let html = file
        ? base64Helper.getBodyFromBase64(file, CONTENT_TYPE_HTML)
        : '';
      html = await modifyHtmlAfterUpload(html);
      formik.current?.setFieldValue('htmlContent', html);
      currentContent.current = html;
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
      setStylesheet((await getStylesheet()) ?? null);
      if (stylesheet === null) {
        return;
      }
      let html = initialFile;
      if (html) {
        html = await modifyHtmlAfterUpload(html);
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
      currentContent.current = html ?? '';
      setContent(html);
    }
    setInitialHtmlContent();
  }, [content, formik, initialFile, modifyHtmlAfterUpload]);

  return (
    <div style={{ position: 'relative' }}>
      {getErrorMessage() !== '' && (
        <ErrorTextTypography>{getErrorMessage()}</ErrorTextTypography>
      )}
      {(content === null || stylesheet === null) && <LoadingSpinner />}
      {(content !== null || stylesheet !== null) && (
        <div style={{ position: 'relative' }}>
          <Box
            sx={{
              margin: (theme: Theme) => theme.spacing(1),
              position: 'absolute',
              zIndex: 1000,
              right: 10,
              bottom: 30,
            }}
          >
            <BottomToolbox
              contentType={CONTENT_TYPE_HTML}
              onUpdateFile={handleUpdateFromStylesheet}
            />
          </Box>
          <JoditEditorWrapper
            onChange={handleEditorOnChange}
            content={content ?? ''}
          />
        </div>
      )}
      <FileDropzoneArea
        allowedExtension=".html"
        allowedMimeTypes={['text/html']}
        initialFile={getBase64HtmlContent()}
        onUpdateFile={handleUpdateFileFromBase64}
      />
    </div>
  );
};

export default React.memo(HtmlEditor);
