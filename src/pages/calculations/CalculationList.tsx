import React, { FC } from 'react';
import TableContainer from '@mui/material/TableContainer';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import { Box } from '@mui/material';
import { CalculationInfo } from '../../model/calculations/CalculationInfo';
import CalculationListItem from './CalculationListItem';

interface Props {
  calculationInfos: CalculationInfo[];
}

const CalculationList: FC<Props> = ({ calculationInfos }) => {
  return (
    <Box sx={{ marginBottom: (theme) => theme.spacing(2) }}>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow style={{ backgroundColor: '#ddd' }}>
              <TableCell>
                <strong>Soort berekening</strong>
              </TableCell>
              <TableCell>
                <strong>Titel</strong>
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
    </Box>
  );
};

export default CalculationList;
