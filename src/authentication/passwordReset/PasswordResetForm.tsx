import React, { FC, useRef, useState } from 'react';
import Typography from '@mui/material/Typography';
import { Formik, Form, FormikValues } from 'formik';
import * as Yup from 'yup';
import { Theme } from '@mui/material/styles';
import TextField from '../../components/form/formik/TextField';
import validateYupUserEmail from '../../components/form/formik/validators/validateYupUserEmail';
import SubmitButton from '../../components/form/formik/SubmitButton';
import { auth } from '../../firebase/firebaseConnection';

interface Props {
  onReset: () => void;
}

const PasswordResetForm: FC<Props> = ({ onReset }) => {
  const formikRef = useRef<any>();
  const [showError, setShowError] = useState<boolean>(false);

  const handleSubmitForm = async (values: FormikValues) => {
    await auth
      .sendPasswordResetEmail(values.email)
      .catch((error) => {
        const mute = error;
      })
      .then(onReset);
  };

  const initialFormState = () => {
    return { email: '' };
  };

  const formValidation = Yup.object().shape({
    email: validateYupUserEmail(),
  });

  return (
    <>
      <Typography align="center">
        Vul hieronder je emailadres in. We sturen dan binnen enkele minuten een
        e-mail waarmee je een nieuw wachtwoord kan aanmaken.
      </Typography>
      <Formik
        innerRef={formikRef}
        initialValues={{ ...initialFormState() }}
        validationSchema={formValidation}
        onSubmit={handleSubmitForm}
      >
        {({ isSubmitting, dirty }) => (
          <Form>
            <TextField
              showError={showError}
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Emailadres"
              name="email"
              autoComplete="email"
              autoFocus
            />
            <SubmitButton
              sx={{ margin: (theme: Theme) => theme.spacing(3, 0, 2) }}
              showInBottomBar={false}
              setShowError={setShowError}
              disabled={isSubmitting || !dirty}
              color="primary"
              variant="contained"
              fullWidth
            >
              Verzenden
            </SubmitButton>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default PasswordResetForm;
