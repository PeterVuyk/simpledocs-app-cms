import React from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import notification, {
  NotificationOptions,
} from '../redux/actions/notification';

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

interface Props {
  setNotification: (notificationOptions: NotificationOptions) => void;
  notificationOptions: NotificationOptions;
}

const SnackbarNotification: React.FC<Props> = ({
  setNotification,
  notificationOptions,
}) => {
  const classes = useStyles();
  const {
    notificationMessage,
    notificationType,
    notificationOpen,
  } = notificationOptions;

  const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setNotification({
      notificationOpen: false,
      notificationType: 'success',
      notificationMessage: '',
    });
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

const mapStateToProps = (state: any) => {
  return {
    notificationOptions: state.notification.notificationOptions,
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    setNotification: (notificationOptions: NotificationOptions) =>
      // eslint-disable-next-line import/no-named-as-default-member
      dispatch(notification.setNotification(notificationOptions)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SnackbarNotification);
