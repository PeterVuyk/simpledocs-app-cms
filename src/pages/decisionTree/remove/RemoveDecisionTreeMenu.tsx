import React, { FC, useState } from 'react';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { connect } from 'react-redux';
import decisionTreeRepository from '../../../firebase/database/decisionTreeRepository';
import RemoveConfirmationDialog from '../../../components/dialog/RemoveConfirmationDialog';
import notification from '../../../redux/actions/notification';
import logger from '../../../helper/logger';
import { DecisionTreeStep } from '../../../model/DecisionTreeStep';
import { NotificationOptions } from '../../../model/NotificationOptions';
import { EDIT_STATUS_DRAFT, EditStatus } from '../../../model/EditStatus';

interface Props {
  editStatus: EditStatus;
  removeMenuElement: null | HTMLElement;
  setRemoveMenuElement: (anchorEL: null | HTMLElement) => void;
  decisionTreeSteps: DecisionTreeStep[];
  setNotification: (notificationOptions: NotificationOptions) => void;
  onSubmitAction: () => void;
}

const RemoveDecisionTreeMenu: FC<Props> = ({
  editStatus,
  removeMenuElement,
  setRemoveMenuElement,
  setNotification,
  decisionTreeSteps,
  onSubmitAction,
}) => {
  const handleClose = () => {
    setRemoveMenuElement(null);
  };
  const [openDialog, setOpenDialog] = useState<string>('');

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
        setNotification({
          notificationOpen: true,
          notificationType: 'success',
          notificationMessage: notificationSuccessMessage,
        })
      )
      .then(onSubmitAction)
      .catch(() => {
        logger.error(
          'delete decisionTree by title RemoveDecisionTreeMenu.handleDeleteDecisionTree failed.'
        );
        setNotification({
          notificationOpen: true,
          notificationType: 'error',
          notificationMessage: notificationFailureMessage,
        });
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
)(RemoveDecisionTreeMenu);
