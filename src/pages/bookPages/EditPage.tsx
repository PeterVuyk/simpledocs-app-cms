import React, { FC, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import { FormikValues } from 'formik';
import bookRepository from '../../firebase/database/bookRepository';
import PageHeading from '../../layout/PageHeading';
import logger from '../../helper/logger';
import BookPageForm from './BookPageForm';
import Navigation from '../../navigation/Navigation';
import { Page } from '../../model/Page';
import { useAppDispatch } from '../../redux/hooks';
import htmlContentHelper from '../../helper/htmlContentHelper';
import NotFound from '../NotFound';
import LoadingSpinner from '../../components/LoadingSpinner';
import { CONTENT_TYPE_HTML, ContentType } from '../../model/artifacts/Artifact';
import markdownHelper from '../../helper/markdownHelper';
import { notify } from '../../redux/slice/notificationSlice';
import getTextFromSourceCode from '../../helper/text/getTextFromSourceCode';
import useNavigate from '../../navigation/useNavigate';

const EditPage: FC = () => {
  const [page, setPage] = useState<Page | null>();
  const { history, navigateBack } = useNavigate();
  const { bookPageId, aggregatePath } =
    useParams<{ bookPageId: string; aggregatePath: string }>();
  const dispatch = useAppDispatch();

  useEffect(() => {
    bookRepository
      .getPageById(aggregatePath, bookPageId)
      .then((result) => setPage(result));
  }, [aggregatePath, bookPageId]);

  const handleSubmit = async (
    values: FormikValues,
    contentType: ContentType
  ): Promise<void> => {
    const content =
      contentType === CONTENT_TYPE_HTML
        ? htmlContentHelper.addHTMLTagsAndBottomSpacingToHtmlContent(
            values.htmlContent
          )
        : markdownHelper.modifyMarkdownForStorage(values.markdownContent);
    await bookRepository
      .updatePage(aggregatePath, page?.chapter ?? '', {
        id: `${page?.id?.replaceAll('-draft', '')}-draft`,
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
            notificationMessage: 'Pagina is gewijzigd.',
          })
        )
      )
      .catch((error) => {
        logger.errorWithReason(
          'Edit page has failed in EditPage.handleSubmit',
          error
        );
        dispatch(
          notify({
            notificationType: 'error',
            notificationOpen: true,
            notificationMessage:
              'Het wijzigen van het artikel is mislukt, neem contact op met de beheerder.',
          })
        );
      });
  };

  if (page === null) {
    return <NotFound />;
  }

  return (
    <Navigation>
      <PageHeading title="Pagina bewerken">
        <Button
          variant="contained"
          color="secondary"
          onClick={(e) => navigateBack(e, `/books/${aggregatePath}`)}
        >
          Terug
        </Button>
      </PageHeading>
      {!page && <LoadingSpinner />}
      {page && (
        <BookPageForm
          page={page}
          onSubmit={handleSubmit}
          bookType={aggregatePath}
        />
      )}
    </Navigation>
  );
};

export default EditPage;
