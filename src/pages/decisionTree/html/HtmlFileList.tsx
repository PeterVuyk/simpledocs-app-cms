import React, { FC, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import decisionTreeHtmlFilesRepository from '../../../firebase/database/decisionTreeHtmlFilesRepository';
import { HtmlFileInfo } from '../../../model/HtmlFileInfo';
import HtmlFileTable from '../../../components/table/HtmlFileTable';
import logger from '../../../helper/logger';
import { NotificationOptions } from '../../../model/NotificationOptions';
import notification from '../../../redux/actions/notification';
import { AGGREGATE_DECISION_TREE } from '../../../model/Aggregate';

interface Props {
  setNotification: (notificationOptions: NotificationOptions) => void;
}

const HtmlFileList: FC<Props> = ({ setNotification }) => {
  const [decisionTreeHtmlFiles, setDecisionTreeHtmlFiles] = useState<
    HtmlFileInfo[]
  >([]);

  const loadHtmlFiles = () => {
    decisionTreeHtmlFilesRepository
      .getHtmlFiles()
      .then((result) => setDecisionTreeHtmlFiles(result));
  };

  useEffect(() => {
    loadHtmlFiles();
  }, []);

  const deleteHtmlFileHandle = (id: string) => {
    decisionTreeHtmlFilesRepository
      .deleteHtmlFile(id)
      .then(loadHtmlFiles)
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
    <HtmlFileTable
      aggregate={AGGREGATE_DECISION_TREE}
      htmlFileInfos={decisionTreeHtmlFiles}
      deleteHandle={deleteHtmlFileHandle}
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
