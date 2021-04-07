import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { useHistory } from 'react-router-dom';
import * as Yup from 'yup';
import { Formik, Form } from 'formik';
import { makeStyles } from '@material-ui/core/styles';
import FileDropZoneArea from '../component/form/FileDropzoneArea';
import Layout from '../layout/Layout';
import TextField from '../component/form/TextField';
import Select from '../component/form/Select';
import SubmitButton from '../component/form/SubmitButton';

const useStyles = makeStyles((theme) => ({
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

function Dashboard(): JSX.Element {
  const [showError, setShowError] = useState<boolean>(false);
  const formikRef = React.useRef<any>();
  const history = useHistory();
  const classes = useStyles();

  const INITIAL_FORM_STATE = {
    chapter: '',
    title: '',
    subTitle: '',
    pageIndex: '',
    section: '',
    htmlFile: null,
    icon: null,
  };

  const FORM_VALIDATION = Yup.object().shape({
    chapter: Yup.string().required('Hoofdstuk is een verplicht veld.'),
    title: Yup.string().required('Titel is een verplicht veld.'),
    subTitle: Yup.string(),
    pageIndex: Yup.number()
      .integer()
      .required('Pagina index is een verplicht veld.'),
    section: Yup.string().required('Soort markering is een verplicht veld.'),
    htmlFile: Yup.mixed().required(
      'Het uploaden van een html bestand is verplicht veld.'
    ),
    icon: Yup.mixed().required(
      'Het uploaden van een illustratie is verplicht veld.'
    ),
  });

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
        onSubmit={(values) => console.log(values)}
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
                name="section"
                label="Soort markering"
                showError={showError}
                options={{
                  section: 'Hoofdstuk',
                  subSection: 'Paragraaf',
                  subSubSection: 'Subparagraaf',
                  attachments: 'Bijlage',
                  legislation: 'Wetgeving',
                }}
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
                name="icon"
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
}

export default Dashboard;
