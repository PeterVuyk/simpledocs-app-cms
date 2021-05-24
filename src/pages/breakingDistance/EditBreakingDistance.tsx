import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import { connect } from 'react-redux';
import { Form, Formik, FormikValues } from 'formik';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import * as Yup from 'yup';
import PageHeading from '../../layout/PageHeading';
import notification, {
  NotificationOptions,
} from '../../redux/actions/notification';
import TextField from '../../components/form/formik/TextField';
import FileDropZoneArea from '../../components/form/formik/FileDropzoneArea';
import SubmitButton from '../../components/form/formik/SubmitButton';
import Navigation from '../Navigation';
import logger from '../../helper/logger';
import breakingDistanceRepository, {
  BreakingDistanceInfo,
} from '../../firebase/database/breakingDistanceRepository';

const useStyles = makeStyles((theme) => ({
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

interface Props {
  setNotification: (notificationOptions: NotificationOptions) => void;
}

const EditBreakingDistance: React.FC<Props> = ({ setNotification }) => {
  const [
    breakingDistanceInfo,
    setBreakingDistanceInfo,
  ] = React.useState<BreakingDistanceInfo | null>(null);
  const [showError, setShowError] = useState<boolean>(false);
  const formikRef = React.useRef<any>();
  const history = useHistory();
  const classes = useStyles();

  React.useEffect(() => {
    breakingDistanceRepository.getBreakingDistanceInfo().then((result) => {
      if (result.length !== 1) {
        history.push('/breaking-distance');
      }
      setBreakingDistanceInfo(result[0]);
    });
  }, [history]);

  const FORM_VALIDATION = Yup.object().shape({
    title: Yup.string().required('Titel is een verplicht veld.'),
    regulationButtonText: Yup.string().required(
      'Regelgeving knop tekst is een verplicht veld.'
    ),
    explanation: Yup.string().required('Toelichting is een verplicht veld.'),
    htmlFile: Yup.mixed().required(
      'Het uploaden van een html template is verplicht.'
    ),
    iconFile: Yup.mixed().required(
      'Het uploaden van een illustratie is verplicht.'
    ),
    breakingDistanceImage: Yup.mixed().required(
      'Het uploaden van een afbeelding is verplicht.'
    ),
  });

  const handleSubmit = (values: FormikValues): void => {
    throw breakingDistanceRepository
      .updateBreakingDistanceInfo({
        title: values.title,
        regulationButtonText: values.regulationButtonText,
        explanation: values.explanation,
        htmlFile: values.htmlFile,
        iconFile: values.iconFile,
        breakingDistanceImage: values.breakingDistanceImage,
      })
      .then(() => history.push('/breaking-distance'))
      .then(() =>
        setNotification({
          notificationType: 'success',
          notificationOpen: true,
          notificationMessage:
            'De tekst voor de remafstand pagina is gewijzigd.',
        })
      )
      .catch((error) => {
        logger.errorWithReason(
          'Edit breaking distance has failed in EditBreakingDistance.handleSubmit',
          error
        );
        setNotification({
          notificationType: 'error',
          notificationOpen: true,
          notificationMessage:
            'Het wijzigen van de remafstand pagina is mislukt. Neem contact op met de beheerder.',
        });
      });
  };

  return (
    <Navigation>
      <PageHeading title="Pagina bewerken">
        <Button
          variant="contained"
          color="secondary"
          onClick={() => history.push('/regulations')}
        >
          Terug
        </Button>
      </PageHeading>
      {breakingDistanceInfo && (
        <Formik
          innerRef={formikRef}
          initialValues={{ ...breakingDistanceInfo }}
          validationSchema={FORM_VALIDATION}
          onSubmit={handleSubmit}
        >
          <Form>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  showError={showError}
                  required
                  id="title"
                  label="Titel"
                  name="title"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  showError={showError}
                  required
                  id="regulationButtonText"
                  label="Regelgeving knop tekst"
                  name="regulationButtonText"
                />
              </Grid>
              <Grid item xs={12} sm={12}>
                <TextField
                  showError={showError}
                  multiline
                  rows={3}
                  rowsMax={8}
                  required
                  id="explanation"
                  label="Toelichting"
                  name="explanation"
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <FileDropZoneArea
                  enableHtmlPreview
                  name="htmlFile"
                  formik={formikRef}
                  showError={showError}
                  dropzoneText="Klik hier of sleep het template bestand hierheen"
                  allowedMimeTypes={['text/html']}
                  initialFile={breakingDistanceInfo.htmlFile}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <FileDropZoneArea
                  enableHtmlPreview={false}
                  name="iconFile"
                  formik={formikRef}
                  showError={showError}
                  dropzoneText="Klik hier of sleep het svg illustratie bestand hierheen"
                  allowedMimeTypes={['image/svg+xml']}
                  initialFile={breakingDistanceInfo.iconFile}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <FileDropZoneArea
                  enableHtmlPreview={false}
                  name="breakingDistanceImage"
                  formik={formikRef}
                  showError={showError}
                  dropzoneText="Klik hier of sleep het jpg/jpeg remafstand afbeelding hierheen"
                  allowedMimeTypes={['image/jpeg']}
                  initialFile={breakingDistanceInfo.breakingDistanceImage}
                />
              </Grid>
            </Grid>
            <div className={classes.submit}>
              <SubmitButton setShowError={setShowError}>Wijzigen</SubmitButton>
            </div>
          </Form>
        </Formik>
      )}
    </Navigation>
  );
};

const mapStateToProps = (state: any) => {
  return {
    notificationOptions: state.notification.notificationOptions,
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    setNotification: (notificationOptions: NotificationOptions) =>
      // eslint-disable-next-line import/no-named-as-default-member
      dispatch(notification.setNotification(notificationOptions)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EditBreakingDistance);
