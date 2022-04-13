import React, { FC, useState } from 'react';
import TableCell from '@mui/material/TableCell';
import PublishIcon from '@mui/icons-material/Publish';
import { Tooltip } from '@mui/material';
import Chip from '@mui/material/Chip';
import EditIcon from '@mui/icons-material/Edit';
import PublishDialog from './PublishDialog';
import { UPDATE_ON_STARTUP, Versioning } from '../../model/Versioning';
import useCmsConfiguration from '../../configuration/useCmsConfiguration';
import useAppConfiguration from '../../configuration/useAppConfiguration';

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
  const { getBookTitleByAggregate } = useAppConfiguration();
  const { getMenuItemTitleByAggregate } = useCmsConfiguration();

  const getDialogTitle = (dialogVersion: Versioning): string => {
    const title = dialogVersion.isBookType
      ? getBookTitleByAggregate(dialogVersion.aggregate)
      : getMenuItemTitleByAggregate(dialogVersion.aggregate);

    return title.charAt(0).toUpperCase() + title.slice(1);
  };

  const getUpdateMomentText = () => {
    if (!currentVersion.updateMoment) {
      return undefined;
    }
    return currentVersion.updateMoment === UPDATE_ON_STARTUP
      ? 'Voor het opstarten'
      : 'Na het opstarten';
  };

  return (
    <>
      <TableCell>
        {getDialogTitle(currentVersion)}
        {currentVersion.isBookType && <Chip label="Boek" variant="outlined" />}
        {currentVersion.isDraft && (
          <Chip label="Concept" variant="outlined" avatar={<EditIcon />} />
        )}
      </TableCell>
      <TableCell>{getUpdateMomentText()}</TableCell>
      <TableCell>{currentVersion.version}</TableCell>
      <TableCell align="right">
        <Tooltip disableInteractive title="Publiceren">
          <PublishIcon
            color="primary"
            style={{ cursor: 'pointer' }}
            onClick={() => setOpenPublishDialog(currentVersion)}
          />
        </Tooltip>
        {openPublishDialog &&
          openPublishDialog.aggregate === currentVersion.aggregate && (
            <PublishDialog
              onTranslation={getMenuItemTitleByAggregate}
              dialogTitle={`${getDialogTitle(openPublishDialog)} publiceren`}
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
