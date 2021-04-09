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
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { useHistory } from 'react-router-dom';
import regulationRepository, {
  Regulation,
} from '../firebase/database/regulationRepository';

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
  icon: {
    width: 35,
  },
});

const RegulationsTable: React.FC = () => {
  const [regulations, setRegulations] = React.useState<Regulation[]>([]);
  const classes = useStyles();
  const history = useHistory();

  React.useEffect(() => {
    regulationRepository
      .getRegulations()
      .then((result) =>
        setRegulations(result.sort((a, b) => a.pageIndex - b.pageIndex))
      );
  }, []);

  return (
    <div>
      <div style={{ overflow: 'hidden', marginTop: 10, marginBottom: 10 }}>
        <div style={{ float: 'left' }}>
          <Typography variant="h5">Regelgevingen beheer</Typography>
        </div>
        <div style={{ float: 'right' }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => history.push('/regulations/add')}
          >
            Pagina toevoegen
          </Button>
        </div>
      </div>
      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Hoofdstuk</TableCell>
              <TableCell>Titel</TableCell>
              <TableCell>Markering</TableCell>
              <TableCell>Index</TableCell>
              <TableCell>Illustratie</TableCell>
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
                <TableCell>{row.pageIndex}</TableCell>
                <TableCell>
                  <Icon>
                    <img className={classes.icon} src={`${row.iconFile}`} />
                  </Icon>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default RegulationsTable;
