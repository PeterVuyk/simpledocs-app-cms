import React, { FC, useRef, useState } from 'react';
import * as Yup from 'yup';
import { Form, Formik, FormikValues } from 'formik';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@material-ui/core';
import { ContentType } from '../../../../../../model/artifacts/Artifact';
import SelectLinkBookPage from '../../../SelectLinkBookPage';
import LinkCodeBlockView from './LinkCodeBlockView';
import { LinkInfo } from '../../../../../../model/LinkInfo';
import DialogTransition from '../../../../../dialog/DialogTransition';
import AlertBox from '../../../../../AlertBox';
import SubmitButton from '../../../SubmitButton';

interface Props {
  contentType: ContentType;
  onCloseDialog: () => void;
}

const CreateLinkPageDialog: FC<Props> = ({ onCloseDialog, contentType }) => {
  const [submitted, setSubmitted] = useState<LinkInfo | null>(null);
  const formikRef = useRef<any>();
  const [showError, setShowError] = useState<boolean>(false);

  const handleSubmitForm = (values: FormikValues) => {
    setSubmitted(values as LinkInfo);
  };

  const initialFormState = () => {
    return {
      bookType: '',
      bookPageId: '',
      linkText: '',
    };
  };

  const formValidation = Yup.object().shape({
    bookType: Yup.string().required('Geef een boek op'),
    bookPageId: Yup.string().required(
      'Geef een pagina op waar je naar wilt refereren'
    ),
    linkText: Yup.string().required(
      'Geef de tekst op die je in de link wilt tonen'
    ),
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
          onClose={() =>
            (submitted === null && !isSubmitting && onCloseDialog()) ||
            (submitted !== null && onCloseDialog())
          }
        >
          <DialogTitle id="alert-dialog-slide-title">
            Link naar pagina maken
          </DialogTitle>
          {!submitted && (
            <Form>
              <DialogContent>
                <DialogContentText
                  style={{ whiteSpace: 'pre-line' }}
                  id="description"
                >
                  Kies het boek en bijbehorende hoofdstuk en klik op link maken.
                </DialogContentText>
                {isSubmitting && (
                  <AlertBox severity="info" message="Een moment geduld..." />
                )}
                <SelectLinkBookPage
                  required
                  formik={formikRef}
                  showError={showError}
                  showAltTextField
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
                  Link maken
                </SubmitButton>
              </DialogActions>
            </Form>
          )}
          {submitted && (
            <LinkCodeBlockView
              contentType={contentType}
              onCloseDialog={onCloseDialog}
              linkInfo={submitted}
            />
          )}
        </Dialog>
      )}
    </Formik>
  );
};

export default CreateLinkPageDialog;
