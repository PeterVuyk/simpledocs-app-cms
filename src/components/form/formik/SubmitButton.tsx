import React, { FC } from 'react';
import { Button } from '@material-ui/core';
import { useFormikContext } from 'formik';

interface Props {
  children: string;
  setShowError: (showError: boolean) => void;
  disabled: boolean;
}

const SubmitButton: FC<Props> = ({
  children,
  setShowError,
  disabled,
  ...otherProps
}) => {
  const { submitForm } = useFormikContext();

  const handleSubmit = () => {
    submitForm().then(() => setShowError(true));
  };

  const configButton: any = {
    ...otherProps,
    variant: 'contained',
    color: 'primary',
    fullWidth: true,
    disabled,
    onClick: handleSubmit,
  };

  return <Button {...configButton}>{children}</Button>;
};

export default SubmitButton;
