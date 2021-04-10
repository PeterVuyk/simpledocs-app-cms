import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { useHistory } from 'react-router-dom';
import * as Yup from 'yup';
import { Formik, Form, FormikValues } from 'formik';
import { makeStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import FileDropZoneArea from '../component/form/FileDropzoneArea';
import Layout from '../layout/Layout';
import TextField from '../component/form/TextField';
import Select from '../component/form/Select';
import SubmitButton from '../component/form/SubmitButton';
import regulationRepository, {
  Regulation,
} from '../firebase/database/regulationRepository';
import notification, {
  NotificationOptions,
} from '../redux/actions/notification';

const useStyles = makeStyles((theme) => ({
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

interface Props {
  setNotification: (notificationOptions: NotificationOptions) => void;
}

const CreateRegulation: React.FC<Props> = ({ setNotification }) => {
  const [showError, setShowError] = useState<boolean>(false);
  const formikRef = React.useRef<any>();
  const history = useHistory();
  const classes = useStyles();

  const INITIAL_FORM_STATE = {
    chapter: '',
    title: '',
    subTitle: '',
    pageIndex: '',
    level: '',
    htmlFile: '',
    iconFile: '',
    searchText: '',
  };

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
    return regulations.length === 0;
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
        'De opgegeven pagina index bestaat al en moet uniek zijn',
        async (chapter) => {
          return isFieldUnique('pageIndex', chapter);
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
    regulationRepository
      .createRegulation({
        pageIndex: values.pageIndex,
        chapter: values.chapter,
        level: values.level,
        title: values.title,
        subTitle: values.subTitle,
        searchText: values.searchText,
        htmlFile: values.htmlFile.data,
        iconFile: values.iconFile.data,
      })
      .then(() => history.push('/'))
      .then(() =>
        setNotification({
          notificationType: 'success',
          notificationOpen: true,
          notificationMessage: 'Pagina is toegevoegd.',
        })
      );
  };

  return (
    <Layout>
      <CssBaseline />
      <div style={{ overflow: 'hidden', marginTop: 10, marginBottom: 10 }}>
        <div style={{ float: 'left' }}>
          <Typography variant="h5">Pagina toevoegen</Typography>
        </div>
        <div style={{ float: 'right' }}>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => history.push('/')}
          >
            Terug
          </Button>
        </div>
      </div>
      <Formik
        innerRef={formikRef}
        initialValues={{ ...INITIAL_FORM_STATE }}
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
                name="htmlFile"
                formik={formikRef}
                showError={showError}
                dropzoneText="Klik hier of sleep het html template bestand hierheen"
                allowedMimeTypes={['text/html']}
                initialFile={null}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FileDropZoneArea
                name="iconFile"
                formik={formikRef}
                showError={showError}
                dropzoneText="Klik hier of sleep het png illustratie bestand hierheen"
                allowedMimeTypes={['image/png']}
                initialFile={null}
              />
            </Grid>
          </Grid>
          <div className={classes.submit}>
            <SubmitButton setShowError={setShowError}>Toevoegen</SubmitButton>
          </div>
        </Form>
      </Formik>
    </Layout>
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

export default connect(mapStateToProps, mapDispatchToProps)(CreateRegulation);
