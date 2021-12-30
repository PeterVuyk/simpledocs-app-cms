import React, { FC } from 'react';
import Button from '@material-ui/core/Button';
import { useParams } from 'react-router-dom';
import { FormikValues } from 'formik';
import bookRepository from '../../firebase/database/bookRepository';
import PageHeading from '../../layout/PageHeading';
import Navigation from '../../navigation/Navigation';
import logger from '../../helper/logger';
import BookPageForm from './BookPageForm';
import { CONTENT_TYPE_HTML, ContentType } from '../../model/artifacts/Artifact';
import useHtmlModifier from '../../components/hooks/useHtmlModifier';
import markdownHelper from '../../helper/markdownHelper';
import useCmsConfiguration from '../../configuration/useCmsConfiguration';
import { useAppDispatch } from '../../redux/hooks';
import { notify } from '../../redux/slice/notificationSlice';
import getTextFromSourceCode from '../../helper/text/getTextFromSourceCode';
import useNavigate from '../../navigation/useNavigate';

const CreatePage: FC = () => {
  const { history } = useNavigate();
  const { navigateBack } = useNavigate();
  const { aggregatePath } = useParams<{ aggregatePath: string }>();
  const { modifyHtmlForStorage } = useHtmlModifier();
  const { getBookTypeFromUrlSlug } = useCmsConfiguration();
  const dispatch = useAppDispatch();

  const handleSubmit = async (
    values: FormikValues,
    contentType: ContentType
  ): Promise<void> => {
    const content =
      contentType === CONTENT_TYPE_HTML
        ? modifyHtmlForStorage(values.htmlContent)
        : markdownHelper.modifyMarkdownForStorage(values.markdownContent);
    bookRepository
      .createPage(getBookTypeFromUrlSlug(aggregatePath), {
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
      <BookPageForm
        onSubmit={handleSubmit}
        bookType={getBookTypeFromUrlSlug(aggregatePath)}
      />
    </Navigation>
  );
};

export default CreatePage;
