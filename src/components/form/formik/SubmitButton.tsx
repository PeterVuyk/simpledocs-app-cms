import React, { FC } from 'react';
import { Button } from '@material-ui/core';
import { useFormikContext } from 'formik';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  container: {
    position: 'fixed',
    borderTop: 'solid',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    zIndex: theme.zIndex.drawer - 1,
    borderTopWidth: 1,
    borderTopColor: '#898989',
  },
  submitContainer: {
    position: 'relative',
    width: 200,
    float: 'right',
    margin: theme.spacing(1, 4, 1, 0),
  },
}));

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
  const classes = useStyles();
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
      <div className={classes.container}>
        <div className={classes.submitContainer}>
          <Button {...configButton}>{children}</Button>
        </div>
      </div>
      <div style={{ height: 100 }} />
    </>
  );
};

export default SubmitButton;
