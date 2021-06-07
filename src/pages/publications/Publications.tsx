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
import publishRepository, {
  Versioning,
} from '../../firebase/database/publishRepository';
import PublicationItem from './PublicationItem';

const useStyles = makeStyles({
  table: {
    width: '100%',
  },
  head: {
    backgroundColor: '#ddd',
  },
});

const Publications: React.FC = () => {
  const [versions, setVersions] = React.useState<Versioning[]>([]);

  const classes = useStyles();

  const reloadPublicationsHandle = (): void => {
    publishRepository.getVersions().then((result) => setVersions(result));
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
                <strong>Huidige versie</strong>
              </TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {versions.map((row) => (
              <PublicationItem
                version={row}
                reloadPublicationsHandle={reloadPublicationsHandle}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default Publications;
