import React, { FC, useCallback, useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import PageHeading from '../../layout/PageHeading';
import PublicationItem from './PublicationItem';
import { Versioning } from '../../model/Versioning';
import LoadingSpinner from '../../components/LoadingSpinner';
import { DOCUMENTATION_PUBLICATIONS } from '../../model/DocumentationType';
import useConfiguration from '../../configuration/useConfiguration';
import RemoveVersionButton from './RemoveVersionButton';
import CreateVersionButton from './CreateVersionButton';
import configurationRepository from '../../firebase/database/configurationRepository';
import { AGGREGATE_APP_CONFIGURATIONS } from '../../model/Aggregate';
import { AppConfigurations } from '../../model/AppConfigurations';

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

  const handleReloadPublications = useCallback(async (): Promise<void> => {
    const versioning = await configurationRepository
      .getConfigurations(AGGREGATE_APP_CONFIGURATIONS)
      .then((value) => value as AppConfigurations)
      .then((value) => value.versioning);
    const result = [];
    for (const [aggregate, versionInfo] of Object.entries(versioning)) {
      result.push({
        aggregate,
        isBookType: versionInfo.isBookType,
        version: versionInfo.version,
      });
    }
    for (const [aggregate, versionInfo] of Object.entries(
      configuration.versioning
    )) {
      result.push({
        aggregate,
        isBookType: false,
        version: versionInfo.version,
      });
    }
    setVersions(sortVersionOnIndex(result));
  }, [configuration, sortVersionOnIndex]);

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
        <CreateVersionButton
          onReloadPublications={handleReloadPublications}
          versions={versions ?? []}
        />
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
