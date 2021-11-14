import React, { FC } from 'react';
import TableContainer from '@material-ui/core/TableContainer';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';
import { makeStyles } from '@material-ui/core/styles';
import { CalculationInfo } from '../../model/calculations/CalculationInfo';
import CalculationListItem from './CalculationListItem';

const useStyles = makeStyles((theme) => ({
  container: {
    marginBottom: theme.spacing(2),
  },
  table: {
    width: '100%',
  },
  button: {
    marginLeft: 8,
  },
  head: {
    backgroundColor: '#ddd',
  },
}));

interface Props {
  calculationInfos: CalculationInfo[];
}

const CalculationList: FC<Props> = ({ calculationInfos }) => {
  const classes = useStyles();
  return (
    <div className={classes.container}>
      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow className={classes.head}>
              <TableCell>
                <strong>Soort berekening</strong>
              </TableCell>
              <TableCell>
                <strong>Lijst index</strong>
              </TableCell>
              <TableCell>
                <strong>Titel</strong>
              </TableCell>
              <TableCell>
                <strong>Illustratie</strong>
              </TableCell>
              <TableCell>
                <strong>Toelichting</strong>
              </TableCell>
              <TableCell>
                <strong>Inhoudstype</strong>
              </TableCell>
              <TableCell>
                <strong>Weergave</strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {calculationInfos &&
              calculationInfos.map((row) => (
                <TableRow key={row.calculationType.toString()}>
                  <CalculationListItem calculationInfo={row} />
                </TableRow>
              ))}
            {calculationInfos && calculationInfos.length === 0 && (
              <TableRow key="no-result">
                <TableCell component="th" scope="row" colSpan={8}>
                  Geen resultaten.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default CalculationList;
