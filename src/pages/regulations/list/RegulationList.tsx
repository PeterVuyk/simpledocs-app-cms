import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { Regulation } from '../../../firebase/database/regulationRepository';
import RegulationListItem from './RegulationListItem';

const useStyles = makeStyles({
  table: {
    width: '100%',
  },
  head: {
    backgroundColor: '#ddd',
  },
});

interface Props {
  regulations: Regulation[];
  loadRegulationsHandle: () => void;
  editStatus: 'draft' | 'published';
}

const RegulationList: React.FC<Props> = ({
  regulations,
  loadRegulationsHandle,
  editStatus,
}) => {
  const classes = useStyles();

  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow className={classes.head}>
            <TableCell>
              <strong>Hoofdstuk</strong>
            </TableCell>
            <TableCell>
              <strong>Titel</strong>
            </TableCell>
            <TableCell>
              <strong>Markering</strong>
            </TableCell>
            <TableCell>
              <strong>Index</strong>
            </TableCell>
            <TableCell>
              <strong>Illustratie</strong>
            </TableCell>
            <TableCell />
          </TableRow>
        </TableHead>
        <TableBody>
          {regulations.map((row) => (
            <TableRow
              style={{
                backgroundColor:
                  editStatus === 'draft' && row?.markedForDeletion
                    ? '#fcb3b3'
                    : '#fff',
              }}
              hover
              key={row.chapter}
            >
              <RegulationListItem
                editStatus={editStatus}
                regulation={row}
                loadRegulationsHandle={loadRegulationsHandle}
              />
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default RegulationList;
