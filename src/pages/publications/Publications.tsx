import React, { FC, useCallback, useEffect, useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
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

interface Props {
  title: string;
}

const Publications: FC<Props> = ({ title }) => {
  const [versions, setVersions] = useState<Versioning[] | null>(null);
  const { getSortedBooks } = useAppConfiguration();
  const { configuration, isMenuItem } = useCmsConfiguration();

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
        <Table>
          <TableHead>
            <TableRow style={{ backgroundColor: '#ddd' }} key="tableRow">
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
