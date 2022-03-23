import React, { FC } from 'react';
import TableCell from '@material-ui/core/TableCell';
import { Tooltip } from '@material-ui/core';
import RestoreFromTrashTwoToneIcon from '@material-ui/icons/RestoreFromTrashTwoTone';
import DeleteTwoToneIcon from '@material-ui/icons/DeleteTwoTone';
import { StandalonePage } from '../../model/standalonePages/StandalonePage';
import ViewContentAction from '../../components/ItemAction/ViewContentAction';
import EditItemAction from '../../components/ItemAction/EditItemAction';
import { AGGREGATE_STANDALONE_PAGES } from '../../model/Aggregate';
import useCmsConfiguration from '../../configuration/useCmsConfiguration';
import DisablePageToggle from './DisablePageToggle';
import { STANDALONE_PAGE_TYPE_DISCLAIMER } from '../../model/standalonePages/StandalonePageType';
import { EDIT_STATUS_DRAFT, EditStatus } from '../../model/EditStatus';
import standalonePagesRepository from '../../firebase/database/standalonePagesRepository';
import logger from '../../helper/logger';
import { useAppDispatch } from '../../redux/hooks';
import { notify } from '../../redux/slice/notificationSlice';
import DeleteItemAction from '../../components/ItemAction/DeleteItemAction';

interface Props {
  standalonePage: StandalonePage;
  onLoadPages: () => Promise<void>;
  editStatus: EditStatus;
}

const StandalonePagesRowItem: FC<Props> = ({
  standalonePage,
  onLoadPages,
  editStatus,
}) => {
  const { configuration } = useCmsConfiguration();
  const dispatch = useAppDispatch();

  const getTextColor = standalonePage.isDisabled ? { color: '#ddd' } : {};

  const getTranslatedPageType = () => {
    switch (standalonePage.standalonePageType) {
      case STANDALONE_PAGE_TYPE_DISCLAIMER:
        return 'Disclaimer';
      default:
        return 'Onbekend';
    }
  };

  const handleRemoveDraft = (): Promise<void> => {
    return standalonePagesRepository
      .removeDraft(standalonePage.id)
      .then(onLoadPages)
      .catch((reason) => {
        logger.errorWithReason(
          `Failed to remove standalone page draft ${standalonePage.standalonePageType}`,
          reason
        );
        dispatch(
          notify({
            notificationOpen: true,
            notificationType: 'error',
            notificationMessage: 'Het verwijderen van het concept is mislukt',
          })
        );
      });
  };

  return (
    <>
      <TableCell style={getTextColor}>{getTranslatedPageType()}</TableCell>
      <TableCell style={getTextColor}>{standalonePage.title}</TableCell>
      <TableCell style={getTextColor}>{standalonePage.contentType}</TableCell>
      <TableCell align="right">
        {!standalonePage.markedForDeletion && (
          <>
            <DisablePageToggle
              standalonePage={standalonePage}
              onLoadPages={onLoadPages}
            />
            <EditItemAction
              urlSlug={`/${configuration.menu.menuItems[AGGREGATE_STANDALONE_PAGES].urlSlug}/${standalonePage.id}`}
            />
          </>
        )}
        <ViewContentAction
          content={standalonePage.content}
          contentType={standalonePage.contentType}
        />
        {editStatus === EDIT_STATUS_DRAFT && standalonePage.isDraft && (
          <DeleteItemAction
            title="Weet je zeker dat je het concept wilt verwijderen?"
            dialogText={`Pagina: ${getTranslatedPageType()}\nTitel: ${
              standalonePage.title
            }`}
            onSubmit={handleRemoveDraft}
            itemId={standalonePage.id}
          />
        )}
      </TableCell>
    </>
  );
};

export default StandalonePagesRowItem;
