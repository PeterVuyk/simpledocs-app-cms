import React, { FC, useRef, useState } from 'react';
import Grid from '@material-ui/core/Grid';
import * as Yup from 'yup';
import { Formik, Form, FormikValues } from 'formik';
import { makeStyles } from '@material-ui/core/styles';
import TextField from './formik/TextField';
import SubmitButton from './formik/SubmitButton';
import { Artifact } from '../../model/artifacts/Artifact';
import {
  CONTENT_TYPE_HTML,
  CONTENT_TYPE_MARKDOWN,
  ContentType,
} from '../../model/ContentType';
import ContentEditor from '../content/ContentEditor';
import ContentTypeToggle from '../content/ContentTypeToggle';
import validateYupMarkdownContent from './formik/validators/validateYupMarkdownContent';
import validateYupHtmlContent from './formik/validators/validateYupHtmlContent';
import LoadingSpinner from '../LoadingSpinner';

const useStyles = makeStyles((theme) => ({
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

interface Props {
  contentTypeToggle: ContentType;
  setContentTypeToggle: (contentType: ContentType | undefined) => void;
  onSubmit: (values: FormikValues) => void;
  artifact: Artifact;
  isNewFile: boolean;
}

const ContentPageForm: FC<Props> = ({
  contentTypeToggle,
  setContentTypeToggle,
  onSubmit,
  artifact,
  isNewFile,
}) => {
  const [showError, setShowError] = useState<boolean>(false);
  const formikRef = useRef<any>();
  const classes = useStyles();

  const handleSubmitForm = (values: FormikValues) => {
    onSubmit(values);
  };

  const initialFormState = () => {
    if (artifact !== undefined) {
      return {
        title: artifact.title,
        content: artifact.content,
        contentType: artifact.contentType,
      };
    }
    return {
      title: '',
      content: '',
      contentType: contentTypeToggle,
    };
  };

  const formValidation = Yup.object().shape({
    title: Yup.string().required('Titel is een verplicht veld.'),
    markdownContent: validateYupMarkdownContent(contentTypeToggle),
    htmlContent: validateYupHtmlContent(contentTypeToggle),
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
            justifyContent="flex-start"
            direction="row"
          >
            <Grid item xs={6}>
              <TextField
                disabled={isSubmitting}
                showError={showError}
                required
                id="title"
                label="Titel"
                name="title"
              />
            </Grid>
            {isSubmitting && <LoadingSpinner showInBlock />}
            {!isSubmitting && (
              <>
                <Grid item xs={6}>
                  <ContentTypeToggle
                    contentType={contentTypeToggle}
                    setContentTypeToggle={setContentTypeToggle}
                    allowedContentTypes={[
                      CONTENT_TYPE_HTML,
                      CONTENT_TYPE_MARKDOWN,
                    ]}
                  />
                </Grid>
                <Grid item xs={12}>
                  <ContentEditor
                    contentTypeToggle={contentTypeToggle}
                    showError={showError}
                    formik={formikRef}
                    initialContentType={artifact?.contentType}
                    initialContent={artifact?.content ?? null}
                    allowedContentTypes={[
                      CONTENT_TYPE_HTML,
                      CONTENT_TYPE_MARKDOWN,
                    ]}
                  />
                </Grid>
              </>
            )}
          </Grid>
          <div className={classes.submit}>
            <SubmitButton
              showInBottomBar
              setShowError={setShowError}
              disabled={isSubmitting || !dirty}
            >
              {isNewFile ? 'Toevoegen' : 'Wijzigen'}
            </SubmitButton>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default ContentPageForm;
