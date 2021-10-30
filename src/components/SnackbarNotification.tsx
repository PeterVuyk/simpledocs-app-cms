import React, { FC, SyntheticEvent } from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { notify } from '../redux/slice/notificationSlice';

function Alert(props: AlertProps) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  },
}));

const SnackbarNotification: FC = () => {
  const classes = useStyles();
  const dispatch = useAppDispatch();
  const { notificationMessage, notificationType, notificationOpen } =
    useAppSelector((state) => state.notification);

  const handleClose = (event?: SyntheticEvent, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    dispatch(
      notify({
        notificationOpen: false,
        notificationType: 'success',
        notificationMessage: '',
      })
    );
  };

  return (
    <div className={classes.root}>
      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        open={notificationOpen}
        autoHideDuration={6000}
        onClose={handleClose}
      >
        <Alert onClose={handleClose} color={notificationType}>
          {notificationMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default SnackbarNotification;
