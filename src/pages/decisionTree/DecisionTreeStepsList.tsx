import React, { FC } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { EDIT_STATUS_DRAFT, EditStatus } from '../../model/EditStatus';
import DownloadContentAction from '../../components/ItemAction/DownloadContentAction';
import ViewContentAction from '../../components/ItemAction/ViewContentAction';
import { DecisionTree } from '../../model/DecisionTree/DecisionTree';

interface Props {
  decisionTrees: DecisionTree[] | null;
  editStatus: EditStatus;
}

const DecisionTreeStepsList: FC<Props> = ({ decisionTrees, editStatus }) => {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow style={{ backgroundColor: '#ddd' }}>
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
