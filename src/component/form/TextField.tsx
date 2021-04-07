import React from 'react';
import { OutlinedTextFieldProps, TextField } from '@material-ui/core';
import { useField } from 'formik';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const TextfieldWrapper = ({ name, showError, ...otherProps }) => {
  const [field, mata] = useField(name);

  const configTextfield: OutlinedTextFieldProps = {
    ...field,
    ...otherProps,
    fullWidth: true,
    variant: 'outlined',
  };

  if (showError && mata.error) {
    configTextfield.error = true;
    configTextfield.helperText = mata.error;
  }

  return <TextField {...configTextfield} />;
};

export default TextfieldWrapper;
