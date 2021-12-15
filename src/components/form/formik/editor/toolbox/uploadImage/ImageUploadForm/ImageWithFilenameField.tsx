import React, { FC } from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { useField } from 'formik';
import FileDropZoneArea from '../../../../FileDropzoneArea';
import TextField from '../../../../TextField';

const useStyles = makeStyles((theme: Theme) => ({
  textFieldStyle: {
    marginBottom: theme.spacing(2),
  },
}));

interface Props {
  formik: any;
  showError: boolean;
  disabled: boolean;
}

const ImageWithFilenameField: FC<Props> = ({ formik, showError, disabled }) => {
  const [filenameField] = useField('filename');

  const classes = useStyles();

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
        className={classes.textFieldStyle}
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
