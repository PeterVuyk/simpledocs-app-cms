import React, { FC, useRef, useState } from 'react';
import Grid from '@material-ui/core/Grid';
import * as Yup from 'yup';
import { Formik, Form, FormikValues, FormikHelpers, FastField } from 'formik';
import { makeStyles } from '@material-ui/core/styles';
// eslint-disable-next-line import/no-unresolved
import { FastFieldProps } from 'formik/dist/FastField';
import TextField from './formik/TextField';
import SubmitButton from './formik/SubmitButton';
import HtmlEditor from './formik/htmlEditor/HtmlEditor';
import { HtmlFileInfo } from '../../model/HtmlFileInfo';
import { HTML_FILE_CATEGORY_SNIPPET } from '../../model/HtmlFileCategory';

const useStyles = makeStyles((theme) => ({
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

interface Props {
  handleSubmit: (values: FormikValues) => void;
  htmlFileInfo: HtmlFileInfo;
  isNewHtmlFile: boolean;
}

const HtmlPageForm: FC<Props> = ({
  handleSubmit,
  htmlFileInfo,
  isNewHtmlFile,
}) => {
  const [showError, setShowError] = useState<boolean>(false);
  const formikRef = useRef<any>();
  const classes = useStyles();

  const handleSubmitForm = (
    values: FormikValues,
    formik: FormikHelpers<any>
  ) => {
    formik.setSubmitting(false);
    handleSubmit(values);
  };

  const initialFormState = () => {
    if (htmlFileInfo !== undefined) {
      return htmlFileInfo;
    }
    return {
      title: '',
      htmlFile: '',
    };
  };

  const formValidation = Yup.object().shape({
    title: Yup.string().required('Titel is een verplicht veld.'),
    htmlFile: Yup.string()
      .required('Het toevoegen van een html bestand is verplicht.')
      .test(
        'htmlFile',
        'De inhoud moet in een article-tag staan, de zoekfunctie van de app zoekt vervolgens alleen tussen deze tags: <article></article>',
        async (htmlFile) => {
          return (
            htmlFileInfo.htmlFileCategory === HTML_FILE_CATEGORY_SNIPPET ||
            (htmlFile !== undefined &&
              htmlFile.includes('<article>') &&
              htmlFile.includes('</article>'))
          );
        }
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
              <FastField name="htmlFile">
                {(props: FastFieldProps) => (
                  <HtmlEditor
                    meta={props.meta}
                    showError={showError}
                    formik={formikRef}
                    initialFile={htmlFileInfo?.htmlFile ?? null}
                  />
                )}
              </FastField>
            </Grid>
          </Grid>
          <div className={classes.submit}>
            <SubmitButton
              setShowError={setShowError}
              disabled={isSubmitting || !dirty}
            >
              {isNewHtmlFile ? 'Toevoegen' : 'Wijzigen'}
            </SubmitButton>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default HtmlPageForm;
