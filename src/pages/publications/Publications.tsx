import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import PageHeading from '../../layout/PageHeading';
import versioningRepository, {
  Versioning,
} from '../../firebase/database/versioningRepository';

const useStyles = makeStyles({
  table: {
    width: '100%',
  },
  head: {
    backgroundColor: '#ddd',
  },
});

const Publications: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [versions, setVersions] = React.useState<Versioning[]>([]);
  const classes = useStyles();

  const reloadPublicationsHandle = (): void => {
    versioningRepository
      .getVersions()
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      .then((result) => setVersions(result));
  };

  React.useEffect(() => {
    reloadPublicationsHandle();
  }, []);

  return (
    <>
      <PageHeading title="Publicatie beheer" />
      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow className={classes.head}>
              <TableCell>
                <strong>Onderdeel</strong>
              </TableCell>
              <TableCell>
                <strong>Uitgebrachte versie</strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {versions.map((row) => (
              <TableRow hover key={row.aggregate}>
                <TableCell>{row.aggregate}</TableCell>
                <TableCell>{row.version}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default Publications;
