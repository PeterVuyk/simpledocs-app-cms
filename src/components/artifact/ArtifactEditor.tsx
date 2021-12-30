import React, { FC, useEffect, useState } from 'react';
import Button from '@material-ui/core/Button';
import { FormikValues } from 'formik';
import PageHeading from '../../layout/PageHeading';
import logger from '../../helper/logger';
import ContentPageForm from '../form/ContentPageForm';
import Navigation from '../../navigation/Navigation';
import NotFound from '../../pages/NotFound';
import {
  DECISION_TREE_PAGE,
  HTML_LAYOUT_PAGE,
} from '../../navigation/UrlSlugs';
import artifactsRepository from '../../firebase/database/artifactsRepository';
import {
  ARTIFACT_TYPE_DECISION_TREE,
  ArtifactType,
  isArtifactType,
} from '../../model/artifacts/ArtifactType';
import { Artifact, CONTENT_TYPE_HTML } from '../../model/artifacts/Artifact';
import useContentTypeToggle from '../content/useContentTypeToggle';
import useHtmlModifier from '../hooks/useHtmlModifier';
import markdownHelper from '../../helper/markdownHelper';
import { useAppDispatch } from '../../redux/hooks';
import { notify } from '../../redux/slice/notificationSlice';
import useNavigate from '../../navigation/useNavigate';

interface Props {
  artifactId?: string;
  artifactType: ArtifactType;
}

const ArtifactEditor: FC<Props> = ({ artifactType, artifactId }) => {
  const [isNewFile, setIsNewFile] = useState<boolean>(false);
  const [artifact, setArtifact] = useState<Artifact | null>(null);
  const [contentTypeToggle, setContentTypeToggle] = useContentTypeToggle(
    artifact?.contentType
  );
  const { history, navigateBack } = useNavigate();
  const { modifyHtmlForStorage } = useHtmlModifier();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (artifactId === undefined) {
      setIsNewFile(true);
      setArtifact({
        type: artifactType,
        content: '',
        contentType: contentTypeToggle,
        title: '',
        id: '',
      });
      return;
    }
    artifactsRepository
      .getArtifactById(artifactId)
      .then((value) => setArtifact(value));
  }, [artifactType, artifactId, contentTypeToggle]);

  const addOrEditText = isNewFile ? 'toegevoegd' : 'gewijzigd';

  const getPreviousPath =
    artifactType === ARTIFACT_TYPE_DECISION_TREE
      ? DECISION_TREE_PAGE
      : HTML_LAYOUT_PAGE;

  const handleSubmit = async (values: FormikValues): Promise<void> => {
    await artifactsRepository
      .updateArtifact({
        id: artifact?.id,
        type: artifactType,
        contentType: contentTypeToggle,
        title: values.title.charAt(0).toUpperCase() + values.title.slice(1),
        content:
          contentTypeToggle === CONTENT_TYPE_HTML
            ? modifyHtmlForStorage(values.htmlContent)
            : markdownHelper.modifyMarkdownForStorage(values.markdownContent),
      })
      .then(() => history.push(getPreviousPath))
      .then(() =>
        dispatch(
          notify({
            notificationType: 'success',
            notificationOpen: true,
            notificationMessage: `De pagina is ${addOrEditText}.`,
          })
        )
      )
      .catch((error) => {
        logger.errorWithReason(
          `Edit/Add ${artifactType} has failed in ArtifactEditor.handleSubmit`,
          error
        );
        dispatch(
          notify({
            notificationType: 'error',
            notificationOpen: true,
            notificationMessage: `Het ${addOrEditText} van is mislukt, neem contact op met de beheerder.`,
          })
        );
      });
  };

  if (!isArtifactType(artifactType)) {
    return <NotFound />;
  }

  return (
    <Navigation>
      <PageHeading title={`Bestand ${isNewFile ? 'toevoegen' : 'wijzigen'}`}>
        <Button
          variant="contained"
          color="secondary"
          onClick={(e) => navigateBack(e, getPreviousPath)}
        >
          Terug
        </Button>
      </PageHeading>
      {artifact && (
        <ContentPageForm
          isNewFile={isNewFile}
          onSubmit={handleSubmit}
          artifact={artifact}
          contentTypeToggle={contentTypeToggle}
          setContentTypeToggle={setContentTypeToggle}
        />
      )}
    </Navigation>
  );
};

export default ArtifactEditor;
