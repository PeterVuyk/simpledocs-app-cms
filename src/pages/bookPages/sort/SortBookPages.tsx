import React, { FC, useState } from 'react';
import Button from '@mui/material/Button';
import { Tooltip } from '@mui/material';
import SortByAlphaIcon from '@mui/icons-material/SortByAlpha';
import SortBookPagesDialog from './SortBookPagesDialog';

interface Props {
  bookType: string;
  onReloadPages: () => void;
}

const SortBookPages: FC<Props> = ({ bookType, onReloadPages }) => {
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  return (
    <>
      <Tooltip disableInteractive title="Pagina's sorteren">
        <Button
          variant="contained"
          color="inherit"
          onClick={() => setOpenDialog(true)}
        >
          <SortByAlphaIcon color="action" />
        </Button>
      </Tooltip>
      {openDialog && (
        <SortBookPagesDialog
          bookType={bookType}
          setOpenDialog={setOpenDialog}
          openDialog={openDialog}
          onReloadPages={onReloadPages}
        />
      )}
    </>
  );
};

export default SortBookPages;
