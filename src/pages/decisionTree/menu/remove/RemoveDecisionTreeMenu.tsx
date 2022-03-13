import React, { FC, useState } from 'react';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import decisionTreeRepository from '../../../../firebase/database/decisionTreeRepository';
import RemoveConfirmationDialog from '../../../../components/dialog/RemoveConfirmationDialog';
import logger from '../../../../helper/logger';
import { EDIT_STATUS_DRAFT, EditStatus } from '../../../../model/EditStatus';
import { useAppDispatch } from '../../../../redux/hooks';
import { notify } from '../../../../redux/slice/notificationSlice';
import { DecisionTree } from '../../../../model/DecisionTree/DecisionTree';
import useAppConfiguration from '../../../../configuration/useAppConfiguration';
import bookRepository from '../../../../firebase/database/bookRepository';
import { CONTENT_TYPE_DECISION_TREE } from '../../../../model/ContentType';

interface Props {
  editStatus: EditStatus;
  removeMenuElement: null | HTMLElement;
  setRemoveMenuElement: (anchorEL: null | HTMLElement) => void;
  decisionTrees: DecisionTree[];
  onSubmitAction: () => void;
}

const RemoveDecisionTreeMenu: FC<Props> = ({
  editStatus,
  removeMenuElement,
  setRemoveMenuElement,
  decisionTrees,
  onSubmitAction,
}) => {
  const { getSortedBooks } = useAppConfiguration();

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

  const isDecisionTreeUsed = async (title: string): Promise<boolean> => {
    // 1: get from the configurations the active books (because we don't want to check if a decision tree is linked on a page from a removed book)
    const bookTypes = getSortedBooks().map((value) => value.bookType);
    // 2: query from all the active books the pages and check if the title is included
    for (const bookType of bookTypes) {
      // eslint-disable-next-line no-await-in-loop
      const titleIncluded = await bookRepository
        .getAllPages(bookType)
        .then((pages) =>
          pages
            .filter((page) => page.contentType === CONTENT_TYPE_DECISION_TREE)
            .map((page) => JSON.parse(page.content) as DecisionTree)
            .map((decisionTree) => decisionTree.title)
        )
        .then((titles) => titles.includes(title));
      if (titleIncluded) {
        return true;
      }
    }
    return false;
  };

  const handleDeleteDecisionTree = async (title: string): Promise<void> => {
    if (await isDecisionTreeUsed(title)) {
      dispatch(
        notify({
          notificationOpen: true,
          notificationType: 'warning',
          notificationMessage:
            "Actie mislukt, deze beslisboom is nog gekoppeld bij 1 of meerdere pagina's, verwijder deze eerst en probeer het daarna opnieuw.",
        })
      );
      return;
    }
    await decisionTreeRepository
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
        decisionTrees
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
