import React from 'react';
import { DropzoneAreaBase, FileObject } from 'material-ui-dropzone';
import { useField } from 'formik';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';

const ErrorTextTypography = withStyles({
  root: {
    color: '#f44336',
    fontSize: '0.8rem',
    fontFamily: 'Roboto, Helvetica',
    fontWeight: 400,
  },
})(Typography);

export default function FileDropZoneArea({
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  name,
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  formik,
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  showError,
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  allowedMimeTypes,
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  initialFile,
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  dropzoneText,
}): JSX.Element {
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

  return (
    <div>
      <DropzoneAreaBase
        {...configDropzoneArea}
        dropzoneText={dropzoneText}
        fileObjects={getFileObjects()}
        acceptedFiles={allowedMimeTypes}
        // initialFiles={file}
        filesLimit={1}
        onAdd={handleAdd}
        onDelete={handleDelete}
      />
      <ErrorTextTypography>{configDropzoneArea.helperText}</ErrorTextTypography>
    </div>
  );
}
