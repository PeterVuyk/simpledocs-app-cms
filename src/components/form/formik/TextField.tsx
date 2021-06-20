import React, { FC } from 'react';
import { OutlinedTextFieldProps, TextField } from '@material-ui/core';
import { useField } from 'formik';

interface Props {
  name: string;
  showError: boolean;
  [x: string]: any;
}

const TextfieldWrapper: FC<Props> = ({ name, showError, ...otherProps }) => {
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
