import React, { FC, useState } from 'react';
import DeleteTwoToneIcon from '@material-ui/icons/DeleteTwoTone';
import ConfirmationDialog from '../dialog/ConfirmationDialog';

interface Props {
  title: string;
  dialogText: string;
  onSubmit: (itemId: string) => void;
  itemId: string;
}

const DeleteItemAction: FC<Props> = ({
  title,
  dialogText,
  onSubmit,
  itemId,
}) => {
  const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);
  return (
    <>
      <DeleteTwoToneIcon
        color="secondary"
        style={{ cursor: 'pointer' }}
        onClick={() => setOpenDeleteDialog(true)}
      />
      {openDeleteDialog && (
        <ConfirmationDialog
          dialogTitle={title}
          dialogText={dialogText}
          openDialog={openDeleteDialog}
          setOpenDialog={setOpenDeleteDialog}
          itemId={itemId}
          onSubmit={onSubmit}
        />
      )}
    </>
  );
};

export default DeleteItemAction;
