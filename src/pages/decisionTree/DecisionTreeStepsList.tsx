import React, { FC } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { DecisionTreeStep } from '../../model/DecisionTreeStep';
import { EDIT_STATUS_DRAFT, EditStatus } from '../../model/EditStatus';
import DownloadContentAction from '../../components/ItemAction/DownloadContentAction';
import ViewContentAction from '../../components/ItemAction/ViewContentAction';

const useStyles = makeStyles({
  table: {
    width: '100%',
  },
  head: {
    backgroundColor: '#ddd',
  },
});

interface Props {
  decisionTreeSteps: DecisionTreeStep[] | null;
  editStatus: EditStatus;
}

const DecisionTreeStepsList: FC<Props> = ({
  decisionTreeSteps,
  editStatus,
}) => {
  const classes = useStyles();

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
              <strong>Toelichting bestand ID</strong>
              <br />
              contentId
            </TableCell>
            <TableCell>
              <strong>Interne notitie</strong>
              <br />
              internalNote
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {decisionTreeSteps !== null && decisionTreeSteps.length === 0 && (
            <TableRow key="no-result">
              <TableCell component="th" scope="row" colSpan={7}>
                Geen resultaten.
              </TableCell>
            </TableRow>
          )}
          {decisionTreeSteps !== null &&
            decisionTreeSteps.map((row) => (
              <TableRow
                key={row.id + row.title + row?.markedForDeletion}
                style={{
                  backgroundColor: row.markedForDeletion ? '#FCC1C1B5' : '#fff',
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
                  {editStatus === EDIT_STATUS_DRAFT && row.contentId}&nbsp;
                  {row.content && row.contentType && (
                    <>
                      <DownloadContentAction
                        contentType={row.contentType}
                        content={row.content}
                        fileName={row.title}
                      />
                      <ViewContentAction
                        content={row.content}
                        contentType={row.contentType}
                      />
                    </>
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
