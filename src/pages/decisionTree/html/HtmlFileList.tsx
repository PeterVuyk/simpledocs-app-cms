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

const HtmlFileList: FC<Props> = ({ setNotification }) => {
  const [decisionTreeHtmlFiles, setDecisionTreeHtmlFiles] = useState<
    Artifact[]
  >([]);

  const loadHtmlFiles = () => {
    artifactsRepository
      .getArtifactsByCategories([ARTIFACT_TYPE_DECISION_TREE])
      .then((result) => setDecisionTreeHtmlFiles(result));
  };

  useEffect(() => {
    loadHtmlFiles();
  }, []);

  const handleDeleteHtmlFile = (id: string) => {
    artifactsRepository
      .deleteArtifact(id)
      .then(loadHtmlFiles)
      .then(() =>
        setNotification({
          notificationType: 'success',
          notificationOpen: true,
          notificationMessage: `Het html bestand is verwijderd.`,
        })
      )
      .catch(() => {
        logger.error(
          `Failed removing the html file from the decision tree ${id}`
        );
        setNotification({
          notificationOpen: true,
          notificationType: 'error',
          notificationMessage:
            'Het verwijderen van het html bestand is mislukt',
        });
      });
  };

  return (
    <ArtifactsTable
      aggregate={AGGREGATE_DECISION_TREE}
      artifacts={decisionTreeHtmlFiles}
      onDelete={handleDeleteHtmlFile}
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

export default connect(mapStateToProps, mapDispatchToProps)(HtmlFileList);
