import React, { FC, useEffect, useState } from 'react';
import Button from '@material-ui/core/Button';
import { FormikValues } from 'formik';
import { useParams } from 'react-router-dom';
import PageHeading from '../../layout/PageHeading';
import logger from '../../helper/logger';
import Navigation from '../../navigation/Navigation';
import { STANDALONE_PAGE } from '../../navigation/UrlSlugs';
import { ARTIFACT_TYPE_STANDALONE_PAGE } from '../../model/artifacts/ArtifactType';
import { Artifact } from '../../model/artifacts/Artifact';
import markdownHelper from '../../helper/markdownHelper';
import { useAppDispatch } from '../../redux/hooks';
import { notify } from '../../redux/slice/notificationSlice';
import useNavigate from '../../navigation/useNavigate';
import { CONTENT_TYPE_HTML } from '../../model/ContentType';
import standalonePagesRepository from '../../firebase/database/standalonePagesRepository';
import ContentPageForm from '../../components/form/ContentPageForm';
import useHtmlModifier from '../../components/hooks/useHtmlModifier';
import useContentTypeToggle from '../../components/content/useContentTypeToggle';

const UpdateStandalonePageEditor: FC = () => {
  const [artifact, setArtifact] = useState<Artifact | null>(null);
  const [contentTypeToggle, setContentTypeToggle] = useContentTypeToggle(
    artifact?.contentType
  );
  const { history, navigateBack } = useNavigate();
  const { modifyHtmlForStorage } = useHtmlModifier();
  const dispatch = useAppDispatch();
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    standalonePagesRepository.getStandalonePageById(id).then((value) => {
      if (value) {
        setArtifact({
          id: value.id,
          type: ARTIFACT_TYPE_STANDALONE_PAGE,
          contentType: value.contentType,
          content: value.content,
          title: value.title,
        });
      } else {
        dispatch(
          notify({
            notificationType: 'error',
            notificationOpen: true,
            notificationMessage: `Het ophalen van de pagina is mislukt.`,
          })
        );
        history.push(STANDALONE_PAGE);
      }
    });
  }, [id, contentTypeToggle, dispatch, history]);

  const handleSubmit = async (values: FormikValues): Promise<void> => {
    await standalonePagesRepository
      .updateStandalonePage({
        id,
        contentType: contentTypeToggle,
        title: values.title.charAt(0).toUpperCase() + values.title.slice(1),
        content:
          contentTypeToggle === CONTENT_TYPE_HTML
            ? modifyHtmlForStorage(values.htmlContent)
            : markdownHelper.modifyMarkdownForStorage(values.markdownContent),
      })
      .then(() => history.push(STANDALONE_PAGE))
      .then(() =>
        dispatch(
          notify({
            notificationType: 'success',
            notificationOpen: true,
            notificationMessage: `De pagina is gewijzigd.`,
          })
        )
      )
      .catch((error) => {
        logger.errorWithReason(
          `update page has failed in UpdateStandalonePageEditor.handleSubmit`,
          error
        );
        dispatch(
          notify({
            notificationType: 'error',
            notificationOpen: true,
            notificationMessage: `Het wijzigen van de pagina is mislukt, neem contact op met de beheerder.`,
          })
        );
      });
  };

  return (
    <Navigation>
      <PageHeading title="Bestand wijzigen">
        <Button
          variant="contained"
          color="secondary"
          onClick={(e) => navigateBack(e, STANDALONE_PAGE)}
        >
          Terug
        </Button>
      </PageHeading>
      {artifact && (
        <ContentPageForm
          isNewFile={false}
          onSubmit={handleSubmit}
          artifact={artifact}
          contentTypeToggle={contentTypeToggle}
          setContentTypeToggle={setContentTypeToggle}
        />
      )}
    </Navigation>
  );
};

export default UpdateStandalonePageEditor;
