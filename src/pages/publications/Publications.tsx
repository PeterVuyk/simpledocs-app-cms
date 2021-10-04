import React, { FC, useCallback, useEffect, useState } from 'react';
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
import useConfiguration from '../../configuration/useConfiguration';
import RemoveVersionButton from './RemoveVersionButton';

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
  const { configuration, isBookType, isMenuItem } = useConfiguration();

  const classes = useStyles();

  const sortVersionOnIndex = useCallback(
    (versioning: Versioning[]): Versioning[] => {
      const books = versioning
        .filter((value) => value.isBookType)
        .filter((value) => isBookType(value.aggregate))
        .sort((a, b) => {
          return (
            configuration.books.bookItems[a.aggregate].navigationIndex -
            configuration.books.bookItems[b.aggregate].navigationIndex
          );
        });
      const menuItems = versioning
        .filter((value) => !value.isBookType)
        .filter((value) => isMenuItem(value.aggregate))
        .sort((a, b) => {
          return (
            configuration.menu.menuItems[a.aggregate].navigationIndex -
            configuration.menu.menuItems[b.aggregate].navigationIndex
          );
        });

      return [...books, ...menuItems];
    },
    [
      configuration.books.bookItems,
      configuration.menu.menuItems,
      isBookType,
      isMenuItem,
    ]
  );

  const handleReloadPublications = useCallback((): void => {
    publishRepository
      .getVersions()
      .then(sortVersionOnIndex)
      .then((result) => setVersions(result));
  }, [sortVersionOnIndex]);

  useEffect(() => {
    handleReloadPublications();
  }, [handleReloadPublications]);

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
            versions={versions ?? []}
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
                    currentVersion={row}
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
