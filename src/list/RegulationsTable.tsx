import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Icon from '@material-ui/core/Icon';
import collectRegulations, {
  Regulation,
} from '../firebase/database/regulations';

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
  icon: {
    width: 35,
  },
});

export default function RegulationsTable(): JSX.Element {
  const [regulations, setRegulations] = React.useState<Regulation[]>([]);
  const classes = useStyles();

  React.useEffect(() => {
    collectRegulations
      .getRegulations()
      .then((result) =>
        setRegulations(result.sort((a, b) => a.page_index - b.page_index))
      );
  }, []);

  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Hoofdstuk</TableCell>
            <TableCell>Titel</TableCell>
            <TableCell>Level</TableCell>
            <TableCell>Index</TableCell>
            <TableCell>Icoon</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {regulations.map((row) => (
            <TableRow key={row.title}>
              <TableCell component="th" scope="row">
                {row.chapter}
              </TableCell>
              <TableCell>{row.title}</TableCell>
              <TableCell>{row.level}</TableCell>
              <TableCell>{row.page_index}</TableCell>
              <TableCell>
                <Icon>
                  <img
                    className={classes.icon}
                    src={`data:image/png;base64,${row.icon}`}
                  />
                </Icon>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
