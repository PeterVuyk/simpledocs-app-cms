import React, { FC, useState } from 'react';
import { Tooltip } from '@mui/material';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import ShowDiffStandalonePagesDialog from './ShowDiffStandalonePagesDialog';

const DiffStandalonePageAction: FC = () => {
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
        <ShowDiffStandalonePagesDialog setShowDiffDialog={setShowDiffDialog} />
      )}
    </>
  );
};

export default DiffStandalonePageAction;
