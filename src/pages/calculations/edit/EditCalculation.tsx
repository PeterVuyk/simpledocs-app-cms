import React, { FC, useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import { connect } from 'react-redux';
import { Form, Formik, FormikHelpers, FormikValues } from 'formik';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import * as Yup from 'yup';
import PageHeading from '../../../layout/PageHeading';
import notification from '../../../redux/actions/notification';
import TextField from '../../../components/form/formik/TextField';
import FileDropZoneArea from '../../../components/form/formik/FileDropzoneArea';
import SubmitButton from '../../../components/form/formik/SubmitButton';
import Navigation from '../../navigation/Navigation';
import logger from '../../../helper/logger';
import calculationsRepository from '../../../firebase/database/calculationsRepository';
import { NotificationOptions } from '../../../model/NotificationOptions';
import { CalculationInfo } from '../../../model/CalculationInfo';
import { CalculationType } from '../../../model/CalculationType';
import ArticleEditor from '../../../components/form/formik/ArticleEditor';
import htmlFileHelper from '../../../helper/htmlFileHelper';

const useStyles = makeStyles((theme) => ({
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

interface Props {
  calculationType: CalculationType;
  setNotification: (notificationOptions: NotificationOptions) => void;
}

const EditCalculation: FC<Props> = ({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setNotification,
  calculationType,
}) => {
  const [calculationInfo, setCalculationInfo] =
    useState<CalculationInfo | null>(null);
  const [showError, setShowError] = useState<boolean>(false);
  const [submitButtonDisabled, setSubmitButtonDisabled] = useState(false);
  const formikRef = useRef<any>();
  const history = useHistory();
  const classes = useStyles();

  useEffect(() => {
    calculationsRepository.getCalculationsInfo().then((result) => {
      const calculation = result.filter(
        (value) => value.calculationType === calculationType
      );
      if (calculation.length !== 1) {
        setNotification({
          notificationType: 'error',
          notificationOpen: true,
          notificationMessage: 'Het openen van de wijzigingspagina is mislukt',
        });
        history.push('/calculations');
        return;
      }
      setCalculationInfo(calculation[0]);
    });
  }, [calculationType, history, setNotification]);

  const FORM_VALIDATION = Yup.object().shape({
    title: Yup.string().required('Titel is een verplicht veld.'),
    articleButtonText: Yup.string().required(
      'Regelgeving knop tekst is een verplicht veld.'
    ),
    listIndex: Yup.number()
      .integer()
      .required('Lijst index is een verplicht veld.')
      .positive(),
    explanation: Yup.string().required('Toelichting is een verplicht veld.'),
    htmlFile: Yup.mixed().required(
      'Het uploaden van een html bestand is verplicht.'
    ),
    iconFile: Yup.mixed().required(
      'Het uploaden van een illustratie is verplicht.'
    ),
    calculationImage: Yup.mixed().required(
      'Het uploaden van een afbeelding is verplicht.'
    ),
  });

  const handleSubmit = (
    values: FormikValues,
    formik: FormikHelpers<any>
  ): void => {
    formik.setSubmitting(false);
    throw calculationsRepository
      .updateCalculationsInfo({
        calculationType: calculationType.toString(),
        title: values.title,
        articleButtonText: values.articleButtonText,
        explanation: values.explanation,
        htmlFile: htmlFileHelper.addHTMLTagsToHTMLFile(values.htmlFile),
        iconFile: values.iconFile,
        calculationImage: values.calculationImage,
        listIndex: values.listIndex,
      })
      .then(() => history.push('/calculations'))
      .then(() =>
        setNotification({
          notificationType: 'success',
          notificationOpen: true,
          notificationMessage: 'De berekening pagina is gewijzigd.',
        })
      )
      .catch((error) => {
        logger.errorWithReason(
          'Edit stopping distance has failed in EditCalculation.handleSubmit',
          error
        );
        setSubmitButtonDisabled(false);
        setNotification({
          notificationType: 'error',
          notificationOpen: true,
          notificationMessage:
            'Het wijzigen is mislukt. Neem contact op met de beheerder.',
        });
      });
  };

  return (
    <Navigation gridWidth="wide">
      <PageHeading title="Pagina bewerken">
        <Button
          variant="contained"
          color="secondary"
          onClick={() => history.goBack()}
        >
          Terug
        </Button>
      </PageHeading>
      {calculationInfo && (
        <Formik
          innerRef={formikRef}
          initialValues={{ ...calculationInfo }}
          validationSchema={FORM_VALIDATION}
          onSubmit={handleSubmit}
        >
          <Form>
            <Grid
              container
              spacing={0}
              alignItems="flex-start"
              justify="flex-start"
              direction="row"
            >
              <Grid container item xs={12} sm={6} spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    showError={showError}
                    required
                    id="title"
                    label="Titel"
                    name="title"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    showError={showError}
                    required
                    id="articleButtonText"
                    label="Regelgeving knop tekst"
                    name="articleButtonText"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    showError={showError}
                    required
                    id="listIndex"
                    label="Lijst index"
                    name="listIndex"
                  />
                </Grid>
                <Grid item xs={12}>
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
                <Grid item xs={12}>
                  <FileDropZoneArea
                    enableHtmlPreview={false}
                    name="iconFile"
                    formik={formikRef}
                    showError={showError}
                    dropzoneText="Klik hier of sleep het svg illustratie bestand hierheen"
                    allowedMimeTypes={['image/svg+xml']}
                    initialFile={calculationInfo.iconFile}
                  />
                </Grid>
                <Grid item xs={12}>
                  <FileDropZoneArea
                    enableHtmlPreview={false}
                    name="calculationImage"
                    formik={formikRef}
                    showError={showError}
                    dropzoneText="Klik hier of sleep het jpg/jpeg afbeelding hierheen"
                    allowedMimeTypes={['image/jpeg']}
                    initialFile={calculationInfo.calculationImage}
                  />
                </Grid>
              </Grid>
              <Grid container item sm={6} spacing={0}>
                <Grid item xs={12} style={{ marginLeft: 18, marginRight: -18 }}>
                  <ArticleEditor
                    showError={showError}
                    formik={formikRef}
                    initialFile={calculationInfo.htmlFile}
                  />
                </Grid>
              </Grid>
            </Grid>
            <div className={classes.submit}>
              <SubmitButton
                submitButtonDisabled={submitButtonDisabled}
                setSubmitButtonDisabled={setSubmitButtonDisabled}
                setShowError={setShowError}
              >
                Wijzigen
              </SubmitButton>
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

export default connect(mapStateToProps, mapDispatchToProps)(EditCalculation);
