import React, {
  FC,
  forwardRef,
  ReactElement,
  Ref,
  useCallback,
  useRef,
  useState,
} from 'react';
import * as Yup from 'yup';
import { Formik, Form, FormikValues, FormikHelpers } from 'formik';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import { TransitionProps } from '@material-ui/core/transitions';
import Slide from '@material-ui/core/Slide';
import { Dialog } from '@material-ui/core';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import { makeStyles } from '@material-ui/core/styles';
import Generate from 'generate-password';
import SubmitButton from '../../components/form/formik/SubmitButton';
import TextField from '../../components/form/formik/TextField';
import createUser from '../../firebase/functions/createUser';
import { User } from '../../model/users/User';
import { notify } from '../../redux/slice/notificationSlice';
import logger from '../../helper/logger';
import { useAppDispatch } from '../../redux/hooks';
import validateYupUserEmail from '../../components/form/formik/validators/validateYupUserEmail';
import AlertBox from '../../components/AlertBox';
import CopyToClipboardAction from '../../components/CopyToClipboardAction';

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
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [showError, setShowError] = useState<boolean>(false);
  const formikRef = useRef<any>();
  const dispatch = useAppDispatch();
  const classes = useStyles();

  const handleSubmitForm = (
    values: FormikValues,
    formik: FormikHelpers<any>
  ) => {
    formik.setSubmitting(false);
    setSubmitting(true);
    createUser(values as User)
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
        setSubmitting(false);
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

  const generatePassword = useCallback(() => {
    return Generate.generate({
      length: 16,
      uppercase: false,
    });
  }, []);

  const initialFormState = () => {
    return {
      email: '',
      password: generatePassword(),
    };
  };

  const formValidation = Yup.object().shape({
    email: validateYupUserEmail(),
  });

  return (
    <Dialog
      fullWidth
      open={openCreateUserDialog}
      TransitionComponent={Transition}
      keepMounted
      onClose={() => !submitting && oncloseDialog()}
      aria-labelledby="alert-dialog-slide-title"
      aria-describedby="alert-dialog-slide-description"
    >
      <DialogTitle id="alert-dialog-slide-title">
        Gebruiker toevoegen
      </DialogTitle>
      <Formik
        innerRef={formikRef}
        initialValues={{ ...initialFormState() }}
        validationSchema={formValidation}
        onSubmit={handleSubmitForm}
      >
        {({ isSubmitting, dirty, values }) => (
          <Form>
            <DialogContent>
              <DialogContentText
                style={{ whiteSpace: 'pre-line' }}
                id="description"
              >
                Voeg een nieuwe gebruiker voor het CMS toe.
              </DialogContentText>
              {submitting && (
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
                disabled={submitting}
              />
              <TextField
                showError={showError}
                className={classes.textFieldStyle}
                required
                id="password"
                label="Tijdelijk wachtwoord"
                name="password"
                disabled
                InputProps={{
                  endAdornment: (
                    <CopyToClipboardAction textToCopy={values.password} />
                  ),
                }}
              />
            </DialogContent>
            <DialogActions>
              <Button
                onClick={oncloseDialog}
                color="primary"
                variant="contained"
                disabled={submitting}
              >
                Annuleren
              </Button>
              <SubmitButton
                showInBottomBar={false}
                setShowError={setShowError}
                disabled={isSubmitting || !dirty || submitting}
                color="secondary"
                variant="contained"
              >
                Toevoegen
              </SubmitButton>
            </DialogActions>
          </Form>
        )}
      </Formik>
    </Dialog>
  );
};

export default CreateUserFormDialog;
