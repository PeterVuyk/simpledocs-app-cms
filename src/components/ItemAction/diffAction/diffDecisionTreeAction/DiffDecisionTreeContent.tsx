import React, { FC, useEffect, useState } from 'react';
import 'diff2html/bundles/css/diff2html.min.css';
import { DecisionTreeStep } from '../../../../model/DecisionTreeStep';
import artifactsRepository from '../../../../firebase/database/artifactsRepository';
import {
  Artifact,
  CONTENT_TYPE_HTML,
} from '../../../../model/artifacts/Artifact';
import logger from '../../../../helper/logger';
import { useAppDispatch } from '../../../../redux/hooks';
import { notify } from '../../../../redux/slice/notificationSlice';
import DiffContentPage from '../diff/DiffContentPage';

interface Props {
  conceptDecisionTreeArtifactId: string;
  publishedDecisionTreeStep: DecisionTreeStep | undefined;
}

const DiffDecisionTreeContent: FC<Props> = ({
  conceptDecisionTreeArtifactId,
  publishedDecisionTreeStep,
}) => {
  const [conceptArtifact, setConceptArtifact] = useState<Artifact | null>(null);
  const dispatch = useAppDispatch();

  useEffect(() => {
    artifactsRepository
      .getArtifactById(conceptDecisionTreeArtifactId)
      .then(setConceptArtifact)
      .catch((reason) => {
        logger.errorWithReason(
          'failed to get the diff for the decision tree content in DiffDecisionTreeContent',
          reason
        );
        dispatch(
          notify({
            notificationType: 'error',
            notificationOpen: true,
            notificationMessage: `Het ophalen van het verschil van de pagina is mislukt.`,
          })
        );
      });
  }, [conceptDecisionTreeArtifactId, dispatch]);

  if (conceptArtifact === null) {
    return null;
  }

  return (
    <DiffContentPage
      conceptPageContent={conceptArtifact.content}
      conceptContentType={conceptArtifact.contentType}
      publishedContentType={
        publishedDecisionTreeStep?.contentType ?? CONTENT_TYPE_HTML
      }
      publishedPageContent={publishedDecisionTreeStep?.content ?? ''}
    />
  );
};

export default DiffDecisionTreeContent;
