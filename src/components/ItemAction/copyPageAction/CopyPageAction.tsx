import React, { FC, useState } from 'react';
import FilterNoneIcon from '@mui/icons-material/FilterNone';
import { Tooltip } from '@mui/material';
import { PageInfo } from '../../../model/Page';
import CopyPageDialog from './CopyPageDialog';

interface Props {
  page: PageInfo;
  bookType: string;
}

const CopyPageAction: FC<Props> = ({ bookType, page }) => {
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  return (
    <>
      <Tooltip disableInteractive title="Kopieer pagina">
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
