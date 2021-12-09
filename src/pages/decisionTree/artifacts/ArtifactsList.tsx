import React, { FC, useEffect, useState } from 'react';
import ArtifactsTable from '../../../components/artifact/ArtifactsTable';
import logger from '../../../helper/logger';
import { AGGREGATE_DECISION_TREE } from '../../../model/Aggregate';
import artifactsRepository from '../../../firebase/database/artifactsRepository';
import { ARTIFACT_TYPE_DECISION_TREE } from '../../../model/artifacts/ArtifactType';
import { Artifact } from '../../../model/artifacts/Artifact';
import { useAppDispatch } from '../../../redux/hooks';
import { notify } from '../../../redux/slice/notificationSlice';

const ArtifactsList: FC = () => {
  const [decisionTreeArtifacts, setDecisionTreeArtifacts] = useState<
    Artifact[]
  >([]);
  const dispatch = useAppDispatch();

  const loadArtifacts = () => {
    artifactsRepository
      .getArtifactsByCategories([ARTIFACT_TYPE_DECISION_TREE])
      .then((result) => setDecisionTreeArtifacts(result));
  };

  useEffect(() => {
    loadArtifacts();
  }, []);

  const handleDeleteArtifact = async (id: string) => {
    await artifactsRepository
      .deleteArtifact(id)
      .then(loadArtifacts)
      .then(() =>
        dispatch(
          notify({
            notificationType: 'success',
            notificationOpen: true,
            notificationMessage: `Het bestand is verwijderd.`,
          })
        )
      )
      .catch(() => {
        logger.error(
          `Failed removing the artifact from the decision tree ${id}`
        );
        dispatch(
          notify({
            notificationOpen: true,
            notificationType: 'error',
            notificationMessage: 'Het verwijderen van het bestand is mislukt',
          })
        );
      });
  };

  return (
    <ArtifactsTable
      aggregate={AGGREGATE_DECISION_TREE}
      artifacts={decisionTreeArtifacts}
      onDelete={handleDeleteArtifact}
      showIdColumn
      showArtifactType={false}
    />
  );
};

export default ArtifactsList;
