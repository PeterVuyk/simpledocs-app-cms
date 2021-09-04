import React, { FC, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { HtmlFileInfo } from '../../model/HtmlFileInfo';
import HtmlFileTable from '../../components/htmlInfo/HtmlFileTable';
import logger from '../../helper/logger';
import { NotificationOptions } from '../../model/NotificationOptions';
import notification from '../../redux/actions/notification';
import PageHeading from '../../layout/PageHeading';
import { AGGREGATE_HTML_LAYOUT } from '../../model/Aggregate';
import htmlFileInfoRepository from '../../firebase/database/htmlFileInfoRepository';
import {
  HTML_FILE_CATEGORY_SNIPPET,
  HTML_FILE_CATEGORY_TEMPLATE,
} from '../../model/HtmlFileCategory';
import { ADD_SNIPPETS, ADD_TEMPLATE } from '../../navigation/UrlSlugs';

const useStyles = makeStyles({
  button: {
    marginLeft: 8,
  },
});

interface Props {
  setNotification: (notificationOptions: NotificationOptions) => void;
  title: string;
}

const HtmlLayout: FC<Props> = ({ title, setNotification }) => {
  const [htmlFileInfos, setHtmlFileInfos] = useState<HtmlFileInfo[]>([]);
  const history = useHistory();
  const classes = useStyles();

  const loadHtmlFiles = () => {
    htmlFileInfoRepository
      .getHtmlInfoByCategories([
        HTML_FILE_CATEGORY_TEMPLATE,
        HTML_FILE_CATEGORY_SNIPPET,
      ])
      .then((result) => setHtmlFileInfos(result));
  };

  useEffect(() => {
    loadHtmlFiles();
  }, []);

  const handleDeleteHtmlFile = (id: string) => {
    htmlFileInfoRepository
      .deleteHtmlFile(id)
      .then(loadHtmlFiles)
      .catch(() => {
        logger.error(
          `Failed removing the html file from the html file info with id ${id}`
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
    <>
      <PageHeading title={title}>
        <Button
          className={classes.button}
          variant="contained"
          color="primary"
          onClick={() => history.push(ADD_TEMPLATE)}
        >
          Template uploaden
        </Button>
        <Button
          className={classes.button}
          variant="contained"
          color="primary"
          onClick={() => history.push(ADD_SNIPPETS)}
        >
          Snippet uploaden
        </Button>
      </PageHeading>
      <HtmlFileTable
        aggregate={AGGREGATE_HTML_LAYOUT}
        htmlFileInfos={htmlFileInfos}
        onDelete={handleDeleteHtmlFile}
      />
    </>
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

export default connect(mapStateToProps, mapDispatchToProps)(HtmlLayout);
