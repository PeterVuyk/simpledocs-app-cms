import React, { FC } from 'react';
import { Box, Button } from '@mui/material';
import { useFormikContext } from 'formik';
import { Theme } from '@mui/material/styles';

interface Props {
  children: string;
  setShowError: (showError: boolean) => void;
  disabled: boolean;
  showInBottomBar: boolean;
  [x: string]: any;
}

const SubmitButton: FC<Props> = ({
  children,
  setShowError,
  disabled,
  showInBottomBar,
  ...otherProps
}) => {
  const { submitForm } = useFormikContext();

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    submitForm().then(() => setShowError(true));
  };

  const configButton: any = {
    variant: 'contained',
    color: 'primary',
    fullWidth: !!showInBottomBar,
    disabled,
    onClick: handleSubmit,
    ...otherProps,
  };

  if (!showInBottomBar) {
    return <Button {...configButton}>{children}</Button>;
  }

  return (
    <>
      <Box
        sx={{
          position: 'fixed',
          borderTop: 'solid',
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: '#fff',
          zIndex: (theme) => theme.zIndex.drawer - 1,
          borderTopWidth: 1,
          borderTopColor: '#898989',
        }}
      >
        <Box
          sx={{
            position: 'relative',
            width: 200,
            float: 'right',
            margin: (theme: Theme) => theme.spacing(1, 4, 1, 0),
          }}
        >
          <Button {...configButton}>{children}</Button>
        </Box>
      </Box>
      <div style={{ height: 100 }} />
    </>
  );
};

export default SubmitButton;
