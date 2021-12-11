import React, {
  FC,
  forwardRef,
  ReactElement,
  Ref,
  useRef,
  useState,
} from 'react';
import * as Yup from 'yup';
import { Formik, Form, FormikValues } from 'formik';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import { TransitionProps } from '@material-ui/core/transitions';
import Slide from '@material-ui/core/Slide';
import { Dialog } from '@material-ui/core';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import { makeStyles } from '@material-ui/core/styles';
import SubmitButton from '../../components/form/formik/SubmitButton';
import TextField from '../../components/form/formik/TextField';
import createUser from '../../firebase/functions/createUser';
import { notify } from '../../redux/slice/notificationSlice';
import logger from '../../helper/logger';
import { useAppDispatch } from '../../redux/hooks';
import validateYupUserEmail from '../../components/form/formik/validators/validateYupUserEmail';
import AlertBox from '../../components/AlertBox';
import { auth } from '../../firebase/firebaseConnection';

const useStyles = makeStyles((theme) => ({
  textFieldStyle: {
    marginBottom: theme.spacing(2),
  },
}));

const Transition = forwardRef(function Transition(
  props: TransitionProps & { children?: ReactElement },
  ref: Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

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
  const classes = useStyles();

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
          TransitionComponent={Transition}
          keepMounted
          onClose={() => !isSubmitting && oncloseDialog()}
          aria-labelledby="alert-dialog-slide-title"
          aria-describedby="alert-dialog-slide-description"
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
                Voeg een nieuwe gebruiker voor het CMS toe. De gebruiker
                ontvangt per mail een link waar hij zijn wachtwoord kan opgeven,
                waarmee hij vervolgens kan inloggen in deze omgeving.
              </DialogContentText>
              {isSubmitting && (
                <AlertBox
                  severity="info"
                  message="Een moment geduld, de gebruiker wordt aangemaakt"
                />
              )}
              <TextField
                showError={showError}
                className={classes.textFieldStyle}
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
                Annuleren
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
