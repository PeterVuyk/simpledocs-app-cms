import React, { FC, useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import PageHeading from '../../layout/PageHeading';
import publishRepository from '../../firebase/database/publishRepository';
import PublicationItem from './PublicationItem';
import { Versioning } from '../../model/Versioning';
import LoadingSpinner from '../../components/LoadingSpinner';
import { DOCUMENTATION_PUBLICATIONS } from '../../model/DocumentationType';
import CreateVersionDialog from './CreateVersionDialog';
import RemoveVersionButton from './remove/RemoveVersionButton';

const useStyles = makeStyles({
  table: {
    width: '100%',
  },
  head: {
    backgroundColor: '#ddd',
  },
  button: {
    marginLeft: 8,
  },
});

interface Props {
  title: string;
}

const Publications: FC<Props> = ({ title }) => {
  const [versions, setVersions] = useState<Versioning[] | null>(null);
  const [createVersionDialog, setCreateVersionDialog] =
    useState<boolean>(false);

  const classes = useStyles();

  const handleReloadPublications = (): void => {
    publishRepository.getVersions().then((result) => setVersions(result));
  };

  useEffect(() => {
    handleReloadPublications();
  }, []);

  return (
    <>
      <PageHeading title={title} help={DOCUMENTATION_PUBLICATIONS}>
        <RemoveVersionButton
          onReloadPublications={handleReloadPublications}
          versions={versions ?? []}
        />
        <Button
          className={classes.button}
          variant="contained"
          color="primary"
          onClick={() => setCreateVersionDialog(true)}
        >
          Boek versie toevoegen
        </Button>
        {createVersionDialog && (
          <CreateVersionDialog
            openDialog={createVersionDialog}
            setOpenDialog={setCreateVersionDialog}
            onReloadPublications={handleReloadPublications}
          />
        )}
      </PageHeading>
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
            {versions !== null &&
              versions.map((row) => (
                <TableRow key={row.aggregate.toString()}>
                  <PublicationItem
                    version={row}
                    onReloadPublications={handleReloadPublications}
                  />
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      {versions === null && <LoadingSpinner />}
    </>
  );
};

export default Publications;
