import React, { FC, useState } from 'react';
import TableCell from '@material-ui/core/TableCell';
import PublishIcon from '@material-ui/icons/Publish';
import { Tooltip } from '@material-ui/core';
import PublishDialog from './PublishDialog';
import { Versioning } from '../../model/Versioning';
import translationHelper from '../../helper/translationHelper';

interface Props {
  version: Versioning;
  onReloadPublications: () => void;
}

const PublicationItem: FC<Props> = ({ version, onReloadPublications }) => {
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
    <>
      <TableCell>
        {translationHelper.getTranslatedAggregate(version.aggregate)}
      </TableCell>
      <TableCell>{version.version}</TableCell>
      <TableCell align="right">
        <Tooltip title="Publiceren">
          <PublishIcon
            color="primary"
            style={{ cursor: 'pointer' }}
            onClick={() => setOpenPublishDialog(version)}
          />
        </Tooltip>
        {openPublishDialog &&
          openPublishDialog.aggregate === version.aggregate && (
            <PublishDialog
              dialogTitle={getDialogTitle(openPublishDialog)}
              dialogText={`Huidige versie: ${openPublishDialog.version}. Geef de nieuwe versie op:`}
              openDialog={openPublishDialog}
              setOpenDialog={setOpenPublishDialog}
              onSubmit={onReloadPublications}
            />
          )}
      </TableCell>
    </>
  );
};

export default PublicationItem;
