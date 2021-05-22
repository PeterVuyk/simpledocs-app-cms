import React from 'react';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import PublishIcon from '@material-ui/icons/Publish';
import { Versioning } from '../../firebase/database/versioningRepository';
import PublishDialog from './PublishDialog';

interface Props {
  version: Versioning;
  reloadPublicationsHandle: () => void;
}

const Publications: React.FC<Props> = ({
  version,
  reloadPublicationsHandle,
}) => {
  const [
    openPublishDialog,
    setOpenPublishDialog,
  ] = React.useState<Versioning | null>(null);

  const getAggregate = (aggregate: string): string => {
    switch (aggregate) {
      case 'regulations':
        return 'regelgevingen';
      case 'decisionTree':
        return 'beslisboom';
      case 'breakingDistance':
        return 'remafstand';
      default:
        return 'onbekend';
    }
  };

  const getDialogTitle = (dialogVersion: Versioning): string => {
    return `${
      getAggregate(dialogVersion.aggregate).charAt(0).toUpperCase() +
      getAggregate(dialogVersion.aggregate).slice(1)
    } publiceren`;
  };

  return (
    <TableRow hover key={version.aggregate}>
      <TableCell>{getAggregate(version.aggregate)}</TableCell>
      <TableCell>{version.version}</TableCell>
      <TableCell align="right">
        <PublishIcon
          color="primary"
          style={{ cursor: 'pointer' }}
          onClick={() => setOpenPublishDialog(version)}
        />
        {openPublishDialog &&
          openPublishDialog.aggregate === version.aggregate && (
            <PublishDialog
              dialogTitle={getDialogTitle(openPublishDialog)}
              dialogText={`Huidige versie: ${openPublishDialog.version}. Geef de nieuwe versie op:`}
              openDialog={openPublishDialog}
              setOpenDialog={setOpenPublishDialog}
              onSubmit={reloadPublicationsHandle}
            />
          )}
      </TableCell>
    </TableRow>
  );
};

export default Publications;
