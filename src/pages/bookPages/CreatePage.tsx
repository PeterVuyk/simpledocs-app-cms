import React, { FC } from 'react';
import Button from '@mui/material/Button';
import { useParams } from 'react-router-dom';
import { FormikValues } from 'formik';
import bookRepository from '../../firebase/database/bookRepository';
import PageHeading from '../../layout/PageHeading';
import Navigation from '../../navigation/Navigation';
import logger from '../../helper/logger';
import BookPageForm from './BookPageForm';
import {
  CONTENT_TYPE_CALCULATIONS,
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
import decisionTreeRepository from '../../firebase/database/decisionTreeRepository';
import calculationsRepository from '../../firebase/database/calculationsRepository';

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
        return decisionTreeRepository
          .getDecisionTree(false)
          .then((trees) =>
            trees
              .filter((tree) => !tree.markedForDeletion)
              .find((tree) => tree.title === values.decisionTreeContent)
          )
          .then((value) => JSON.stringify(value));
      case CONTENT_TYPE_CALCULATIONS:
        return calculationsRepository
          .getCalculationsInfo(false)
          .then((calculations) =>
            calculations.find(
              (calculation) =>
                calculation.calculationType === values.calculationsContent
            )
          )
          .then((value) => JSON.stringify(value));
      case CONTENT_TYPE_HTML:
      default:
        return modifyHtmlForStorage(values.htmlContent);
    }
  };

  const handleSubmit = async (
    values: FormikValues,
    contentType: ContentType
  ): Promise<void> => {
    const content = await getSubmittedContent(values, contentType);
    bookRepository
      .createPage(aggregatePath, {
        pageIndex: -Date.now(),
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
