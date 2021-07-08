import React, { FC } from 'react';
import TableContainer from '@material-ui/core/TableContainer';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';
import { makeStyles } from '@material-ui/core/styles';
import { CalculationInfo } from '../../model/CalculationInfo';
import ViewHTMLFileAction from '../../components/ItemAction/ViewHTMLFileAction';

const useStyles = makeStyles({
  table: {
    width: '100%',
  },
  button: {
    marginLeft: 8,
  },
  head: {
    backgroundColor: '#ddd',
  },
});

interface Props {
  calculationInfo: CalculationInfo;
}

const CalculationTableView: FC<Props> = ({ calculationInfo }) => {
  const classes = useStyles();
  return (
    <>
      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow className={classes.head}>
              <TableCell />
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
                <strong>Artikel knop tekst</strong>
              </TableCell>
              <TableCell>
                <strong>Verwijzing hoofdstuk</strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {calculationInfo && (
              <>
                <TableRow key="1">
                  <TableCell className={classes.head} />
                  <TableCell>{calculationInfo.listIndex}</TableCell>
                  <TableCell>{calculationInfo.title}</TableCell>
                  <TableCell>
                    <img
                      style={{ width: 30 }}
                      src={`${calculationInfo.iconFile}`}
                    />
                  </TableCell>
                  <TableCell>{calculationInfo.explanation}</TableCell>
                  <TableCell>{calculationInfo.articleButtonText}</TableCell>
                  <TableCell>
                    <ViewHTMLFileAction htmlFile={calculationInfo.htmlFile} />
                  </TableCell>
                </TableRow>
                <TableRow key="2">
                  <TableCell className={classes.head}>
                    <strong>Stopafstand afbeelding</strong>
                    <br />
                    Beeldverhouding app: 4 / 3
                  </TableCell>
                  <TableCell colSpan={6}>
                    <img
                      style={{ width: 600 }}
                      src={`${calculationInfo.calculationImage}`}
                    />
                  </TableCell>
                </TableRow>
              </>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default CalculationTableView;
