import React, { FC, useState } from 'react';
import { BookSetting } from '../../model/books/BookSetting';
import EditItemAction from '../../components/ItemAction/EditItemAction';
import EditBookSettingsDialog from './EditBookSettingsDialog';
import DeleteItemAction from '../../components/ItemAction/DeleteItemAction';
import { AppConfigurations } from '../../model/configurations/AppConfigurations';
import clone from '../../helper/object/clone';
import omit from '../../helper/object/omit';
import configurationRepository from '../../firebase/database/configurationRepository';
import { notify } from '../../redux/slice/notificationSlice';
import logger from '../../helper/logger';
import { useAppDispatch } from '../../redux/hooks';

interface Props {
  bookSetting: BookSetting;
  appConfigurations: AppConfigurations;
}

const BookManagementListItemActions: FC<Props> = ({
  bookSetting,
  appConfigurations,
}) => {
  const [showEditDialog, setShowEditDialog] = useState<boolean>(false);
  const dispatch = useAppDispatch();

  const handleDelete = (bookType: string) => {
    const updatedConfiguration = clone(appConfigurations);
    updatedConfiguration.versioning = omit(updatedConfiguration.versioning, [
      bookType,
    ]);
    updatedConfiguration[bookSetting.tab].bookTypes = updatedConfiguration[
      bookSetting.tab
    ].bookTypes.filter(
      // @ts-ignore
      (value) => value.bookType !== bookType
    );

    return configurationRepository
      .updateAppConfiguration(updatedConfiguration)
      .then(() => {
        dispatch(
          notify({
            notificationType: 'success',
            notificationOpen: true,
            notificationMessage:
              "Het boek met de bijbehorende pagina's zijn verwijderd.",
          })
        );
      })
      .catch((error) => {
        logger.errorWithReason(
          'Failed removing book in BookManagementListItemActions.handleSubmitForm',
          error
        );
        dispatch(
          notify({
            notificationType: 'error',
            notificationOpen: true,
            notificationMessage: `Het verwijderen van het boek met bijbehorende pagina's is mislukt.`,
          })
        );
      });
  };

  return (
    <>
      <EditItemAction onClick={() => setShowEditDialog(true)} />
      {showEditDialog && (
        <EditBookSettingsDialog
          bookSetting={bookSetting}
          oncloseDialog={() => setShowEditDialog(false)}
        />
      )}
      <DeleteItemAction
        itemId={bookSetting.bookType}
        title="Boek definitief verwijderen"
        onSubmit={handleDelete}
        dialogText="Weet je zeker dat je dit boek met de daarbij behorende pagina's wilt verwijderen? Let op: Dit kan naderhand niet ongedaan gemaakt worden."
      />
    </>
  );
};

export default BookManagementListItemActions;
