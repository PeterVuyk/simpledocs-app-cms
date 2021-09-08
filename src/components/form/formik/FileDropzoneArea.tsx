import React, { FC } from 'react';
import { DropzoneArea } from 'material-ui-dropzone';
import { useField } from 'formik';
import ErrorTextTypography from '../../text/ErrorTextTypography';

interface Props {
  name: string;
  formik: any;
  showError: boolean;
  allowedMimeTypes: string[];
  dropzoneText: string;
  initialFile: string | null;
  [x: string]: any;
}

const FileDropzoneArea: FC<Props> = ({
  name,
  formik,
  showError,
  allowedMimeTypes,
  dropzoneText,
  initialFile,
}) => {
  const [field, meta] = useField(name);

  const ONE_MB_MAX_FILE_SIZE = 1000000;

  const configDropzoneArea: any = {
    ...field,
    initialFiles: initialFile === null ? undefined : [initialFile],
  };

  if (meta && meta.touched && meta.error) {
    configDropzoneArea.helperText = meta.error;
  }

  if (showError && meta.error) {
    configDropzoneArea.helperText = meta.error;
  }

  const handleUploadChange = (files: File[]) => {
    if (files.length !== 1) {
      // Remove file
      formik.current?.setFieldValue(name, '');
      return;
    }

    // Add uploaded file
    const reader = new FileReader();
    reader.readAsDataURL(files[0] as Blob);
    reader.onloadend = () => {
      const base64data = reader.result;
      formik.current?.setFieldValue(name, base64data);
    };
  };

  const fileAddedMessage = (fileName: string): string => {
    return `Het bestand ${fileName} is toegevoegd.`;
  };

  const fileRemovedMessage = (): string => {
    return `Het bestand is verwijderd.`;
  };

  const dropRejectMessage = (rejectedFile: File): string => {
    return `Het uploaden van bestand ${rejectedFile.name} is geweigerd, maximaal 1 MB is toegestaan.`;
  };

  const fileLimitExceedMessage = (): string => {
    return `Maximaal aantal toegestane bestanden of grote hiervan is overschreden. Slechts 1 bestand van maximaal 1 MB is toegestaan.`;
  };

  return (
    <div style={{ position: 'relative' }}>
      <DropzoneArea
        {...configDropzoneArea}
        dropzoneText={dropzoneText}
        acceptedFiles={allowedMimeTypes}
        filesLimit={1}
        maxFileSize={ONE_MB_MAX_FILE_SIZE}
        getFileAddedMessage={fileAddedMessage}
        getFileRemovedMessage={fileRemovedMessage}
        getDropRejectMessage={dropRejectMessage}
        getFileLimitExceedMessage={fileLimitExceedMessage}
        onChange={handleUploadChange}
      />
      <ErrorTextTypography>{configDropzoneArea.helperText}</ErrorTextTypography>
    </div>
  );
};

export default FileDropzoneArea;
