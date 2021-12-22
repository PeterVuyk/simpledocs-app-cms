import React, { FC, useRef, useState } from 'react';
import Grid from '@material-ui/core/Grid';
import * as Yup from 'yup';
import { Formik, Form, FormikValues } from 'formik';
import FileDropZoneArea from '../../components/form/formik/FileDropzoneArea';
import TextField from '../../components/form/formik/TextField';
import Select from '../../components/form/formik/Select';
import SubmitButton from '../../components/form/formik/SubmitButton';
import { Page } from '../../model/Page';
import ContentEditor from '../../components/content/ContentEditor';
import ContentTypeToggle from '../../components/content/ContentTypeToggle';
import useContentTypeToggle from '../../components/content/useContentTypeToggle';
import { ContentType } from '../../model/artifacts/Artifact';
import validateYupMarkdownContent from '../../components/form/formik/validators/validateYupMarkdownContent';
import validateYupHtmlContent from '../../components/form/formik/validators/validateYupHtmlContent';
import useAppConfiguration from '../../configuration/useAppConfiguration';
import validateBookChapter from '../../components/form/formik/validators/validateBookChapter';
import validatePageIndex from '../../components/form/formik/validators/validatePageIndex';

interface Props {
  onSubmit: (values: FormikValues, contentType: ContentType) => Promise<void>;
  page?: Page;
  bookType: string;
}

const BookPageForm: FC<Props> = ({ onSubmit, page, bookType }) => {
  const [contentTypeToggle, setContentTypeToggle] = useContentTypeToggle(
    page?.contentType
  );
  const [showError, setShowError] = useState<boolean>(false);
  const formikRef = useRef<any>();
  const { getPageHierarchy } = useAppConfiguration();

  const handleSubmitForm = (values: FormikValues) => {
    return onSubmit(values, contentTypeToggle);
  };

  const initialFormState = () => {
    if (page !== undefined) {
      return page;
    }
    return {
      chapter: '',
      title: '',
      subTitle: '',
      pageIndex: '',
      chapterDivision: '',
      markdownContent: '',
      htmlContent: '',
      iconFile: '',
      searchText: '',
    };
  };

  const formValidation = Yup.object().shape({
    chapter: validateBookChapter(page, bookType),
    title: Yup.string().required('Titel is een verplicht veld.'),
    subTitle: Yup.string(),
    pageIndex: validatePageIndex(page, bookType),
    chapterDivision: Yup.string().required(
      'Hoofdstukindeling is een verplicht veld.'
    ),
    // searchText: Yup.string().required('Zoektekst is een verplicht veld'),
    markdownContent: validateYupMarkdownContent(contentTypeToggle),
    htmlContent: validateYupHtmlContent(contentTypeToggle),
    iconFile: Yup.mixed().required(
      'Het uploaden van een illustratie is verplicht.'
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
            spacing={0}
            alignItems="flex-start"
            justifyContent="flex-start"
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
                  minRows={3}
                  maxRows={3}
                  showError={showError}
                  label="Subtitel"
                  name="subTitle"
                />
              </Grid>
              <Grid item xs={12}>
                <Select
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
              {/* <Grid item xs={12}> */}
              {/*  <SearchTextField */}
              {/*    showError={showError} */}
              {/*    contentTypeToggle={contentTypeToggle} */}
              {/*  /> */}
              {/* </Grid> */}
              <Grid item xs={12}>
                <FileDropZoneArea
                  name="iconFile"
                  formik={formikRef}
                  showError={showError}
                  dropzoneText="Klik hier of sleep het svg illustratie bestand hierheen"
                  allowedMimeTypes={['image/svg+xml']}
                  initialFile={page?.iconFile ?? null}
                />
              </Grid>
            </Grid>
            <Grid container item sm={6} spacing={0}>
              <Grid item xs={12} style={{ marginLeft: 18, marginRight: -18 }}>
                <ContentTypeToggle
                  contentType={contentTypeToggle}
                  setContentTypeToggle={setContentTypeToggle}
                />
                <ContentEditor
                  contentTypeToggle={contentTypeToggle}
                  showError={showError}
                  formik={formikRef}
                  initialFileType={page?.contentType}
                  initialFile={page?.content ?? null}
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
