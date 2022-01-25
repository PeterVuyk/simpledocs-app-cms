import React, { FC } from 'react';
import { TextField, MenuItem, OutlinedTextFieldProps } from '@material-ui/core';
import { useField, useFormikContext } from 'formik';

interface Props {
  name: string;
  showError: boolean;
  options: any;
  disabled?: boolean;
  [x: string]: any;
}

const SelectWrapper: FC<Props> = ({
  name,
  showError,
  options,
  disabled,
  ...otherProps
}) => {
  const { setFieldValue } = useFormikContext();
  const [field, meta] = useField(name);

  const handleChange = (evt: any) => {
    const { value } = evt.target;
    setFieldValue(name, value);
  };

  const hasOptions = () => Object.keys(options).length !== 0;

  const configSelect: OutlinedTextFieldProps = {
    ...field,
    ...otherProps,
    select: hasOptions(),
    variant: 'outlined',
    fullWidth: true,
    onChange: handleChange,
  };

  if (showError && meta.error) {
    configSelect.error = true;
    configSelect.helperText = meta.error;
  }

  return (
    <TextField {...configSelect} disabled={disabled || !hasOptions()}>
      {hasOptions() &&
        Object.keys(options).map((item, pos) => {
          return (
            // eslint-disable-next-line react/no-array-index-key
            <MenuItem key={pos} value={item}>
              {options[item]}
            </MenuItem>
          );
        })}
    </TextField>
  );
};

export default SelectWrapper;
