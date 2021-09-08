import React, { FC } from 'react';
import TableContainer from '@material-ui/core/TableContainer';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { CalculationInfo } from '../../model/CalculationInfo';
import ViewContentAction from '../../components/ItemAction/ViewContentAction';

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
  calculationInfo: CalculationInfo;
}

const CalculationTableView: FC<Props> = ({ calculationInfo }) => {
  const classes = useStyles();
  return (
    <div className={classes.container}>
      <Typography
        style={{ fontWeight: 'bold' }}
        variant="body1"
        color="textPrimary"
      >
        {calculationInfo.title}
      </Typography>
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
                <TableRow key={calculationInfo.title + 1}>
                  <TableCell className={classes.head} />
                  <TableCell>{calculationInfo.listIndex}</TableCell>
                  <TableCell>{calculationInfo.title}</TableCell>
                  <TableCell>
                    <img
                      alt="illustratie"
                      style={{ width: 30 }}
                      src={`${calculationInfo.iconFile}`}
                    />
                  </TableCell>
                  <TableCell>{calculationInfo.explanation}</TableCell>
                  <TableCell>{calculationInfo.articleButtonText}</TableCell>
                  <TableCell>
                    <ViewContentAction
                      content={calculationInfo.content}
                      contentType={calculationInfo.contentType}
                    />
                  </TableCell>
                </TableRow>
                <TableRow key={calculationInfo.title + 2}>
                  <TableCell className={classes.head}>
                    <strong>Afbeelding</strong>
                    <br />
                    Beeldverhouding: 4 / 3
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
    </div>
  );
};

export default CalculationTableView;
