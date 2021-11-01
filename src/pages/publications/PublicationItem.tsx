import React, { FC, useState } from 'react';
import TableCell from '@material-ui/core/TableCell';
import PublishIcon from '@material-ui/icons/Publish';
import { Tooltip } from '@material-ui/core';
import Chip from '@material-ui/core/Chip';
import PublishDialog from './PublishDialog';
import { Versioning } from '../../model/Versioning';
import useCmsConfiguration from '../../configuration/useCmsConfiguration';

interface Props {
  currentVersion: Versioning;
  onReloadPublications: () => void;
}

const PublicationItem: FC<Props> = ({
  currentVersion,
  onReloadPublications,
}) => {
  const [openPublishDialog, setOpenPublishDialog] = useState<Versioning | null>(
    null
  );
  const { getTitleByAggregate } = useCmsConfiguration();

  const getDialogTitle = (dialogVersion: Versioning): string => {
    const title = getTitleByAggregate(dialogVersion.aggregate);
    return `${title.charAt(0).toUpperCase() + title.slice(1)} publiceren`;
  };

  return (
    <>
      <TableCell>
        {getTitleByAggregate(currentVersion.aggregate)}&nbsp;
        {currentVersion.isBookType && <Chip label="Boek" variant="outlined" />}
      </TableCell>
      <TableCell>{currentVersion.version}</TableCell>
      <TableCell align="right">
        <Tooltip title="Publiceren">
          <PublishIcon
            color="primary"
            style={{ cursor: 'pointer' }}
            onClick={() => setOpenPublishDialog(currentVersion)}
          />
        </Tooltip>
        {openPublishDialog &&
          openPublishDialog.aggregate === currentVersion.aggregate && (
            <PublishDialog
              onTranslation={getTitleByAggregate}
              dialogTitle={getDialogTitle(openPublishDialog)}
              dialogText={`Huidige versie: ${openPublishDialog.version}, nieuwe versie: `}
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
