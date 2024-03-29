import React, { FC, useState } from 'react';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import { Tooltip } from '@mui/material';
import ConfirmationDialog from '../dialog/ConfirmationDialog';

interface Props {
  title: string;
  dialogText: string;
  onSubmit: (itemId: string) => Promise<void>;
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
      <Tooltip disableInteractive title="Verwijderen">
        <DeleteTwoToneIcon
          color="secondary"
          style={{ cursor: 'pointer' }}
          onClick={() => setOpenDeleteDialog(true)}
        />
      </Tooltip>
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
