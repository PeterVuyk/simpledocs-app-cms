import React, { useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import { connect } from 'react-redux';
import { Form, Formik, FormikValues } from 'formik';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import * as Yup from 'yup';
import regulationRepository, {
  Regulation,
} from '../../firebase/database/regulationRepository';
import PageHeading from '../../layout/PageHeading';
import notification, {
  NotificationOptions,
} from '../../redux/actions/notification';
import TextField from '../../components/form/formik/TextField';
import Select from '../../components/form/formik/Select';
import FileDropZoneArea from '../../components/form/formik/FileDropzoneArea';
import SubmitButton from '../../components/form/formik/SubmitButton';
import Navigation from '../Navigation';
import logger from '../../helper/logger';

const useStyles = makeStyles((theme) => ({
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

interface Props {
  setNotification: (notificationOptions: NotificationOptions) => void;
}

const EditRegulation: React.FC<Props> = ({ setNotification }) => {
  const [regulation, setRegulation] = React.useState<Regulation | null>(null);
  const [showError, setShowError] = useState<boolean>(false);
  const formikRef = React.useRef<any>();
  const history = useHistory();
  const { regulationId } = useParams<{ regulationId: string }>();
  const classes = useStyles();

  React.useEffect(() => {
    regulationRepository
      .getRegulationsById(regulationId)
      .then((result) => setRegulation(result));
  }, [regulationId]);

  async function isFieldUnique(
    fieldName: string,
    fieldValue: any
  ): Promise<boolean> {
    if (fieldValue === undefined) {
      return true;
    }
    const regulations: Regulation[] = await regulationRepository.getRegulationsByField(
      fieldName,
      fieldValue
    );
    return (
      regulations.length === 0 ||
      regulations.filter((value) => value.id !== regulation?.id).length === 0
    );
  }

  const FORM_VALIDATION = Yup.object().shape({
    chapter: Yup.string()
      .required('Hoofdstuk is een verplicht veld.')
      .test(
        'chapter',
        'Het opgegeven hoofdstuk bestaat al en moet uniek zijn',
        async (chapter) => {
          return isFieldUnique('chapter', chapter);
        }
      ),
    title: Yup.string().required('Titel is een verplicht veld.'),
    subTitle: Yup.string(),
    pageIndex: Yup.number()
      .integer()
      .required('Pagina index is een verplicht veld.')
      .test(
        'pageIndex',
        'Het opgegeven pagina index bestaat al en moet uniek zijn',
        async (index) => {
          return isFieldUnique('pageIndex', index);
        }
      ),
    level: Yup.string().required('Soort markering is een verplicht veld.'),
    searchText: Yup.string().required('Zoektekst is een verplicht veld'),
    htmlFile: Yup.mixed().required(
      'Het uploaden van een html bestand is verplicht.'
    ),
    iconFile: Yup.mixed().required(
      'Het uploaden van een illustratie is verplicht.'
    ),
  });

  const handleSubmit = (values: FormikValues): void => {
    throw regulationRepository
      .updateRegulation({
        id: regulation?.id,
        pageIndex: values.pageIndex,
        chapter: values.chapter,
        level: values.level,
        title: values.title,
        subTitle: values.subTitle,
        searchText: values.searchText,
        htmlFile: values.htmlFile,
        iconFile: values.iconFile,
      })
      .then(() => history.push('/regulations'))
      .then(() =>
        setNotification({
          notificationType: 'success',
          notificationOpen: true,
          notificationMessage: 'Pagina is gewijzigd.',
        })
      )
      .catch((error) => {
        logger.errorWithReason(
          'Edit regulation has failed in EditRegulation.handleSubmit',
          error
        );
        setNotification({
          notificationType: 'error',
          notificationOpen: true,
          notificationMessage: `Het wijzigen van de regulatie is mislukt, foutmelding: ${error.message}.`,
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
      {regulation && (
        <Formik
          innerRef={formikRef}
          initialValues={{ ...regulation }}
          validationSchema={FORM_VALIDATION}
          onSubmit={handleSubmit}
        >
          <Form>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <TextField
                  required
                  showError={showError}
                  id="chapter"
                  label="Hoofdstuk"
                  name="chapter"
                  autoFocus
                />
              </Grid>
              <Grid item xs={12} sm={8}>
                <TextField
                  showError={showError}
                  required
                  id="title"
                  label="Titel"
                  name="title"
                />
              </Grid>
              <Grid item xs={12} sm={12}>
                <TextField
                  id="subTitle"
                  showError={showError}
                  label="Subtitel"
                  name="subTitle"
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  type="number"
                  showError={showError}
                  InputProps={{ inputProps: { min: 0 } }}
                  required
                  id="pageIndex"
                  label="Pagina index"
                  name="pageIndex"
                />
              </Grid>
              <Grid item xs={12} sm={8}>
                <Select
                  name="level"
                  label="Soort markering"
                  showError={showError}
                  options={{
                    chapter: 'Hoofdstuk',
                    section: 'Paragraaf',
                    subSection: 'Subparagraaf',
                    subSubSection: 'Sub-subparagraaf',
                    subHead: 'Tussenkop',
                    attachment: 'Bijlage',
                    legislation: 'Wetgeving',
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={12}>
                <TextField
                  showError={showError}
                  multiline
                  rows={3}
                  rowsMax={8}
                  required
                  id="searchText"
                  label="Zoektekst"
                  name="searchText"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FileDropZoneArea
                  enableHtmlPreview
                  name="htmlFile"
                  formik={formikRef}
                  showError={showError}
                  dropzoneText="Klik hier of sleep het html template bestand hierheen"
                  allowedMimeTypes={['text/html']}
                  initialFile={regulation?.htmlFile ?? null}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FileDropZoneArea
                  enableHtmlPreview={false}
                  name="iconFile"
                  formik={formikRef}
                  showError={showError}
                  dropzoneText="Klik hier of sleep het svg illustratie bestand hierheen"
                  allowedMimeTypes={['image/svg+xml']}
                  initialFile={regulation?.iconFile ?? null}
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

export default connect(mapStateToProps, mapDispatchToProps)(EditRegulation);
