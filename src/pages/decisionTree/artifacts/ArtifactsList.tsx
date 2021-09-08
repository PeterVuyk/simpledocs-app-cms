import React, { FC, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import ArtifactsTable from '../../../components/artifact/ArtifactsTable';
import logger from '../../../helper/logger';
import { NotificationOptions } from '../../../model/NotificationOptions';
import notification from '../../../redux/actions/notification';
import { AGGREGATE_DECISION_TREE } from '../../../model/Aggregate';
import artifactsRepository from '../../../firebase/database/artifactsRepository';
import { ARTIFACT_TYPE_DECISION_TREE } from '../../../model/ArtifactType';
import { Artifact } from '../../../model/Artifact';

interface Props {
  setNotification: (notificationOptions: NotificationOptions) => void;
}

const ArtifactsList: FC<Props> = ({ setNotification }) => {
  const [decisionTreeArtifacts, setDecisionTreeArtifacts] = useState<
    Artifact[]
  >([]);

  const loadArtifacts = () => {
    artifactsRepository
      .getArtifactsByCategories([ARTIFACT_TYPE_DECISION_TREE])
      .then((result) => setDecisionTreeArtifacts(result));
  };

  useEffect(() => {
    loadArtifacts();
  }, []);

  const handleDeleteArtifact = (id: string) => {
    artifactsRepository
      .deleteArtifact(id)
      .then(loadArtifacts)
      .then(() =>
        setNotification({
          notificationType: 'success',
          notificationOpen: true,
          notificationMessage: `Het bestand is verwijderd.`,
        })
      )
      .catch(() => {
        logger.error(
          `Failed removing the artifact from the decision tree ${id}`
        );
        setNotification({
          notificationOpen: true,
          notificationType: 'error',
          notificationMessage: 'Het verwijderen van het bestand is mislukt',
        });
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

const mapStateToProps = (state: any) => {
  return {
    notificationOptions: state.notification.notificationOptions,
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    setNotification: (notificationOptions: NotificationOptions) =>
      // eslint-disable-next-line import/no-named-as-default-member
      dispatch(notification.setNotification(notificationOptions)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ArtifactsList);
