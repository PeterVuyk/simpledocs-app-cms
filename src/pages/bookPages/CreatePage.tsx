import React, { FC } from 'react';
import Button from '@material-ui/core/Button';
import { useParams } from 'react-router-dom';
import { FormikValues } from 'formik';
import bookRepository from '../../firebase/database/bookRepository';
import PageHeading from '../../layout/PageHeading';
import Navigation from '../../navigation/Navigation';
import logger from '../../helper/logger';
import BookPageForm from './BookPageForm';
import {
  CONTENT_TYPE_DECISION_TREE,
  CONTENT_TYPE_HTML,
  CONTENT_TYPE_MARKDOWN,
  ContentType,
} from '../../model/ContentType';
import useHtmlModifier from '../../components/hooks/useHtmlModifier';
import markdownHelper from '../../helper/markdownHelper';
import { useAppDispatch } from '../../redux/hooks';
import { notify } from '../../redux/slice/notificationSlice';
import getTextFromSourceCode from '../../helper/text/getTextFromSourceCode';
import useNavigate from '../../navigation/useNavigate';

const CreatePage: FC = () => {
  const { history } = useNavigate();
  const { navigateBack } = useNavigate();
  const { aggregatePath } = useParams<{ aggregatePath: string }>();
  const { modifyHtmlForStorage } = useHtmlModifier();
  const dispatch = useAppDispatch();

  const getSubmittedContent = (
    values: FormikValues,
    contentType: ContentType
  ) => {
    switch (contentType) {
      case CONTENT_TYPE_MARKDOWN:
        return markdownHelper.modifyMarkdownForStorage(values.markdownContent);
      case CONTENT_TYPE_DECISION_TREE:
        // We don't add here the decision tree itself yet because it is still draft. When the user
        // 'publishes' the book then we replace the decisionTree title with the real decision tree.
        return values.decisionTreeContent;
      case CONTENT_TYPE_HTML:
      default:
        return modifyHtmlForStorage(values.htmlContent);
    }
  };

  const handleSubmit = async (
    values: FormikValues,
    contentType: ContentType
  ): Promise<void> => {
    const content = getSubmittedContent(values, contentType);
    bookRepository
      .createPage(aggregatePath, {
        pageIndex: values.pageIndex,
        chapter: values.chapter,
        chapterDivision: values.chapterDivision,
        title: values.title,
        subTitle: values.subTitle,
        searchText: await getTextFromSourceCode(content, contentType),
        content,
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
          'Create page has failed in CreatePage.handleSubmit',
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
          onClick={(e) => navigateBack(e, `/books/${aggregatePath}`)}
        >
          Terug
        </Button>
      </PageHeading>
      <BookPageForm onSubmit={handleSubmit} bookType={aggregatePath} />
    </Navigation>
  );
};

export default CreatePage;
