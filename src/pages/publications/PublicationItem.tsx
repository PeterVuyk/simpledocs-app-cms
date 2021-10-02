import React, { FC, useState } from 'react';
import TableCell from '@material-ui/core/TableCell';
import PublishIcon from '@material-ui/icons/Publish';
import { Tooltip } from '@material-ui/core';
import PublishDialog from './PublishDialog';
import { Versioning } from '../../model/Versioning';
import useConfiguration from '../../configuration/useConfiguration';

interface Props {
  version: Versioning;
  onReloadPublications: () => void;
}

const PublicationItem: FC<Props> = ({ version, onReloadPublications }) => {
  const [openPublishDialog, setOpenPublishDialog] = useState<Versioning | null>(
    null
  );
  const { configuration, isBookType, isMenuAggregate } = useConfiguration();

  const handleTranslatedAggregate = (aggregate: string): string => {
    if (isBookType(aggregate)) {
      return configuration.books.bookItems[aggregate].title;
    }
    if (isMenuAggregate(aggregate)) {
      // @ts-ignore
      return configuration.menu.menuItems[aggregate].title;
    }
    return 'Onbekend';
  };

  const getDialogTitle = (dialogVersion: Versioning): string => {
    const title = handleTranslatedAggregate(dialogVersion.aggregate);
    return `${title.charAt(0).toUpperCase() + title.slice(1)} publiceren`;
  };

  return (
    <>
      <TableCell>{handleTranslatedAggregate(version.aggregate)}</TableCell>
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
              onTranslation={handleTranslatedAggregate}
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
