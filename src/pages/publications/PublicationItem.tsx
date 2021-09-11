import React, { FC, useState } from 'react';
import TableCell from '@material-ui/core/TableCell';
import PublishIcon from '@material-ui/icons/Publish';
import { Tooltip } from '@material-ui/core';
import PublishDialog from './PublishDialog';
import { Versioning } from '../../model/Versioning';
import navigationConfig from '../../navigation/navigationConfig.json';
import { NavigationConfig } from '../../model/NavigationConfig';
import { isBookType } from '../../model/BookType';

interface Props {
  version: Versioning;
  onReloadPublications: () => void;
}

const PublicationItem: FC<Props> = ({ version, onReloadPublications }) => {
  const [openPublishDialog, setOpenPublishDialog] = useState<Versioning | null>(
    null
  );
  const handleTranslatedAggregate = (aggregate: string): string => {
    const configs = navigationConfig as NavigationConfig;
    if (isBookType(aggregate)) {
      return configs.books.bookItems[aggregate].title;
    }
    if (Object.keys(configs.menu.menuItems).includes(aggregate)) {
      // @ts-ignore
      return configs.menu.menuItems[aggregate].title;
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
