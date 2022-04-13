import React, { FC } from 'react';
import { useField } from 'formik';
import { Theme } from '@mui/material/styles';
import FileDropZoneArea from '../../../../FileDropzoneArea';
import TextField from '../../../../TextField';

interface Props {
  formik: any;
  showError: boolean;
  disabled: boolean;
}

const ImageWithFilenameField: FC<Props> = ({ formik, showError, disabled }) => {
  const [filenameField] = useField('filename');

  const setFilenameOnUpload = (file: File) => {
    if (filenameField.value !== '') {
      return;
    }
    formik.current?.setFieldValue('filename', file.name);
  };

  return (
    <>
      <TextField
        required
        showError={showError}
        id="filename"
        label="Bestandsnaam"
        name="filename"
        autoFocus
        disabled={disabled}
        sx={{ marginBottom: (theme: Theme) => theme.spacing(2) }}
      />
      <FileDropZoneArea
        name="image"
        formik={formik}
        showError={showError}
        dropzoneText="Klik hier of sleep de afbeelding hierheen"
        allowedMimeTypes={[
          'image/svg+xml',
          'image/jpeg',
          'image/jpg',
          'image/png',
        ]}
        initialFile={null}
        disabled={disabled}
        uploadCallback={setFilenameOnUpload}
      />
    </>
  );
};

export default ImageWithFilenameField;
