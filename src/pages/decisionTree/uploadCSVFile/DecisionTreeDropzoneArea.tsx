import React from 'react';
import { DropzoneArea } from 'material-ui-dropzone';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';

const ErrorTextTypography = withStyles({
  root: {
    color: '#f44336',
    fontSize: '0.8rem',
    fontFamily: 'arial',
    fontWeight: 400,
  },
})(Typography);

interface Props {
  uploadRef: any;
  showError: boolean;
  allowedMimeTypes: string[];
}

const DecisionTreeDropzoneArea: React.FC<Props> = ({
  uploadRef,
  showError,
  allowedMimeTypes,
}) => {
  const ONE_MB_MAX_FILE_SIZE = 1000000;

  const configDropzoneArea: any = {};

  if (showError) {
    configDropzoneArea.helperText = 'error message!';
  }

  const handleUploadChange = (files: File[]) => {
    if (files.length !== 1) {
      // Remove file
      // eslint-disable-next-line no-param-reassign
      uploadRef.current = '';
      return;
    }

    // Add uploaded file
    const reader = new FileReader();
    reader.readAsDataURL(files[0] as Blob);
    reader.onloadend = () => {
      // eslint-disable-next-line no-param-reassign
      uploadRef.current = reader.result;
    };
  };

  const fileAddedMessage = (fileName: string): string => {
    return `Het bestand ${fileName} is toegevoegd.`;
  };

  const fileRemovedMessage = (): string => {
    return `Het bestand is verwijderd.`;
  };

  const dropRejectMessage = (rejectedFile: File): string => {
    return `Het uploaden van bestand ${rejectedFile.name} is geweigerd, alleen csv bestanden van maximaal 1 MB is toegestaan.`;
  };

  const fileLimitExceedMessage = (): string => {
    return `Maximaal aantal toegestane bestanden of grote hiervan is overschreden. Slechts 1 bestand van maximaal 1 MB is toegestaan.`;
  };

  return (
    <div style={{ position: 'relative' }}>
      <DropzoneArea
        {...configDropzoneArea}
        dropzoneText="Klik hier of sleep het csv bestand hierheen"
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

export default DecisionTreeDropzoneArea;
