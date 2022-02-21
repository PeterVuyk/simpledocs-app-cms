import React, { FC, useRef, useState } from 'react';
import * as Yup from 'yup';
import { Formik, FormikValues } from 'formik';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@material-ui/core';
import DialogContentText from '@material-ui/core/DialogContentText';
import { makeStyles } from '@material-ui/core/styles';
import DialogTransition from '../../components/dialog/DialogTransition';
import { NotificationContent } from '../../model/Notification/NotificationContent';
import TextField from '../../components/form/formik/TextField';
import SubmitButton from '../../components/form/formik/SubmitButton';
import sendNotification from '../../firebase/functions/sendNotification';
import AlertBox from '../../components/AlertBox';
import logger from '../../helper/logger';
import { notify } from '../../redux/slice/notificationSlice';
import { useAppDispatch } from '../../redux/hooks';

const useStyles = makeStyles((theme) => ({
  textFieldStyle: {
    marginBottom: theme.spacing(2),
  },
}));

interface Props {
  onReload: () => Promise<void>;
  onCloseDialog: () => void;
}

const SendNotificationDialog: FC<Props> = ({ onReload, onCloseDialog }) => {
  const [showError, setShowError] = useState<boolean>(false);
  const [customError, setCustomError] = useState<string>('');
  const formikRef = useRef<any>();
  const dispatch = useAppDispatch();

  const classes = useStyles();

  /**
   * Maximum message size is 4096 bytes, larger messages are rejected by the expo server
   */
  const maxSizeSucceeded = (values: NotificationContent): boolean => {
    return new Blob([JSON.stringify(values)]).size > 3500;
  };

  const handleSubmitForm = (values: FormikValues, formikHelpers: any) => {
    setCustomError('');
    if (maxSizeSucceeded(values)) {
      setCustomError(
        'Kort de notificatie in. Het totale bericht is groter dan toegestaan.'
      );
      formikHelpers.setSubmitting(false);
    }
    sendNotification(values as NotificationContent)
      .then(onCloseDialog)
      .then(onReload)
      .catch((reason) => {
        logger.errorWithReason(
          'Tried to send a notification but failed',
          reason
        );
        dispatch(
          notify({
            notificationType: 'error',
            notificationOpen: true,
            notificationMessage: `Het sturen van de notificatie is mislukt, ververs de pagina of probeer het later opnieuw`,
          })
        );
        formikHelpers.setSubmitting(false);
      });
  };

  const initialFormState = () => {
    return {
      title: '',
      body: '',
    };
  };

  const formValidation = Yup.object().shape({
    title: Yup.string(),
    body: Yup.string().required('Geef het bericht inhoud op'),
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
          onClose={() => !isSubmitting && onCloseDialog()}
        >
          <DialogTitle id="alert-dialog-slide-title">
            Verstuur notificatie
          </DialogTitle>
          <DialogContent>
            <DialogContentText
              style={{ whiteSpace: 'pre-line' }}
              id="description"
            >
              Verstuur een notificatie naar de gebruikers. In de app geven we
              aan dat We ons best doen om alleen meldingen te sturen waarvan we
              denken dat de gebruiker deze wilt lezen. Krijgt hij onnodige of te
              vaak notificaties dan kan hij de voorkeuren aanpassen om de
              notificaties uit te zetten.
            </DialogContentText>
            {isSubmitting && (
              <AlertBox severity="info" message="Een moment geduld..." />
            )}
            {customError && <AlertBox severity="error" message={customError} />}
            <TextField
              className={classes.textFieldStyle}
              autoFocus
              showError={showError}
              id="title"
              label="Titel"
              name="title"
            />
            <TextField
              showError={showError}
              multiline
              minRows={3}
              maxRows={8}
              required
              id="body"
              label="Bericht"
              name="body"
            />
          </DialogContent>
          <DialogActions>
            <Button
              onClick={onCloseDialog}
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
              Verstuur
            </SubmitButton>
          </DialogActions>
        </Dialog>
      )}
    </Formik>
  );
};

export default SendNotificationDialog;
