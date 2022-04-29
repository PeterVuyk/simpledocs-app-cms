import React, { FC, useRef, useState } from 'react';
import Grid from '@mui/material/Grid';
import * as Yup from 'yup';
import { Formik, Form, FormikValues, Field } from 'formik';
import { FastFieldProps } from 'formik/dist/FastField';
import TextField from '../../components/form/formik/TextField';
import Select from '../../components/form/formik/Select';
import SubmitButton from '../../components/form/formik/SubmitButton';
import { Page } from '../../model/Page';
import ContentEditor from '../../components/content/ContentEditor';
import ContentTypeToggle from '../../components/content/ContentTypeToggle';
import useContentTypeToggle from '../../components/content/useContentTypeToggle';
import {
  CONTENT_TYPE_CALCULATIONS,
  CONTENT_TYPE_DECISION_TREE,
  CONTENT_TYPE_HTML,
  CONTENT_TYPE_MARKDOWN,
  ContentType,
} from '../../model/ContentType';
import validateYupMarkdownContent from '../../components/form/formik/validators/validateYupMarkdownContent';
import validateYupHtmlContent from '../../components/form/formik/validators/validateYupHtmlContent';
import useAppConfiguration from '../../configuration/useAppConfiguration';
import validateBookChapter from '../../components/form/formik/validators/validateBookChapter';
import validateYupDecisionTreeContent from '../../components/form/formik/validators/validateYupDecisionTreeContent';
import validateYupCalculationsContent from '../../components/form/formik/validators/validateYupCalculationsContent';
import useCmsConfiguration from '../../configuration/useCmsConfiguration';
import {
  AGGREGATE_CALCULATIONS,
  AGGREGATE_DECISION_TREE,
} from '../../model/Aggregate';
import SvgIllustrationSelector from '../../components/form/formik/svgIllustration/SvgIllustrationSelector';

interface Props {
  onSubmit: (
    values: FormikValues,
    contentType: ContentType,
    pageIndex: number
  ) => Promise<void>;
  page?: Page;
  bookType: string;
}

const BookPageForm: FC<Props> = ({ onSubmit, page, bookType }) => {
  const { isMenuItem } = useCmsConfiguration();
  const [contentTypeToggle, setContentTypeToggle] = useContentTypeToggle(
    page?.contentType
  );
  const [showError, setShowError] = useState<boolean>(false);
  const formikRef = useRef<any>();
  const { getPageHierarchy } = useAppConfiguration();

  const handleSubmitForm = (values: FormikValues) => {
    return onSubmit(values, contentTypeToggle, page?.pageIndex ?? -Date.now());
  };

  const initialFormState = () => {
    if (page !== undefined) {
      // To avoid the warning that the input value for decisionTreeContent and
      // calculationsContent is uncontrolled we have to set it to an empty string.
      // This because we always save the content and 'decisionTreeContent' is missing from the 'page'.
      return { decisionTreeContent: '', calculationsContent: '', ...page };
    }
    return {
      chapter: '',
      title: '',
      subTitle: '',
      chapterDivision: '',
      markdownContent: '',
      decisionTreeContent: '',
      calculationsContent: '',
      htmlContent: '',
      iconFile: '',
      searchText: '',
    };
  };

  const formValidation = Yup.object().shape({
    chapter: validateBookChapter(page, bookType),
    title: Yup.string().required('Titel is een verplicht veld.'),
    subTitle: Yup.string(),
    chapterDivision: Yup.string().required(
      'Hoofdstukindeling is een verplicht veld.'
    ),
    markdownContent: validateYupMarkdownContent(contentTypeToggle),
    htmlContent: validateYupHtmlContent(contentTypeToggle),
    decisionTreeContent: validateYupDecisionTreeContent(contentTypeToggle),
    calculationsContent: validateYupCalculationsContent(contentTypeToggle),
    iconFile: Yup.mixed().required(
      'Het kiezen van een illustratie is verplicht.'
    ),
  });

  const getAllowedContent = (): ContentType[] => {
    const contentTypes = [
      CONTENT_TYPE_HTML,
      CONTENT_TYPE_MARKDOWN,
    ] as ContentType[];
    if (isMenuItem(AGGREGATE_CALCULATIONS)) {
      contentTypes.push(CONTENT_TYPE_CALCULATIONS);
    }
    if (isMenuItem(AGGREGATE_DECISION_TREE)) {
      contentTypes.push(CONTENT_TYPE_DECISION_TREE);
    }
    return contentTypes;
  };

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
            spacing={0}
            alignItems="flex-start"
            justifyContent="flex-start"
            direction="row"
          >
            <Grid container item xs={12} sm={5} spacing={2}>
              <Grid item xs={12}>
                <TextField
                  disabled={isSubmitting}
                  showError={showError}
                  required
                  multiline
                  minRows={1}
                  maxRows={3}
                  id="title"
                  label="Titel"
                  name="title"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  disabled={isSubmitting}
                  showError={showError}
                  id="chapter"
                  label="Hoofdstuk"
                  name="chapter"
                  autoFocus
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  disabled={isSubmitting}
                  id="subTitle"
                  multiline
                  minRows={3}
                  maxRows={3}
                  showError={showError}
                  label="Subtitel"
                  name="subTitle"
                />
              </Grid>
              <Grid item xs={12}>
                <Select
                  disabled={isSubmitting}
                  required
                  name="chapterDivision"
                  label="Hoofdstukindeling"
                  showError={showError}
                  options={{
                    chapter: `Hoofdstuk ${getPageHierarchy(
                      bookType,
                      'chapter'
                    )}`,
                    section: `Paragraaf ${getPageHierarchy(
                      bookType,
                      'section'
                    )}`,
                    subSection: `Subparagraaf ${getPageHierarchy(
                      bookType,
                      'subSection'
                    )}`,
                    subSubSection: `Sub-subparagraaf ${getPageHierarchy(
                      bookType,
                      'subSubSection'
                    )}`,
                    subHead: `Tussenkop ${getPageHierarchy(
                      bookType,
                      'subHead'
                    )}`,
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <Field name="iconFile">
                  {(props: FastFieldProps) => (
                    <SvgIllustrationSelector
                      meta={props.meta}
                      formik={formikRef}
                      page={page}
                      isSubmitting={isSubmitting}
                      showError={showError}
                    />
                  )}
                </Field>
              </Grid>
            </Grid>
            <Grid container item sm={7} spacing={0}>
              <Grid item xs={12} style={{ marginLeft: 18 }}>
                <ContentTypeToggle
                  isSubmitting={isSubmitting}
                  contentType={contentTypeToggle}
                  setContentTypeToggle={setContentTypeToggle}
                  allowedContentTypes={getAllowedContent()}
                />
                <ContentEditor
                  isSubmitting={isSubmitting}
                  contentTypeToggle={contentTypeToggle}
                  showError={showError}
                  formik={formikRef}
                  initialContentType={page?.contentType}
                  initialContent={page?.content ?? null}
                  allowedContentTypes={getAllowedContent()}
                />
              </Grid>
            </Grid>
          </Grid>
          <SubmitButton
            showInBottomBar
            setShowError={setShowError}
            disabled={isSubmitting || !dirty}
          >
            {page === undefined ? 'Toevoegen' : 'Wijzigen'}
          </SubmitButton>
        </Form>
      )}
    </Formik>
  );
};

export default BookPageForm;
