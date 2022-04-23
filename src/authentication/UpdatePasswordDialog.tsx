import React, { FC, useRef, useState } from 'react';
import * as Yup from 'yup';
import { Formik, Form, FormikValues } from 'formik';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import { Dialog } from '@mui/material';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import { Theme } from '@mui/material/styles';
import SubmitButton from '../components/form/formik/SubmitButton';
import TextField from '../components/form/formik/TextField';
import { notify } from '../redux/slice/notificationSlice';
import logger from '../helper/logger';
import { useAppDispatch } from '../redux/hooks';
import AlertBox from '../components/AlertBox';
import updateUser from '../firebase/functions/updateUser';
import validateYupPassword from '../components/form/formik/validators/validateYupPassword';
import DialogTransition from '../components/dialog/DialogTransition';

interface Props {
  oncloseDialog: () => void;
}

const UpdatePasswordDialog: FC<Props> = ({ oncloseDialog }) => {
  const [showError, setShowError] = useState<boolean>(false);
  const formikRef = useRef<any>();
  const dispatch = useAppDispatch();

  const handleSubmitForm = (values: FormikValues) => {
    updateUser(values.password)
      .then(() =>
        dispatch(
          notify({
            notificationType: 'success',
            notificationOpen: true,
            notificationMessage: 'Wachtwoord is gewijzigd.',
          })
        )
      )
      .then(oncloseDialog)
      .catch((error) => {
        logger.errorWithReason(
          'update user failed for password in UpdatePasswordDialog.handleSubmitForm',
          error
        );
        dispatch(
          notify({
            notificationType: 'error',
            notificationOpen: true,
            notificationMessage: `Het wijzigen van het wachtwoord is mislukt.`,
          })
        );
      });
  };

  const initialFormState = () => {
    return {
      password: '',
    };
  };

  const formValidation = Yup.object().shape({
    password: validateYupPassword(),
  });

  return (
    <Formik
      innerRef={formikRef}
      initialValues={{ ...initialFormState() }}
      validationSchema={formValidation}
      onSubmit={handleSubmitForm}
    >
      {({ isSubmitting, dirty }) => (
        <Dialog
          fullWidth
          open
          TransitionComponent={DialogTransition}
          keepMounted
          onClose={() => !isSubmitting && oncloseDialog()}
        >
          <DialogTitle id="alert-dialog-slide-title">
            Wachtwoord wijzigen
          </DialogTitle>
          <Form>
            <DialogContent>
              <DialogContentText
                style={{ whiteSpace: 'pre-line' }}
                id="description"
              >
                Geef uw nieuwe wachtwoord op.
              </DialogContentText>
              {isSubmitting && (
                <AlertBox severity="info" message="Een moment geduld..." />
              )}
              <TextField
                showError={showError}
                sx={{ marginTop: (theme: Theme) => theme.spacing(2) }}
                required
                id="password"
                label="Wachtwoord"
                name="password"
                autoFocus
              />
            </DialogContent>
            <DialogActions>
              <Button
                onClick={oncloseDialog}
                color="primary"
                variant="contained"
                disabled={isSubmitting}
              >
                Terug
              </Button>
              <SubmitButton
                showInBottomBar={false}
                setShowError={setShowError}
                disabled={isSubmitting || !dirty}
                color="secondary"
                variant="contained"
              >
                Wijzigen
              </SubmitButton>
            </DialogActions>
          </Form>
        </Dialog>
      )}
    </Formik>
  );
};

export default UpdatePasswordDialog;
