import React, { FC, useState } from 'react';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import PublishIcon from '@material-ui/icons/Publish';
import PublishDialog from './PublishDialog';
import { Versioning } from '../../model/Versioning';
import translationHelper from '../../helper/translationHelper';

interface Props {
  version: Versioning;
  reloadPublicationsHandle: () => void;
}

const PublicationItem: FC<Props> = ({ version, reloadPublicationsHandle }) => {
  const [openPublishDialog, setOpenPublishDialog] = useState<Versioning | null>(
    null
  );

  const getDialogTitle = (dialogVersion: Versioning): string => {
    return `${
      translationHelper
        .getTranslatedAggregate(dialogVersion.aggregate)
        .charAt(0)
        .toUpperCase() +
      translationHelper.getTranslatedAggregate(dialogVersion.aggregate).slice(1)
    } publiceren`;
  };

  return (
    <TableRow hover key={version.aggregate}>
      <TableCell>
        {translationHelper.getTranslatedAggregate(version.aggregate)}
      </TableCell>
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

export default PublicationItem;
