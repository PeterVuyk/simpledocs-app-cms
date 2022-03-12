import React, { FC, useState } from 'react';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import decisionTreeRepository from '../../../../firebase/database/decisionTreeRepository';
import RemoveConfirmationDialog from '../../../../components/dialog/RemoveConfirmationDialog';
import logger from '../../../../helper/logger';
import { useAppDispatch } from '../../../../redux/hooks';
import { notify } from '../../../../redux/slice/notificationSlice';
import { DecisionTree } from '../../../../model/DecisionTree/DecisionTree';

interface Props {
  removeMarkForDeleteMenuElement: null | HTMLElement;
  setRemoveMarkForDeleteMenuElement: (anchorEL: null | HTMLElement) => void;
  decisionTrees: DecisionTree[];
  onSubmitAction: () => void;
}

const UndoMarkForDeletionDecisionTreeMenu: FC<Props> = ({
  removeMarkForDeleteMenuElement,
  setRemoveMarkForDeleteMenuElement,
  decisionTrees,
  onSubmitAction,
}) => {
  const dispatch = useAppDispatch();
  const handleClose = () => {
    setRemoveMarkForDeleteMenuElement(null);
  };
  const [openDialog, setOpenDialog] = useState<string>('');

  const handleDeleteDecisionTree = (title: string): void => {
    decisionTreeRepository
      .removeMarkForDeletion(title)
      .then(() =>
        dispatch(
          notify({
            notificationOpen: true,
            notificationType: 'success',
            notificationMessage:
              'De markering voor verwijdering is verwijderd.',
          })
        )
      )
      .then(onSubmitAction)
      .catch(() => {
        logger.error(
          'delete decisionTree by title UndoMarkForDeletionDecisionTreeMenu.handleDeleteDecisionTree failed.'
        );
        dispatch(
          notify({
            notificationOpen: true,
            notificationType: 'error',
            notificationMessage:
              'Het verwijderen van de markering voor verwijdering is mislukt',
          })
        );
      });
  };

  const getTitles = (): string[] => {
    return [
      ...new Set(
        decisionTrees
          .filter((step) => step.markedForDeletion)
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
        anchorEl={removeMarkForDeleteMenuElement}
        keepMounted
        open={Boolean(removeMarkForDeleteMenuElement)}
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
          dialogTitle="Weet je zeker dat je markering voor verwijdering voor deze beslisboom wilt opheffen?"
          onSubmit={handleDeleteDecisionTree}
          onClose={handleClose}
        />
      )}
    </>
  );
};

export default UndoMarkForDeletionDecisionTreeMenu;
