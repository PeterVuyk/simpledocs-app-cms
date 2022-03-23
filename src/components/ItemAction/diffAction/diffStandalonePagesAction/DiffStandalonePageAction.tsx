import React, { FC, useState } from 'react';
import { Tooltip } from '@material-ui/core';
import CompareArrowsIcon from '@material-ui/icons/CompareArrows';
import ShowDiffStandalonePagesDialog from './ShowDiffStandalonePagesDialog';

const DiffStandalonePageAction: FC = () => {
  const [showDiffDialog, setShowDiffDialog] = useState<boolean>(false);

  return (
    <>
      <Tooltip title="Bekijk de wijzigingen">
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
