import React, { FC } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { EDIT_STATUS_DRAFT, EditStatus } from '../../model/EditStatus';
import DownloadContentAction from '../../components/ItemAction/DownloadContentAction';
import ViewContentAction from '../../components/ItemAction/ViewContentAction';
import { DecisionTree } from '../../model/DecisionTree/DecisionTree';

const useStyles = makeStyles({
  table: {
    width: '100%',
  },
  head: {
    backgroundColor: '#ddd',
  },
});

interface Props {
  decisionTrees: DecisionTree[] | null;
  editStatus: EditStatus;
}

const DecisionTreeStepsList: FC<Props> = ({ decisionTrees, editStatus }) => {
  const classes = useStyles();

  return (
    <TableContainer component={Paper}>
      <Table className={classes.table}>
        <TableHead>
          <TableRow className={classes.head}>
            <TableCell>
              <strong>Titel</strong>
            </TableCell>
            <TableCell>
              <strong>ID</strong>
              <br />
              id*
            </TableCell>
            <TableCell>
              <strong>Label</strong>
              <br />
              label*
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
          </TableRow>
        </TableHead>
        <TableBody>
          {decisionTrees !== null && decisionTrees.length === 0 && (
            <TableRow key="no-result">
              <TableCell component="th" scope="row" colSpan={7}>
                Geen resultaten.
              </TableCell>
            </TableRow>
          )}
          {decisionTrees !== null &&
            decisionTrees.map((tree) => {
              return tree.steps.map((step) => (
                <TableRow
                  key={step.id + tree.title + tree?.markedForDeletion}
                  style={{
                    backgroundColor: tree.markedForDeletion
                      ? '#FCC1C1B5'
                      : '#fff',
                  }}
                >
                  <TableCell component="th" scope="row">
                    {tree.title}&nbsp;
                  </TableCell>
                  <TableCell>{step.id}</TableCell>
                  <TableCell>{step.label}</TableCell>
                  <TableCell>{step.parentId}</TableCell>
                  <TableCell>{step.lineLabel}</TableCell>
                  <TableCell>
                    {editStatus === EDIT_STATUS_DRAFT && step.contentId}&nbsp;
                    {step.content && step.contentType && (
                      <>
                        <DownloadContentAction
                          contentType={step.contentType}
                          content={step.content}
                          fileName={tree.title}
                        />
                        <ViewContentAction
                          content={step.content}
                          contentType={step.contentType}
                        />
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ));
            })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default DecisionTreeStepsList;
