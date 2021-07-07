import React, { FC, useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import PageHeading from '../../layout/PageHeading';
import publishRepository from '../../firebase/database/publishRepository';
import PublicationItem from './PublicationItem';
import { Versioning } from '../../model/Versioning';

const useStyles = makeStyles({
  table: {
    width: '100%',
  },
  head: {
    backgroundColor: '#ddd',
  },
});

const Publications: FC = () => {
  const [versions, setVersions] = useState<Versioning[]>([]);

  const classes = useStyles();

  const reloadPublicationsHandle = (): void => {
    publishRepository.getVersions().then((result) => setVersions(result));
  };

  useEffect(() => {
    reloadPublicationsHandle();
  }, []);

  return (
    <>
      <PageHeading title="Publiceren" />
      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="publications table">
          <TableHead>
            <TableRow className={classes.head} key="tableRow">
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
              <TableRow hover key={row.aggregate.toString()}>
                <PublicationItem
                  version={row}
                  reloadPublicationsHandle={reloadPublicationsHandle}
                />
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default Publications;
