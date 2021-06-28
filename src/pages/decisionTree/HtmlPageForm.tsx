import React, { FC, useRef, useState } from 'react';
import Grid from '@material-ui/core/Grid';
import * as Yup from 'yup';
import { Formik, Form, FormikValues } from 'formik';
import { makeStyles } from '@material-ui/core/styles';
import { Paper } from '@material-ui/core';
import TextField from '../../components/form/formik/TextField';
import SubmitButton from '../../components/form/formik/SubmitButton';
import ArticleEditor from '../../components/form/formik/ArticleEditor';
import { DecisionTreeHtmlFile } from '../../model/DecisionTreeHtmlFile';

const useStyles = makeStyles((theme) => ({
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

interface Props {
  handleSubmit: (values: FormikValues) => void;
  decisionTreeHtmlFile: DecisionTreeHtmlFile;
  isNewHtmlFile: boolean;
}

const HtmlPageForm: FC<Props> = ({
  handleSubmit,
  decisionTreeHtmlFile,
  isNewHtmlFile,
}) => {
  const [showError, setShowError] = useState<boolean>(false);
  const formikRef = useRef<any>();
  const classes = useStyles();

  const initialFormState = () => {
    if (decisionTreeHtmlFile !== undefined) {
      return decisionTreeHtmlFile;
    }
    return {
      title: '',
      htmlFile: '',
    };
  };

  const formValidation = Yup.object().shape({
    title: Yup.string().required('Titel is een verplicht veld.'),
    htmlFile: Yup.mixed().required(
      'Het toevoegen van een html bestand is verplicht.'
    ),
  });

  return (
    <Paper elevation={0} color="#ddd" style={{ marginRight: 18 }}>
      <Formik
        innerRef={formikRef}
        initialValues={{ ...initialFormState() }}
        validationSchema={formValidation}
        onSubmit={handleSubmit}
      >
        <Form>
          <Grid
            container
            spacing={2}
            alignItems="flex-start"
            justify="flex-start"
            direction="row"
          >
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
              <ArticleEditor
                showError={showError}
                formik={formikRef}
                initialFile={decisionTreeHtmlFile?.htmlFile ?? null}
              />
            </Grid>
          </Grid>
          <div className={classes.submit}>
            <SubmitButton setShowError={setShowError}>
              {isNewHtmlFile ? 'Toevoegen' : 'Wijzigen'}
            </SubmitButton>
          </div>
        </Form>
      </Formik>
    </Paper>
  );
};

export default HtmlPageForm;
