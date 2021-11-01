import React, { FC, ReactNode, useCallback } from 'react';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogContent from '@material-ui/core/DialogContent';
import { MenuListItem } from '../../components/buttonMenuDialog/model/MenuListItem';
import { MenuListDialog } from '../../components/buttonMenuDialog/model/MenuListDialog';
import MenuDialogButton from '../../components/buttonMenuDialog/MenuDialogButton';
import { Versioning } from '../../model/Versioning';
import useCmsConfiguration from '../../configuration/useCmsConfiguration';
import publishRepository from '../../firebase/database/publishRepository';
import logger from '../../helper/logger';
import { useAppDispatch } from '../../redux/hooks';
import { notify } from '../../redux/slice/notificationSlice';

interface Props {
  onReloadPublications: () => void;
  versions: Versioning[];
}

const RemoveVersionButton: FC<Props> = ({ versions, onReloadPublications }) => {
  const { getTitleByAggregate } = useCmsConfiguration();
  const dispatch = useAppDispatch();

  const menuListItems = useCallback((): MenuListItem[] => {
    return versions
      .filter((value) => value.isBookType)
      .map((value) => {
        return {
          key: value.aggregate,
          value: getTitleByAggregate(value.aggregate),
        };
      });
  }, [getTitleByAggregate, versions]);

  const dialogContent = (key: string): ReactNode => {
    return (
      <DialogContent>
        <DialogContentText
          style={{ whiteSpace: 'pre-line' }}
          id="alert-dialog-slide-description"
        >
          {`Weet je zeker dat je het boek '${getTitleByAggregate(
            key
          )}' met bookType identifier '${key}' wilt verwijderen?`}
        </DialogContentText>
      </DialogContent>
    );
  };

  const onSubmit = (key: string): string => {
    const version = versions.find((value) => value.aggregate === key);
    if (!version) {
      return 'Het verwijderen van het boek is mislukt';
    }
    publishRepository
      .removeVersion(version)
      .then(() =>
        dispatch(
          notify({
            notificationType: 'success',
            notificationOpen: true,
            notificationMessage: 'De versie is verwijderd.',
          })
        )
      )
      .then(() => {
        onReloadPublications();
      })
      .catch((error) => {
        logger.errorWithReason(
          `failed to remove version from publications handleSubmit for aggregate ${key}`,
          error
        );
        dispatch(
          notify({
            notificationType: 'error',
            notificationOpen: true,
            notificationMessage: `Het verwijderen van de versie is mislukt.`,
          })
        );
      });
    return '';
  };

  const menuListDialog = (): MenuListDialog => {
    return {
      dialogTitle: 'Boek verwijderen',
      closeButtonText: 'Annuleren',
      submitButtonText: 'Verwijderen',
      onSubmit,
      dialogContent,
    };
  };

  return (
    <MenuDialogButton
      buttonColor="secondary"
      iconName="delete_one_tone"
      buttonText="Boek verwijderen"
      menuListItems={menuListItems()}
      menuListDialog={menuListDialog()}
    />
  );
};

export default RemoveVersionButton;
