import React, { FC, SyntheticEvent } from 'react';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import { Box } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { notify } from '../redux/slice/notificationSlice';

function Alert(props: AlertProps) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const SnackbarNotification: FC = () => {
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
    <Box
      sx={{
        width: '100%',
        '& > * + *': {
          marginTop: (theme) => theme.spacing(2),
        },
      }}
    >
      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        open={notificationOpen}
        autoHideDuration={6000}
        onClose={() => handleClose()}
      >
        {/* For MUI5 it is required to put the alert in a div container to forward the refs.
        Info: https://mui.com/material-ui/guides/migration-v4/#cannot-read-property-scrolltop-of-null */}
        <div>
          <Alert onClose={handleClose} severity={notificationType}>
            {notificationMessage}
          </Alert>
        </div>
      </Snackbar>
    </Box>
  );
};

export default SnackbarNotification;
