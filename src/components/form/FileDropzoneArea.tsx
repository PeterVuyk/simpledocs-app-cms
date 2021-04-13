import React from 'react';
import { DropzoneArea } from 'material-ui-dropzone';
import { useField } from 'formik';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import FindInPageTwoToneIcon from '@material-ui/icons/FindInPageTwoTone';
import HtmlPreview from '../dialog/HtmlPreview';

const ErrorTextTypography = withStyles({
  root: {
    color: '#f44336',
    fontSize: '0.8rem',
    fontFamily: 'Roboto, Helvetica',
    fontWeight: 400,
  },
})(Typography);

interface Props {
  name: string;
  formik: any;
  showError: boolean;
  allowedMimeTypes: string[];
  dropzoneText: string;
  enableHtmlPreview: boolean;
  initialFile: string | null;
  [x: string]: any;
}

const SelectWrapper: React.FC<Props> = ({
  name,
  formik,
  showError,
  allowedMimeTypes,
  dropzoneText,
  enableHtmlPreview,
  initialFile,
}) => {
  const [showHtmlPreview, setShowHtmlPreview] = React.useState<string | null>(
    null
  );
  const [field, mata] = useField(name);

  const configDropzoneArea: any = {
    ...field,
    initialFiles: initialFile === null ? undefined : [initialFile],
  };

  if (mata && mata.touched && mata.error) {
    configDropzoneArea.helperText = mata.error;
  }

  const closeHtmlPreviewHandle = (): void => {
    setShowHtmlPreview(null);
  };

  if (showError && mata.error) {
    configDropzoneArea.helperText = mata.error;
  }

  const handleUploadChange = (files: File[]) => {
    if (files.length !== 1) {
      // Remove file
      formik.current.setFieldValue(name, '');
      return;
    }

    // Add uploaded file
    const reader = new FileReader();
    reader.readAsDataURL(files[0] as Blob);
    reader.onloadend = () => {
      const base64data = reader.result;
      formik.current.setFieldValue(name, base64data);
    };
  };

  const fileAddedMessage = (fileName: string): string => {
    return `Bestand ${fileName} is toegevoegd.`;
  };

  const fileRemovedMessage = (fileName: string): string => {
    return `Bestand ${fileName} is verwijderd.`;
  };

  const dropRejectMessage = (rejectedFile: File): string => {
    return `Upload van bestand ${rejectedFile.name} geweigerd`;
  };

  const fileLimitExceedMessage = (): string => {
    return `Maximaal aantal toegestane bestanden overschreden. Slechts 1 bestand is toegestaan`;
  };

  return (
    <div style={{ position: 'relative' }}>
      <DropzoneArea
        {...configDropzoneArea}
        dropzoneText={dropzoneText}
        acceptedFiles={allowedMimeTypes}
        filesLimit={1}
        getFileAddedMessage={fileAddedMessage}
        getFileRemovedMessage={fileRemovedMessage}
        getDropRejectMessage={dropRejectMessage}
        getFileLimitExceedMessage={fileLimitExceedMessage}
        onChange={handleUploadChange}
      />
      {enableHtmlPreview && formik.current?.values[name] !== '' && (
        <div style={{ position: 'absolute', bottom: 0, right: 5 }}>
          <FindInPageTwoToneIcon
            color="primary"
            style={{ cursor: 'pointer', fontSize: '4em' }}
            onClick={() => setShowHtmlPreview(formik.current?.values[name])}
          />
        </div>
      )}
      {showHtmlPreview && (
        <HtmlPreview
          showHtmlPreview={showHtmlPreview}
          closeHtmlPreviewHandle={closeHtmlPreviewHandle}
        />
      )}
      <ErrorTextTypography>{configDropzoneArea.helperText}</ErrorTextTypography>
    </div>
  );
};

export default SelectWrapper;
