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
import useCmsConfiguration from '../../configuration/useCmsConfiguration';
import configurationRepository from '../../firebase/database/configurationRepository';
import { AGGREGATE_APP_CONFIGURATIONS } from '../../model/Aggregate';
import { AppConfigurations } from '../../model/configurations/AppConfigurations';
import useAppConfiguration from '../../configuration/useAppConfiguration';

const useStyles = makeStyles({
  table: {
    width: '100%',
  },
  head: {
    backgroundColor: '#ddd',
  },
});

interface Props {
  title: string;
}

const Publications: FC<Props> = ({ title }) => {
  const [versions, setVersions] = useState<Versioning[] | null>(null);
  const { getSortedBooks } = useAppConfiguration();
  const { configuration, isMenuItem } = useCmsConfiguration();

  const classes = useStyles();

  const sortVersionOnIndex = useCallback(
    (versioning: Versioning[]): Versioning[] => {
      return versioning
        .filter((value) => !value.isBookType)
        .filter((value) => isMenuItem(value.aggregate))
        .sort((a, b) => {
          return (
            configuration.menu.menuItems[a.aggregate].navigationIndex -
            configuration.menu.menuItems[b.aggregate].navigationIndex
          );
        });
    },
    [configuration.menu.menuItems, isMenuItem]
  );

  const getSortedBookVersioning = useCallback(
    (appConfigurations: AppConfigurations): Versioning[] => {
      const bookTypes = getSortedBooks().map((value) => value.bookType);
      return bookTypes.map((value) => {
        return {
          ...appConfigurations.versioning[value],
          aggregate: value,
        } as Versioning;
      });
    },
    [getSortedBooks]
  );

  const handleReloadPublications = useCallback(async (): Promise<void> => {
    const appConfigurations = await configurationRepository
      .getConfigurations(AGGREGATE_APP_CONFIGURATIONS)
      .then((value) => value as AppConfigurations);
    const result = [];

    for (const [aggregate, versionInfo] of Object.entries(
      appConfigurations.versioning
    )) {
      if (versionInfo.isBookType) {
        continue;
      }
      result.push({
        aggregate,
        isBookType: versionInfo.isBookType,
        version: versionInfo.version,
        isDraft: versionInfo.isDraft ?? false,
        updateMoment: versionInfo.updateMoment,
      });
    }
    for (const [aggregate, versionInfo] of Object.entries(
      configuration.versioning
    )) {
      result.push({
        aggregate,
        isBookType: false,
        version: versionInfo.version,
        isDraft: false,
        updateMoment: versionInfo.updateMoment,
      });
    }
    setVersions([
      ...getSortedBookVersioning(appConfigurations),
      ...sortVersionOnIndex(result),
    ]);
  }, [configuration.versioning, getSortedBookVersioning, sortVersionOnIndex]);

  useEffect(() => {
    handleReloadPublications();
  }, [handleReloadPublications]);

  return (
    <>
      <PageHeading title={title} help={DOCUMENTATION_PUBLICATIONS} />
      <TableContainer component={Paper}>
        <Table className={classes.table}>
          <TableHead>
            <TableRow className={classes.head} key="tableRow">
              <TableCell>Onderdeel</TableCell>
              <TableCell>Update moment</TableCell>
              <TableCell>Huidige versie</TableCell>
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
