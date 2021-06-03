import React, { useState } from 'react';
import Grid from '@material-ui/core/Grid';
import * as Yup from 'yup';
import { Formik, Form, FormikValues } from 'formik';
import { makeStyles } from '@material-ui/core/styles';
import FileDropZoneArea from '../../components/form/formik/FileDropzoneArea';
import TextField from '../../components/form/formik/TextField';
import Select from '../../components/form/formik/Select';
import SubmitButton from '../../components/form/formik/SubmitButton';
import regulationRepository, {
  Regulation,
} from '../../firebase/database/regulationRepository';
import RegulationEditor from '../../components/form/formik/RegulationEditor';

const useStyles = makeStyles((theme) => ({
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

interface Props {
  handleSubmit: (values: FormikValues) => void;
  regulation?: Regulation;
}

const RegulationForm: React.FC<Props> = ({ handleSubmit, regulation }) => {
  const [showError, setShowError] = useState<boolean>(false);
  const formikRef = React.useRef<any>();
  const classes = useStyles();

  const initialFormState = () => {
    if (regulation !== undefined) {
      return regulation;
    }
    return {
      chapter: '',
      title: '',
      subTitle: '',
      pageIndex: '',
      level: '',
      htmlFile: '',
      iconFile: '',
      searchText: '',
    };
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
    return (
      regulations.length === 0 ||
      (regulation !== undefined &&
        regulations.filter((value) => value.id !== regulation.id).length === 0)
    );
  }

  const formValidation = Yup.object().shape({
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
      'Het toevoegen van een html bestand is verplicht.'
    ),
    iconFile: Yup.mixed().required(
      'Het uploaden van een illustratie is verplicht.'
    ),
  });

  return (
    <Formik
      innerRef={formikRef}
      initialValues={{ ...initialFormState() }}
      validationSchema={formValidation}
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
            <Grid item xs={12} sm={6}>
              <TextField
                required
                showError={showError}
                id="chapter"
                label="Hoofdstuk"
                name="chapter"
                autoFocus
              />
            </Grid>
            <Grid item xs={12} sm={6}>
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
                id="subTitle"
                multiline
                rows={3}
                rowsMax={3}
                showError={showError}
                label="Subtitel"
                name="subTitle"
              />
            </Grid>
            <Grid item xs={12}>
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
            <Grid item xs={12}>
              <TextField
                showError={showError}
                multiline
                rows={5}
                rowsMax={12}
                required
                id="searchText"
                label="Zoektekst"
                name="searchText"
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
                initialFile={regulation?.iconFile ?? null}
              />
            </Grid>
          </Grid>
          <Grid container item sm={6} spacing={0}>
            <Grid item xs={12} style={{ marginLeft: 18 }}>
              {/* TODO: Is die margin nog nodig? */}
              <RegulationEditor
                showError={showError}
                formik={formikRef}
                initialFile={regulation?.htmlFile ?? null}
              />
            </Grid>
          </Grid>
        </Grid>
        <div className={classes.submit} style={{ marginRight: 18 }}>
          <SubmitButton setShowError={setShowError}>
            {regulation === undefined ? 'Toevoegen' : 'Wijzigen'}
          </SubmitButton>
        </div>
      </Form>
    </Formik>
  );
};

export default RegulationForm;
