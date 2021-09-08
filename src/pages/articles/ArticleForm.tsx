import React, { FC, useRef, useState } from 'react';
import Grid from '@material-ui/core/Grid';
import * as Yup from 'yup';
import { Formik, Form, FormikValues, FormikHelpers, FastField } from 'formik';
// eslint-disable-next-line import/no-unresolved
import { FastFieldProps } from 'formik/dist/FastField';
import FileDropZoneArea from '../../components/form/formik/FileDropzoneArea';
import TextField from '../../components/form/formik/TextField';
import Select from '../../components/form/formik/Select';
import SubmitButton from '../../components/form/formik/SubmitButton';
import articleRepository from '../../firebase/database/articleRepository';
import HtmlEditor from '../../components/form/formik/htmlEditor/HtmlEditor';
import { BookType } from '../../model/BookType';
import { Article } from '../../model/Article';
import SearchTextField from '../../components/form/formik/SearchTextField';

interface Props {
  onSubmit: (values: FormikValues) => void;
  article?: Article;
  bookType: BookType;
}

const ArticleForm: FC<Props> = ({ onSubmit, article, bookType }) => {
  const [showError, setShowError] = useState<boolean>(false);
  const formikRef = useRef<any>();

  const handleSubmitForm = (
    values: FormikValues,
    formik: FormikHelpers<any>
  ) => {
    formik.setSubmitting(false);
    onSubmit(values);
  };

  const initialFormState = () => {
    if (article !== undefined) {
      return article;
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
    const articles: Article[] = await articleRepository.getArticlesByField(
      bookType,
      fieldName,
      fieldValue
    );
    return (
      articles.length === 0 ||
      (article !== undefined &&
        articles.filter((value) => value.id !== article.id).length === 0)
    );
  }

  const formValidation = Yup.object().shape({
    chapter: Yup.string()
      .required('Hoofdstuk is een verplicht veld.')
      .test(
        'title',
        'De titel mag geen spaties of slash (/) bevatten.',
        async (title) => {
          if (title === undefined) {
            return true;
          }
          const includeInvalidChar = title.includes(' ') || title.includes('/');
          return !includeInvalidChar;
        }
      )
      .test(
        'chapter',
        'Het opgegeven hoofdstuk bestaat al en moet uniek zijn',
        async (chapter) => {
          const isEditFromDraft =
            article !== undefined &&
            article.isDraft &&
            article.chapter === chapter;
          return isEditFromDraft || isFieldUnique('chapter', chapter);
        }
      ),
    title: Yup.string().required('Titel is een verplicht veld.'),
    subTitle: Yup.string(),
    pageIndex: Yup.number()
      .integer()
      .positive()
      .required('Pagina index is een verplicht veld.')
      .test(
        'pageIndex',
        'Het opgegeven pagina index bestaat al en moet uniek zijn',
        async (index) => {
          const isEditFromDraft =
            article !== undefined &&
            article.isDraft &&
            article.pageIndex === index;
          return isEditFromDraft || isFieldUnique('pageIndex', index);
        }
      ),
    level: Yup.string().required('Soort markering is een verplicht veld.'),
    searchText: Yup.string().required('Zoektekst is een verplicht veld'),
    content: Yup.string()
      .required('Het toevoegen van een html bestand is verplicht.')
      .test(
        'htmlFile',
        'De inhoud van het artikel moet in een article-tag staan, de zoekfunctie van de app zoekt vervolgens alleen tussen deze tags: <article></article>',
        async (htmlFile) => {
          return (
            htmlFile !== undefined &&
            (htmlFile as string).includes('<article>') &&
            (htmlFile as string).includes('</article>')
          );
        }
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
      onSubmit={handleSubmitForm}
    >
      {({ isSubmitting, dirty }) => (
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
                <SearchTextField showError={showError} />
              </Grid>
              <Grid item xs={12}>
                <FileDropZoneArea
                  name="iconFile"
                  formik={formikRef}
                  showError={showError}
                  dropzoneText="Klik hier of sleep het svg illustratie bestand hierheen"
                  allowedMimeTypes={['image/svg+xml']}
                  initialFile={article?.iconFile ?? null}
                />
              </Grid>
            </Grid>
            <Grid container item sm={6} spacing={0}>
              <Grid item xs={12} style={{ marginLeft: 18, marginRight: -18 }}>
                <FastField name="htmlFile">
                  {(props: FastFieldProps) => (
                    <HtmlEditor
                      meta={props.meta}
                      showError={showError}
                      formik={formikRef}
                      initialFile={article?.content ?? null}
                    />
                  )}
                </FastField>
              </Grid>
            </Grid>
          </Grid>
          <SubmitButton
            setShowError={setShowError}
            disabled={isSubmitting || !dirty}
          >
            {article === undefined ? 'Toevoegen' : 'Wijzigen'}
          </SubmitButton>
        </Form>
      )}
    </Formik>
  );
};

export default ArticleForm;
