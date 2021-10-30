import React, { FC, ReactNode } from 'react';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogContent from '@material-ui/core/DialogContent';
import { MenuListItem } from '../../components/buttonMenuDialog/model/MenuListItem';
import { MenuListDialog } from '../../components/buttonMenuDialog/model/MenuListDialog';
import MenuDialogButton from '../../components/buttonMenuDialog/MenuDialogButton';
import { Versioning } from '../../model/Versioning';
import useConfiguration from '../../configuration/useConfiguration';
import publishRepository from '../../firebase/database/publishRepository';
import logger from '../../helper/logger';
import { useAppDispatch } from '../../redux/hooks';
import { notify } from '../../redux/slice/notificationSlice';

interface Props {
  onReloadPublications: () => void;
  versions: Versioning[];
}

const CreateVersionButton: FC<Props> = ({ versions, onReloadPublications }) => {
  const { configuration, getTitleByAggregate } = useConfiguration();
  const dispatch = useAppDispatch();

  const menuListItems = (): MenuListItem[] => {
    const bookTypesWithoutVersion = Object.keys(
      configuration.books.bookItems
    ).filter(
      (bookType) => !versions.find((version) => version.aggregate === bookType)
    );
    return bookTypesWithoutVersion.map((bookType) => {
      return {
        key: bookType,
        value: configuration.books.bookItems[bookType].title,
      } as MenuListItem;
    });
  };

  const dialogContent = (key: string): ReactNode => {
    return (
      <DialogContent>
        <DialogContentText
          style={{ whiteSpace: 'pre-line' }}
          id="alert-dialog-slide-description"
        >
          {`Weet je zeker dat je een versie voor het boek '${getTitleByAggregate(
            key
          )}' wilt toevoegen?`}
        </DialogContentText>
      </DialogContent>
    );
  };

  const getNextVersion = (): string => {
    const currentDate = new Date();
    return `${currentDate.getFullYear()}.${currentDate.getMonth() + 1}.1`;
  };

  const onSubmit = (key: string): string => {
    const version = versions.find((value) => value.aggregate === key);
    if (version) {
      return 'Een versie van het opgegeven boek bestaat al en kan niet opnieuw toegevoegd worden.';
    }
    publishRepository
      .addVersion({
        version: getNextVersion(),
        aggregate: key,
        isBookType: true,
      })
      .then(() => {
        onReloadPublications();
        dispatch(
          notify({
            notificationType: 'success',
            notificationOpen: true,
            notificationMessage: 'De nieuwe versie is toegevoegd',
          })
        );
      })
      .catch(() => {
        logger.error('handleSubmit CreateVersionButton failed');
      });
    return '';
  };

  const menuListDialog = (): MenuListDialog => {
    return {
      dialogTitle: 'Nieuwe versie toevoegen',
      closeButtonText: 'Annuleren',
      submitButtonText: 'Toevoegen',
      onSubmit,
      dialogContent,
    };
  };

  return (
    <MenuDialogButton
      buttonColor="primary"
      buttonText="Boek toevoegen"
      menuListItems={menuListItems()}
      menuListDialog={menuListDialog()}
    />
  );
};

export default CreateVersionButton;
