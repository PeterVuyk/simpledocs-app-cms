import React, { FC } from 'react';
import { Button } from '@material-ui/core';
import { useFormikContext } from 'formik';

interface Props {
  children: string;
  setShowError: (showError: boolean) => void;
  submitButtonDisabled: boolean;
  setSubmitButtonDisabled: (disabled: boolean) => void;
}

const SubmitButton: FC<Props> = ({
  children,
  setShowError,
  submitButtonDisabled,
  setSubmitButtonDisabled,
  ...otherProps
}) => {
  const { submitForm } = useFormikContext();

  const handleSubmit = () => {
    setSubmitButtonDisabled(true);
    submitForm().then(() => setShowError(true));
  };

  const configButton: any = {
    ...otherProps,
    variant: 'contained',
    color: 'primary',
    fullWidth: true,
    disabled: submitButtonDisabled,
    onClick: handleSubmit,
  };

  return <Button {...configButton}>{children}</Button>;
};

export default SubmitButton;
