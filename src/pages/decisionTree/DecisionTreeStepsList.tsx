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
import HtmlPreview from '../../components/dialog/HtmlPreview';
import { DecisionTreeStep } from '../../model/DecisionTreeStep';
import decisionTreeHtmlFilesRepository from '../../firebase/database/decisionTreeHtmlFilesRepository';
import { EDIT_STATUS_DRAFT, EditStatus } from '../../model/EditStatus';

const useStyles = makeStyles({
  table: {
    width: '100%',
  },
  head: {
    backgroundColor: '#ddd',
  },
});

interface Props {
  decisionTreeSteps: DecisionTreeStep[];
  editStatus: EditStatus;
}

const DecisionTreeStepsList: FC<Props> = ({
  decisionTreeSteps,
  editStatus,
}) => {
  const classes = useStyles();
  const [showHtmlPreview, setShowHtmlPreview] = useState<DecisionTreeStep>();
  const [htmlFile, setHtmlFile] = useState<string | null>();

  const closeHtmlPreviewHandle = (): void => setShowHtmlPreview(undefined);

  useEffect(() => {
    if (showHtmlPreview?.htmlFile !== undefined) {
      setHtmlFile(showHtmlPreview.htmlFile);
      return;
    }
    if (showHtmlPreview?.htmlFileId === undefined) {
      return;
    }
    decisionTreeHtmlFilesRepository
      .getHtmlFileById(showHtmlPreview.htmlFileId)
      .then((result) => setHtmlFile(result.htmlFile));
  }, [showHtmlPreview]);

  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow className={classes.head}>
            <TableCell>
              <strong>Titel</strong>
            </TableCell>
            <TableCell>
              <strong>ID</strong>
              <br />
              id
            </TableCell>
            <TableCell>
              <strong>Label</strong>
              <br />
              label
            </TableCell>
            <TableCell style={{ whiteSpace: 'nowrap' }}>
              <strong>Parent ID</strong>
              <br />
              parentId
            </TableCell>
            <TableCell>
              <strong>Antwoord</strong>
              <br />
              lineLabel
            </TableCell>
            <TableCell>
              <strong>HTML bestand ID</strong>
              <br />
              htmlFileId
            </TableCell>
            <TableCell>
              <strong>Interne notitie</strong>
              <br />
              internalNote
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {decisionTreeSteps.length === 0 && (
            <TableRow hover key="no-result">
              <TableCell component="th" scope="row" colSpan={7}>
                Geen resultaten.
              </TableCell>
            </TableRow>
          )}
          {decisionTreeSteps.map((row) => (
            <TableRow
              hover
              key={row.id + row.title + row?.markedForDeletion}
              style={{
                backgroundColor: row?.markedForDeletion ? '#fcb3b3' : '#fff',
              }}
            >
              <TableCell component="th" scope="row">
                {row.title}&nbsp;
                {row.iconFile && (
                  <img
                    style={{ width: 30 }}
                    src={`${row.iconFile}`}
                    alt={row.title}
                  />
                )}
              </TableCell>
              <TableCell>{row.id}</TableCell>
              <TableCell>{row.label}</TableCell>
              <TableCell>{row.parentId}</TableCell>
              <TableCell>{row.lineLabel}</TableCell>
              <TableCell>
                {editStatus === EDIT_STATUS_DRAFT && row.htmlFileId}&nbsp;
                {(row.htmlFileId || row.htmlFile) && (
                  <FindInPageTwoToneIcon
                    color="primary"
                    style={{ cursor: 'pointer', marginBottom: -5 }}
                    onClick={() => setShowHtmlPreview(row)}
                  />
                )}
                {showHtmlPreview &&
                  htmlFile &&
                  showHtmlPreview.id === row.id && (
                    <HtmlPreview
                      showHtmlPreview={htmlFile}
                      closeHtmlPreviewHandle={closeHtmlPreviewHandle}
                    />
                  )}
              </TableCell>
              <TableCell>{row.internalNote}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default DecisionTreeStepsList;
