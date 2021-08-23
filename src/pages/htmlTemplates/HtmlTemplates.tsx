import React, { FC, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { HtmlFileInfo } from '../../model/HtmlFileInfo';
import htmlTemplateRepository from '../../firebase/database/htmlTemplateRepository';
import HtmlFileTable from '../../components/table/HtmlFileTable';
import logger from '../../helper/logger';
import { NotificationOptions } from '../../model/NotificationOptions';
import notification from '../../redux/actions/notification';
import PageHeading from '../../layout/PageHeading';
import { AGGREGATE_HTML_TEMPLATES } from '../../model/Aggregate';

const useStyles = makeStyles({
  button: {
    marginLeft: 8,
  },
});

interface Props {
  setNotification: (notificationOptions: NotificationOptions) => void;
}

const HtmlTemplates: FC<Props> = ({ setNotification }) => {
  const [htmlFileInfos, setHtmlFileInfos] = useState<HtmlFileInfo[]>([]);
  const history = useHistory();
  const classes = useStyles();

  const loadHtmlFiles = () => {
    htmlTemplateRepository
      .getHtmlTemplates()
      .then((result) => setHtmlFileInfos(result));
  };

  useEffect(() => {
    loadHtmlFiles();
  }, []);

  const deleteHtmlFileHandle = (id: string) => {
    htmlTemplateRepository
      .deleteHtmlFile(id)
      .then(loadHtmlFiles)
      .catch(() => {
        logger.error(
          `Failed removing the html file from the html templates met id ${id}`
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
      <PageHeading title="HTML templates">
        <Button
          className={classes.button}
          variant="contained"
          color="primary"
          onClick={() => history.push(`/html-templates/html/add`)}
        >
          HTML bestand uploaden
        </Button>
      </PageHeading>
      <HtmlFileTable
        aggregate={AGGREGATE_HTML_TEMPLATES}
        htmlFileInfos={htmlFileInfos}
        deleteHandle={deleteHtmlFileHandle}
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

export default connect(mapStateToProps, mapDispatchToProps)(HtmlTemplates);
