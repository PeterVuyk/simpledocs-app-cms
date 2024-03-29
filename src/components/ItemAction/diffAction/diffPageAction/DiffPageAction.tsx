import React, { FC, useState } from 'react';
import { Tooltip } from '@mui/material';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import ShowDiffPageDialog from './showDiffPageDialog';

interface Props {
  pageId: string;
  bookType: string;
}

const DiffPageAction: FC<Props> = ({ bookType, pageId }) => {
  const [showDiffDialog, setShowDiffDialog] = useState<boolean>(false);

  return (
    <>
      <Tooltip disableInteractive title="Bekijk de wijzigingen">
        <CompareArrowsIcon
          color="primary"
          style={{ cursor: 'pointer' }}
          onClick={() => setShowDiffDialog(true)}
        />
      </Tooltip>
      {showDiffDialog && (
        <ShowDiffPageDialog
          bookType={bookType}
          pageId={pageId}
          setShowDiffDialog={setShowDiffDialog}
        />
      )}
    </>
  );
};

export default DiffPageAction;
