import React, { FC } from 'react';
import TableCell from '@material-ui/core/TableCell';
import { StandalonePage } from '../../model/standalonePages/StandalonePage';
import ViewContentAction from '../../components/ItemAction/ViewContentAction';
import EditItemAction from '../../components/ItemAction/EditItemAction';
import { AGGREGATE_STANDALONE_PAGES } from '../../model/Aggregate';
import useCmsConfiguration from '../../configuration/useCmsConfiguration';
import { STANDALONE_PAGE_TYPE_DISCLAIMER } from '../../model/standalonePages/StandalonePageType';
import { EDIT_STATUS_DRAFT, EditStatus } from '../../model/EditStatus';
import standalonePagesRepository from '../../firebase/database/standalonePagesRepository';
import logger from '../../helper/logger';
import { useAppDispatch } from '../../redux/hooks';
import { notify } from '../../redux/slice/notificationSlice';
import DeleteItemAction from '../../components/ItemAction/DeleteItemAction';
import DiffStandalonePageAction from '../../components/ItemAction/diffAction/diffStandalonePagesAction/DiffStandalonePageAction';
import useAppConfiguration from '../../configuration/useAppConfiguration';

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
  const appConfiguration = useAppConfiguration().configuration;
  const dispatch = useAppDispatch();

  const getTextStyle = appConfiguration.drawer.enabledStandalonePagesTypes[
    standalonePage.standalonePageType
  ]
    ? {}
    : { textDecoration: 'line-through' };

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
      <TableCell style={getTextStyle}>{getTranslatedPageType()}</TableCell>
      <TableCell style={getTextStyle}>{standalonePage.title}</TableCell>
      <TableCell style={getTextStyle}>{standalonePage.contentType}</TableCell>
      <TableCell align="right">
        {standalonePage.isDraft && <DiffStandalonePageAction />}
        {!standalonePage.markedForDeletion && (
          <EditItemAction
            urlSlug={`/${configuration.menu.menuItems[AGGREGATE_STANDALONE_PAGES].urlSlug}/${standalonePage.id}`}
          />
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
