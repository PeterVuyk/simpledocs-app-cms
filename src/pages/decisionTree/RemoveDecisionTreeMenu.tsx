import React from 'react';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { connect } from 'react-redux';
import decisionTreeRepository, {
  DecisionTreeStep,
} from '../../firebase/database/decisionTreeRepository';
import RemoveConfirmationDialog from '../../components/dialog/RemoveConfirmationDialog';
import notification, {
  NotificationOptions,
} from '../../redux/actions/notification';

interface Props {
  removeMenuElement: null | HTMLElement;
  setRemoveMenuElement: (anchorEL: null | HTMLElement) => void;
  decisionTreeSteps: DecisionTreeStep[];
  setNotification: (notificationOptions: NotificationOptions) => void;
  onSubmitAction: () => void;
}

const RemoveDecisionTreeMenu: React.FC<Props> = ({
  removeMenuElement,
  setRemoveMenuElement,
  setNotification,
  decisionTreeSteps,
  onSubmitAction,
}) => {
  const handleClose = () => {
    setRemoveMenuElement(null);
  };
  const [openDialog, setOpenDialog] = React.useState<string>('');

  const handleDeleteDecisionTree = (title: string): void => {
    decisionTreeRepository
      .deleteByTitle(title)
      .then(() =>
        setNotification({
          notificationOpen: true,
          notificationType: 'success',
          notificationMessage: `Beslisboom ${title} is verwijderd`,
        })
      )
      .then(onSubmitAction)
      .catch(() =>
        setNotification({
          notificationOpen: true,
          notificationType: 'error',
          notificationMessage: `Het verwijderen van beslisboom ${title} is mislukt`,
        })
      );
  };

  const getTitles = (): string[] => {
    return [...new Set(decisionTreeSteps.map((step) => step.title))];
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
          dialogTitle="Weet je zeker dat je deze beslisboom wilt verwijderen?"
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
