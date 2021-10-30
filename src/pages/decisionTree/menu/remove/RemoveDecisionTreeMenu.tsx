import React, { FC, useState } from 'react';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import decisionTreeRepository from '../../../../firebase/database/decisionTreeRepository';
import RemoveConfirmationDialog from '../../../../components/dialog/RemoveConfirmationDialog';
import logger from '../../../../helper/logger';
import { DecisionTreeStep } from '../../../../model/DecisionTreeStep';
import { EDIT_STATUS_DRAFT, EditStatus } from '../../../../model/EditStatus';
import { useAppDispatch } from '../../../../redux/hooks';
import { notify } from '../../../../redux/slice/notificationSlice';

interface Props {
  editStatus: EditStatus;
  removeMenuElement: null | HTMLElement;
  setRemoveMenuElement: (anchorEL: null | HTMLElement) => void;
  decisionTreeSteps: DecisionTreeStep[];
  onSubmitAction: () => void;
}

const RemoveDecisionTreeMenu: FC<Props> = ({
  editStatus,
  removeMenuElement,
  setRemoveMenuElement,
  decisionTreeSteps,
  onSubmitAction,
}) => {
  const handleClose = () => {
    setRemoveMenuElement(null);
  };
  const [openDialog, setOpenDialog] = useState<string>('');
  const dispatch = useAppDispatch();

  const getDialogTitle =
    editStatus === EDIT_STATUS_DRAFT
      ? 'Weet je zeker dat je deze beslisboom wilt verwijderen?'
      : 'Weet je zeker dat je deze beslisboom wilt markeren voor verwijdering?';

  const notificationFailureMessage =
    editStatus === EDIT_STATUS_DRAFT
      ? `Het verwijderen van de beslisboom is mislukt`
      : `Het markeren voor verwijdering is mislukt`;

  const notificationSuccessMessage =
    editStatus === EDIT_STATUS_DRAFT
      ? `Het verwijderen van de beslisboom is gelukt`
      : `Het markeren voor verwijdering is gelukt`;

  const handleDeleteDecisionTree = (title: string): void => {
    decisionTreeRepository
      .deleteByTitle(title, editStatus)
      .then(() =>
        dispatch(
          notify({
            notificationOpen: true,
            notificationType: 'success',
            notificationMessage: notificationSuccessMessage,
          })
        )
      )
      .then(onSubmitAction)
      .catch(() => {
        logger.error(
          'delete decisionTree by title RemoveDecisionTreeMenu.handleDeleteDecisionTree failed.'
        );
        dispatch(
          notify({
            notificationOpen: true,
            notificationType: 'error',
            notificationMessage: notificationFailureMessage,
          })
        );
      });
  };

  const getTitles = (): string[] => {
    return [
      ...new Set(
        decisionTreeSteps
          .filter((step) => step.isDraft === (EDIT_STATUS_DRAFT === editStatus))
          .map((step) => step.title)
      ),
    ];
  };

  const getConfirmationDialogText = (title: string): string => {
    return `Beslisboom: ${title}`;
  };

  return (
    <>
      <Menu
        id="simple-menu"
        anchorEl={removeMenuElement}
        keepMounted
        open={Boolean(removeMenuElement)}
        onClose={handleClose}
      >
        {Array.from(getTitles()).map((title) => (
          <MenuItem key={title} onClick={() => setOpenDialog(title)}>
            {title}
          </MenuItem>
        ))}
      </Menu>
      {openDialog !== '' && (
        <RemoveConfirmationDialog
          openDialog={openDialog}
          dialogText={getConfirmationDialogText(openDialog)}
          setOpenDialog={setOpenDialog}
          dialogTitle={getDialogTitle}
          onSubmit={handleDeleteDecisionTree}
          onClose={handleClose}
        />
      )}
    </>
  );
};

export default RemoveDecisionTreeMenu;
