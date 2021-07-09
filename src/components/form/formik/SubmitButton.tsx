import React, { FC } from 'react';
import { Button, Grid } from '@material-ui/core';
import { useFormikContext } from 'formik';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
  container: {
    position: 'fixed',
    borderTop: 'solid',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    zIndex: 100000,
    borderTopWidth: 1,
    borderTopColor: '#898989',
  },
  submitContainer: {
    position: 'relative',
    width: 200,
    float: 'right',
    margin: 10,
  },
}));

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
  const classes = useStyles();
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

  return (
    <div className={classes.container}>
      <Grid item container>
        <Grid item sm={false} lg={1} />
        <Grid item sm={10} lg={10}>
          <div className={classes.submitContainer}>
            <Button {...configButton}>{children}</Button>
          </div>
        </Grid>
        <Grid item sm={false} lg={1} />
      </Grid>
    </div>
  );
};

export default SubmitButton;
