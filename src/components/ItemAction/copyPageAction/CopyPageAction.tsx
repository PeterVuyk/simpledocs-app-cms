import React, { FC, useState } from 'react';
import FilterNoneIcon from '@material-ui/icons/FilterNone';
import { Tooltip } from '@material-ui/core';
import { Page } from '../../../model/Page';
import CopyPageDialog from './CopyPageDialog';

interface Props {
  page: Page;
  bookType: string;
}

const CopyPageAction: FC<Props> = ({ bookType, page }) => {
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  return (
    <>
      <Tooltip title="Kopieer pagina">
        <FilterNoneIcon
          style={{
            cursor: 'pointer',
          }}
          onClick={() => setOpenDialog(true)}
        />
      </Tooltip>
      {openDialog && (
        <CopyPageDialog
          bookType={bookType}
          page={page}
          onClose={() => setOpenDialog(false)}
        />
      )}
    </>
  );
};

export default CopyPageAction;
