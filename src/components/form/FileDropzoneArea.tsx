import React from 'react';
import { DropzoneAreaBase, FileObject } from 'material-ui-dropzone';
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
  [x: string]: any;
}

const SelectWrapper: React.FC<Props> = ({
  name,
  formik,
  showError,
  allowedMimeTypes,
  dropzoneText,
  enableHtmlPreview,
}) => {
  const [showHtmlPreview, setShowHtmlPreview] = React.useState<string | null>(
    null
  );
  const [field, mata] = useField(name);

  const configDropzoneArea: any = {
    ...field,
  };

  if (mata && mata.touched && mata.error) {
    configDropzoneArea.helperText = mata.error;
  }

  const handleAdd = async (newFiles: FileObject[]) => {
    if (newFiles.length > 1) {
      return;
    }
    formik.current.setFieldValue(name, newFiles[0]);
  };

  const closeHtmlPreviewHandle = (): void => {
    console.log(showHtmlPreview);
    setShowHtmlPreview(null);
  };

  const handleDelete = () => {
    formik.current.setFieldValue(name, '');
  };

  const getFileObjects = (): FileObject[] => {
    if (
      formik.current?.values[name] !== undefined &&
      formik.current?.values[name] !== ''
    ) {
      return [formik.current.values[name] as FileObject];
    }
    return [];
  };

  if (showError && mata.error) {
    configDropzoneArea.helperText = mata.error;
  }

  const fileAddedMessage = (fileName: string): string => {
    return `Bestand ${fileName} is toegevoegd.`;
  };

  const fileRemovedMessage = (fileName: string): string => {
    return `Bestand ${fileName} is verwijderd.`;
  };

  const dropRejectMessage = (fileName: string): string => {
    return `Upload van bestand ${fileName} geweigerd`;
  };

  const fileLimitExceedMessage = (): string => {
    return `Maximaal aantal toegestane bestanden overschreden. Slechts 1 bestand is toegestaan`;
  };

  return (
    <div style={{ position: 'relative' }}>
      <DropzoneAreaBase
        {...configDropzoneArea}
        getFileAddedMessage={fileAddedMessage}
        getFileRemovedMessage={fileRemovedMessage}
        getDropRejectMessage={dropRejectMessage}
        getFileLimitExceedMessage={fileLimitExceedMessage}
        dropzoneText={dropzoneText}
        fileObjects={getFileObjects()}
        acceptedFiles={allowedMimeTypes}
        // initialFiles={file}
        filesLimit={1}
        onAdd={handleAdd}
        onDelete={handleDelete}
      />
      {enableHtmlPreview && getFileObjects().length !== 0 && (
        <div style={{ position: 'absolute', bottom: 0, right: 5 }}>
          <FindInPageTwoToneIcon
            color="primary"
            style={{ cursor: 'pointer', fontSize: '4em' }}
            onClick={() =>
              setShowHtmlPreview(getFileObjects()[0].data as string)
            }
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
