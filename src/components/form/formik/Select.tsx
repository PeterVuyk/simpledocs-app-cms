import React, { FC, useCallback, useEffect } from 'react';
import { TextField, MenuItem, OutlinedTextFieldProps } from '@material-ui/core';
import { useField, useFormikContext } from 'formik';

interface Props {
  name: string;
  showError?: boolean;
  options: any;
  disabled?: boolean;
  [x: string]: any;
  required?: boolean;
}

const SelectWrapper: FC<Props> = ({
  name,
  showError,
  options,
  disabled,
  required,
  ...otherProps
}) => {
  const { setFieldValue } = useFormikContext();
  const [field, meta] = useField(name);

  const handleChange = (evt: any) => {
    const { value } = evt.target;
    setFieldValue(name, value);
  };

  useEffect(() => {
    if (!required) {
      setFieldValue(name, 'placeholder');
    }
  }, [name, required, setFieldValue]);

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

  const getOptions = useCallback(() => {
    return required ? options : { placeholder: 'Geen keuze', ...options };
  }, [options, required]);

  return (
    <TextField {...configSelect} disabled={disabled || !hasOptions()}>
      {hasOptions() &&
        Object.keys(getOptions()).map((item, pos) => {
          return (
            // eslint-disable-next-line react/no-array-index-key
            <MenuItem key={pos} value={item}>
              {getOptions()[item]}
            </MenuItem>
          );
        })}
    </TextField>
  );
};

export default SelectWrapper;
