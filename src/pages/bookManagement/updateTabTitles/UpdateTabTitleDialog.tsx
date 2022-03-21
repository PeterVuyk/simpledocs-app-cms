import React, { FC, useRef, useState } from 'react';
import { Form, Formik, FormikValues } from 'formik';
import { Dialog } from '@material-ui/core';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import * as Yup from 'yup';
import { makeStyles } from '@material-ui/core/styles';
import { notify } from '../../../redux/slice/notificationSlice';
import logger from '../../../helper/logger';
import { useAppDispatch } from '../../../redux/hooks';
import useAppConfiguration from '../../../configuration/useAppConfiguration';
import clone from '../../../helper/object/clone';
import configurationRepository from '../../../firebase/database/configurationRepository';
import DialogTransition from '../../../components/dialog/DialogTransition';
import AlertBox from '../../../components/AlertBox';
import TextField from '../../../components/form/formik/TextField';
import SubmitButton from '../../../components/form/formik/SubmitButton';
import { BookTab } from '../../../model/configurations/BookTab';
import { DOCUMENTATION_UPDATE_TAB_TITLES } from '../../../model/DocumentationType';
import HelpAction from '../../../components/ItemAction/helpAction/HelpAction';

const useStyles = makeStyles((theme) => ({
  textFieldStyle: {
    marginBottom: theme.spacing(2),
  },
}));

interface Props {
  oncloseDialog: () => void;
  showTabTitleDialog: BookTab;
  onTabTranslation: (bookTab: string) => string;
}

const UpdateTabTitleDialog: FC<Props> = ({
  oncloseDialog,
  showTabTitleDialog,
  onTabTranslation,
}) => {
  const [showError, setShowError] = useState<boolean>(false);
  const formikRef = useRef<any>();
  const classes = useStyles();
  const dispatch = useAppDispatch();
  const { configuration } = useAppConfiguration();

  const handleSubmit = (values: FormikValues) => {
    const updatedConfiguration = clone(configuration);
    updatedConfiguration[showTabTitleDialog].title = values.title ?? '';
    updatedConfiguration[showTabTitleDialog].subTitle = values.subTitle ?? '';

    return configurationRepository
      .updateAppConfiguration(updatedConfiguration)
      .then(() => window.location.reload())
      .then(() =>
        dispatch(
          notify({
            notificationType: 'success',
            notificationOpen: true,
            notificationMessage: 'De tab titels zijn toegevoegd.',
          })
        )
      )
      .then(oncloseDialog)
      .catch((error) => {
        logger.errorWithReason(
          'Failed updating the tab title in UpdateTabTitleDialog.handleSubmitForm',
          error
        );
        dispatch(
          notify({
            notificationType: 'error',
            notificationOpen: true,
            notificationMessage: `Het wijzigen van de tab titel is mislukt.`,
          })
        );
      });
  };

  const initialFormState = () => {
    return {
      title: configuration[showTabTitleDialog].title ?? '',
      subTitle: configuration[showTabTitleDialog].subTitle ?? '',
    };
  };

  const formValidation = Yup.object().shape({
    title: Yup.string(),
    subTitle: Yup.string(),
  });

  return (
    <Formik
      innerRef={formikRef}
      initialValues={{ ...initialFormState() }}
      validationSchema={formValidation}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting, dirty }) => (
        <Dialog
          open
          TransitionComponent={DialogTransition}
          keepMounted
          onClose={() => !isSubmitting && oncloseDialog()}
        >
          <DialogTitle id="alert-dialog-slide-title">
            {onTabTranslation(showTabTitleDialog)} titel wijzigen&ensp;
            <HelpAction documentationType={DOCUMENTATION_UPDATE_TAB_TITLES} />
          </DialogTitle>
          <Form>
            <DialogContent>
              <DialogContentText
                style={{ whiteSpace: 'pre-line' }}
                id="description"
              >
                Wijzig hier de boekgegevens. Let hierbij op dat de gedane
                wijzigingen na bewerking gelijk doorgevoerd wordt.
              </DialogContentText>
              {isSubmitting && (
                <AlertBox severity="info" message="Een moment geduld..." />
              )}
              <TextField
                className={classes.textFieldStyle}
                showError={showError}
                autoFocus
                id="title"
                label="Titel"
                name="title"
              />
              <TextField
                className={classes.textFieldStyle}
                showError={showError}
                multiline
                minRows={3}
                maxRows={3}
                id="subTitle"
                label="Subtitel"
                name="subTitle"
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

export default UpdateTabTitleDialog;
