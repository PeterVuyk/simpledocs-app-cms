import React, { FC, useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import FindInPageTwoToneIcon from '@material-ui/icons/FindInPageTwoTone';
import { EditTwoTone } from '@material-ui/icons';
import { useHistory } from 'react-router-dom';
import HtmlPreview from '../../components/dialog/HtmlPreview';
import decisionTreeHtmlFilesRepository from '../../firebase/database/decisionTreeHtmlFilesRepository';
import { DecisionTreeHtmlFile } from '../../model/DecisionTreeHtmlFile';

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

const HtmlFileList: FC = () => {
  const [showHtmlPreview, setShowHtmlPreview] = useState<string | undefined>();
  const [decisionTreeHtmlFiles, setDecisionTreeHtmlFiles] = useState<
    DecisionTreeHtmlFile[]
  >([]);
  const closeHtmlPreviewHandle = (): void => setShowHtmlPreview(undefined);
  const classes = useStyles();
  const history = useHistory();

  useEffect(() => {
    decisionTreeHtmlFilesRepository
      .getHtmlFiles()
      .then((result) => setDecisionTreeHtmlFiles(result));
  }, []);

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
                  <FindInPageTwoToneIcon
                    color="primary"
                    style={{ cursor: 'pointer' }}
                    onClick={() => setShowHtmlPreview(row.htmlFile)}
                  />
                  {showHtmlPreview && (
                    <HtmlPreview
                      showHtmlPreview={showHtmlPreview}
                      closeHtmlPreviewHandle={closeHtmlPreviewHandle}
                    />
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default HtmlFileList;
