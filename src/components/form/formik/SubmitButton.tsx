import React from 'react';
import { Button } from '@material-ui/core';
import { useFormikContext } from 'formik';

interface Props {
  children: string;
  setShowError: (showError: boolean) => void;
}

const SubmitButton: React.FC<Props> = ({
  children,
  setShowError,
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
    onClick: handleSubmit,
  };

  return <Button {...configButton}>{children}</Button>;
};

export default SubmitButton;
