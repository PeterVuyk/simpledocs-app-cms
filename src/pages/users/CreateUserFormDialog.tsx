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
import SubmitButton from '../../components/form/formik/SubmitButton';
import TextField from '../../components/form/formik/TextField';
import createUser from '../../firebase/functions/createUser';
import { notify } from '../../redux/slice/notificationSlice';
import logger from '../../helper/logger';
import { useAppDispatch } from '../../redux/hooks';
import validateYupUserEmail from '../../components/form/formik/validators/validateYupUserEmail';
import AlertBox from '../../components/AlertBox';
import { auth } from '../../firebase/firebaseConnection';
import DialogTransition from '../../components/dialog/DialogTransition';

interface Props {
  openCreateUserDialog: boolean;
  oncloseDialog: () => void;
  onSubmit: () => void;
}

const CreateUserFormDialog: FC<Props> = ({
  openCreateUserDialog,
  oncloseDialog,
  onSubmit,
}) => {
  const [showError, setShowError] = useState<boolean>(false);
  const formikRef = useRef<any>();
  const dispatch = useAppDispatch();

  const handleSubmitForm = (values: FormikValues) => {
    createUser(values.email)
      .then(() => auth.sendPasswordResetEmail(values.email))
      .then(() =>
        dispatch(
          notify({
            notificationType: 'success',
            notificationOpen: true,
            notificationMessage: 'Gebruiker is toegevoegd.',
          })
        )
      )
      .then(oncloseDialog)
      .then(onSubmit)
      .catch((error) => {
        logger.errorWithReason(
          'Create user failed in CreateUserFormDialog.handleSubmitForm',
          error
        );
        dispatch(
          notify({
            notificationType: 'error',
            notificationOpen: true,
            notificationMessage: `Het toevoegen van de gebruiker is mislukt, bestaat de gebruiker mogelijk al?`,
          })
        );
      });
  };

  const initialFormState = () => {
    return {
      email: '',
    };
  };

  const formValidation = Yup.object().shape({
    email: validateYupUserEmail(),
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
          open={openCreateUserDialog}
          TransitionComponent={DialogTransition}
          keepMounted
          onClose={() => !isSubmitting && oncloseDialog()}
        >
          <DialogTitle id="alert-dialog-slide-title">
            Gebruiker toevoegen
          </DialogTitle>
          <Form>
            <DialogContent>
              <DialogContentText
                style={{ whiteSpace: 'pre-line' }}
                id="description"
              >
                Via deze optie voeg je een nieuwe gebruiker aan het CMS toe. De
                nieuwe gebruiker ontvangt per mail een link waar hij zijn
                wachtwoord kan opgeven, waarmee hij vervolgens kan inloggen in
                deze omgeving. De link in deze email zal 6 uur geldig zijn, lukt
                het de nieuwe gebruiker niet om in deze tijd het account te
                activeren dan kan hij een nieuwe link aanvragen via de login
                pagina &#39;wachtwoord vergeten &#39;.
              </DialogContentText>
              {isSubmitting && (
                <AlertBox severity="info" message="Een moment geduld..." />
              )}
              <TextField
                sx={{ marginBottom: (theme: Theme) => theme.spacing(2) }}
                showError={showError}
                required
                id="email"
                label="Emailadres"
                name="email"
                autoComplete="email"
                disabled={isSubmitting}
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
                Toevoegen
              </SubmitButton>
            </DialogActions>
          </Form>
        </Dialog>
      )}
    </Formik>
  );
};

export default CreateUserFormDialog;
