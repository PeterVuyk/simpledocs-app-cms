import React, { FC, useCallback, useEffect, useState } from 'react';
import { CONTENT_TYPE_MARKDOWN } from '../../../../model/Artifact';
import base64Helper from '../../../../helper/base64Helper';
import ErrorTextTypography from '../../../text/ErrorTextTypography';
import FileDropzoneArea from '../../FileDropzoneArea';

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

  useEffect(() => {
    formik.current?.setFieldValue('markdownContent', initialFile);
    setContent(initialFile);
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
      setContent(markdown);
    },
    [formik]
  );

  return (
    <>
      {getErrorMessage() !== '' && (
        <ErrorTextTypography>{getErrorMessage()}</ErrorTextTypography>
      )}
      <FileDropzoneArea
        allowedExtension=".md"
        allowedMimeTypes={['text/markdown']}
        initialFile={getBase64MarkdownContent()}
        onUpdateFile={handleUpdateFileFromBase64}
      />
    </>
  );
};

export default MarkdownEditor;
