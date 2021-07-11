import React, { FC, useState } from 'react';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { connect } from 'react-redux';
import decisionTreeRepository from '../../../../firebase/database/decisionTreeRepository';
import RemoveConfirmationDialog from '../../../../components/dialog/RemoveConfirmationDialog';
import notification from '../../../../redux/actions/notification';
import logger from '../../../../helper/logger';
import { DecisionTreeStep } from '../../../../model/DecisionTreeStep';
import { NotificationOptions } from '../../../../model/NotificationOptions';

interface Props {
  removeMarkForDeleteMenuElement: null | HTMLElement;
  setRemoveMarkForDeleteMenuElement: (anchorEL: null | HTMLElement) => void;
  decisionTreeSteps: DecisionTreeStep[];
  setNotification: (notificationOptions: NotificationOptions) => void;
  onSubmitAction: () => void;
}

const UndoMarkForDeletionDecisionTreeMenu: FC<Props> = ({
  removeMarkForDeleteMenuElement,
  setRemoveMarkForDeleteMenuElement,
  setNotification,
  decisionTreeSteps,
  onSubmitAction,
}) => {
  const handleClose = () => {
    setRemoveMarkForDeleteMenuElement(null);
  };
  const [openDialog, setOpenDialog] = useState<string>('');

  const handleDeleteDecisionTree = (title: string): void => {
    decisionTreeRepository
      .removeMarkForDeletion(title)
      .then(() =>
        setNotification({
          notificationOpen: true,
          notificationType: 'success',
          notificationMessage: 'De markering voor verwijdering is verwijderd.',
        })
      )
      .then(onSubmitAction)
      .catch(() => {
        logger.error(
          'delete decisionTree by title UndoMarkForDeletionDecisionTreeMenu.handleDeleteDecisionTree failed.'
        );
        setNotification({
          notificationOpen: true,
          notificationType: 'error',
          notificationMessage:
            'Het verwijderen van de markering voor verwijdering is mislukt',
        });
      });
  };

  const getTitles = (): string[] => {
    return [
      ...new Set(
        decisionTreeSteps
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

const mapStateToProps = (state: any) => {
  return {
    notificationOptions: state.notification.notificationOptions,
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    setNotification: (notificationOptions: NotificationOptions) =>
      // eslint-disable-next-line import/no-named-as-default-member
      dispatch(notification.setNotification(notificationOptions)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UndoMarkForDeletionDecisionTreeMenu);
