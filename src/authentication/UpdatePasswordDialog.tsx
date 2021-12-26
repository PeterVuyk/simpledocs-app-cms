import React, { FC, useRef, useState } from 'react';
import * as Yup from 'yup';
import { Formik, Form, FormikValues } from 'formik';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import { Dialog } from '@material-ui/core';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import { makeStyles } from '@material-ui/core/styles';
import SubmitButton from '../components/form/formik/SubmitButton';
import TextField from '../components/form/formik/TextField';
import { notify } from '../redux/slice/notificationSlice';
import logger from '../helper/logger';
import { useAppDispatch } from '../redux/hooks';
import AlertBox from '../components/AlertBox';
import updateUser from '../firebase/functions/updateUser';
import validateYupPassword from '../components/form/formik/validators/validateYupPassword';
import DialogTransition from '../components/dialog/DialogTransition';

const useStyles = makeStyles((theme) => ({
  textFieldStyle: {
    marginBottom: theme.spacing(2),
  },
}));

interface Props {
  oncloseDialog: () => void;
}

const UpdatePasswordDialog: FC<Props> = ({ oncloseDialog }) => {
  const [showError, setShowError] = useState<boolean>(false);
  const formikRef = useRef<any>();
  const dispatch = useAppDispatch();
  const classes = useStyles();

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
                className={classes.textFieldStyle}
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
                Annuleren
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
