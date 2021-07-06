import React, { FC, useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { EditTwoTone } from '@material-ui/icons';
import { useHistory } from 'react-router-dom';
import { connect } from 'react-redux';
import decisionTreeHtmlFilesRepository from '../../../firebase/database/decisionTreeHtmlFilesRepository';
import { DecisionTreeHtmlFile } from '../../../model/DecisionTreeHtmlFile';
import DownloadHtmlFileAction from '../../../components/ItemAction/DownloadHtmlFileAction';
import ViewHTMLFileAction from '../../../components/ItemAction/ViewHTMLFileAction';
import DeleteItemAction from '../../../components/ItemAction/DeleteItemAction';
import logger from '../../../helper/logger';
import { NotificationOptions } from '../../../model/NotificationOptions';
import notification from '../../../redux/actions/notification';

const useStyles = makeStyles({
  table: {
    width: '100%',
  },
  head: {
    backgroundColor: '#ddd',
  },
  toolBox: {
    width: 150,
  },
});

interface Props {
  setNotification: (notificationOptions: NotificationOptions) => void;
}

const HtmlFileList: FC<Props> = ({ setNotification }) => {
  const [decisionTreeHtmlFiles, setDecisionTreeHtmlFiles] = useState<
    DecisionTreeHtmlFile[]
  >([]);
  const classes = useStyles();
  const history = useHistory();

  const loadHtmlFiles = () => {
    decisionTreeHtmlFilesRepository
      .getHtmlFiles()
      .then((result) => setDecisionTreeHtmlFiles(result));
  };

  useEffect(() => {
    loadHtmlFiles();
  }, []);

  const onDelete = (itemId: string) => {
    decisionTreeHtmlFilesRepository
      .deleteHtmlFile(itemId)
      .then(() => {
        setDecisionTreeHtmlFiles([]);
        loadHtmlFiles();
      })
      .catch(() => {
        logger.error(
          `Failed removing the html file from the decision tree ${itemId}`
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
      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow className={classes.head}>
              <TableCell>
                <strong>ID HTML bestanden</strong>
              </TableCell>
              <TableCell>
                <strong>Titel</strong>
              </TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {decisionTreeHtmlFiles.map((row) => (
              <TableRow hover key={row.id}>
                <TableCell component="th" scope="row">
                  {row.id}
                </TableCell>
                <TableCell>{row.title}</TableCell>
                <TableCell align="right" className={classes.toolBox}>
                  <EditTwoTone
                    style={{ cursor: 'pointer' }}
                    onClick={() =>
                      history.push(`/decision-tree/html/${row.id}`)
                    }
                  />
                  <DownloadHtmlFileAction
                    htmlFile={row.htmlFile}
                    fileName={row.title}
                  />
                  <ViewHTMLFileAction htmlFile={row.htmlFile} />
                  <DeleteItemAction
                    title="Weet je zeker dat je dit html bestand wilt verwijderen?"
                    dialogText={`ID: ${row.id}\nTitel: ${row.title}`}
                    onSubmit={onDelete}
                    itemId={row.id!}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
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

export default connect(mapStateToProps, mapDispatchToProps)(HtmlFileList);
