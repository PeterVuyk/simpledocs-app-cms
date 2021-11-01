import React, { FC } from 'react';
import Button from '@material-ui/core/Button';
import { useHistory, useParams } from 'react-router-dom';
import { FormikValues } from 'formik';
import articleRepository from '../../firebase/database/articleRepository';
import PageHeading from '../../layout/PageHeading';
import Navigation from '../../navigation/Navigation';
import logger from '../../helper/logger';
import ArticleForm from './ArticleForm';
import { CONTENT_TYPE_HTML, ContentType } from '../../model/Artifact';
import useHtmlModifier from '../../components/hooks/useHtmlModifier';
import markdownHelper from '../../helper/markdownHelper';
import useCmsConfiguration from '../../configuration/useCmsConfiguration';
import { useAppDispatch } from '../../redux/hooks';
import { notify } from '../../redux/slice/notificationSlice';

const CreateArticle: FC = () => {
  const history = useHistory();
  const { aggregatePath } = useParams<{ aggregatePath: string }>();
  const { modifyHtmlForStorage } = useHtmlModifier();
  const { getBookTypeFromUrlSlug } = useCmsConfiguration();
  const dispatch = useAppDispatch();

  const handleSubmit = (
    values: FormikValues,
    contentType: ContentType
  ): void => {
    articleRepository
      .createArticle(getBookTypeFromUrlSlug(aggregatePath), {
        pageIndex: values.pageIndex,
        chapter: values.chapter,
        chapterDivision: values.chapterDivision,
        title: values.title,
        subTitle: values.subTitle,
        searchText: values.searchText,
        content:
          contentType === CONTENT_TYPE_HTML
            ? modifyHtmlForStorage(values.htmlContent)
            : markdownHelper.modifyMarkdownForStorage(values.markdownContent),
        contentType,
        iconFile: values.iconFile,
        isDraft: true,
      })
      .then(() => history.push(`/books/${aggregatePath}`))
      .then(() =>
        dispatch(
          notify({
            notificationType: 'success',
            notificationOpen: true,
            notificationMessage: 'Pagina is toegevoegd.',
          })
        )
      )
      .catch((error) => {
        logger.errorWithReason(
          'Create article has failed in CreateArticle.handleSubmit',
          error
        );
        dispatch(
          notify({
            notificationType: 'error',
            notificationOpen: true,
            notificationMessage: `Het toevoegen van het artikel is mislukt, foutmelding: ${error.message}.`,
          })
        );
      });
  };

  return (
    <Navigation>
      <PageHeading title="Pagina toevoegen">
        <Button
          variant="contained"
          color="secondary"
          onClick={() => history.goBack()}
        >
          Terug
        </Button>
      </PageHeading>
      <ArticleForm
        onSubmit={handleSubmit}
        bookType={getBookTypeFromUrlSlug(aggregatePath)}
      />
    </Navigation>
  );
};

export default CreateArticle;
