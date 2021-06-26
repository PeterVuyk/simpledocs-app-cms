import React, { FC, useRef, useState } from 'react';
import Grid from '@material-ui/core/Grid';
import * as Yup from 'yup';
import { Formik, Form, FormikValues } from 'formik';
import { makeStyles } from '@material-ui/core/styles';
import { Paper } from '@material-ui/core';
import FileDropZoneArea from '../../components/form/formik/FileDropzoneArea';
import TextField from '../../components/form/formik/TextField';
import Select from '../../components/form/formik/Select';
import SubmitButton from '../../components/form/formik/SubmitButton';
import articleRepository from '../../firebase/database/articleRepository';
import ArticleEditor from '../../components/form/formik/ArticleEditor';
import { ArticleType } from '../../model/ArticleType';
import { Article } from '../../model/Article';

const useStyles = makeStyles((theme) => ({
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

interface Props {
  handleSubmit: (values: FormikValues) => void;
  article?: Article;
  articleType: ArticleType;
}

const ArticleForm: FC<Props> = ({ handleSubmit, article, articleType }) => {
  const [showError, setShowError] = useState<boolean>(false);
  const formikRef = useRef<any>();
  const classes = useStyles();

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
      articleType,
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
    htmlFile: Yup.mixed().required(
      'Het toevoegen van een html bestand is verplicht.'
    ),
    iconFile: Yup.mixed().required(
      'Het uploaden van een illustratie is verplicht.'
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
                  initialFile={article?.iconFile ?? null}
                />
              </Grid>
            </Grid>
            <Grid container item sm={6} spacing={0}>
              <Grid item xs={12} style={{ marginLeft: 18, marginRight: -18 }}>
                <ArticleEditor
                  showError={showError}
                  formik={formikRef}
                  initialFile={article?.htmlFile ?? null}
                />
              </Grid>
            </Grid>
          </Grid>
          <div className={classes.submit}>
            <SubmitButton setShowError={setShowError}>
              {article === undefined ? 'Toevoegen' : 'Wijzigen'}
            </SubmitButton>
          </div>
        </Form>
      </Formik>
    </Paper>
  );
};

export default ArticleForm;
