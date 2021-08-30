import React, { FC, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { HtmlFileInfo } from '../../../model/HtmlFileInfo';
import HtmlFileTable from '../../../components/htmlInfo/HtmlFileTable';
import logger from '../../../helper/logger';
import { NotificationOptions } from '../../../model/NotificationOptions';
import notification from '../../../redux/actions/notification';
import { AGGREGATE_DECISION_TREE } from '../../../model/Aggregate';
import htmlFileInfoRepository from '../../../firebase/database/htmlFileInfoRepository';
import { HTML_FILE_CATEGORY_DECISION_TREE } from '../../../model/HtmlFileCategory';

interface Props {
  setNotification: (notificationOptions: NotificationOptions) => void;
}

const HtmlFileList: FC<Props> = ({ setNotification }) => {
  const [decisionTreeHtmlFiles, setDecisionTreeHtmlFiles] = useState<
    HtmlFileInfo[]
  >([]);

  const loadHtmlFiles = () => {
    htmlFileInfoRepository
      .getHtmlInfoByCategories([HTML_FILE_CATEGORY_DECISION_TREE])
      .then((result) => setDecisionTreeHtmlFiles(result));
  };

  useEffect(() => {
    loadHtmlFiles();
  }, []);

  const deleteHtmlFileHandle = (id: string) => {
    htmlFileInfoRepository
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
