import React, { FC, useState } from 'react';
import { Tooltip } from '@mui/material';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import ShowDiffCalculationDialog from './showDiffCalculationDialog';
import { CalculationInfo } from '../../../../model/calculations/CalculationInfo';

interface Props {
  calculationInfo: CalculationInfo;
}

const DiffCalculationAction: FC<Props> = ({ calculationInfo }) => {
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
        <ShowDiffCalculationDialog
          conceptCalculationInfo={calculationInfo}
          setShowDiffDialog={setShowDiffDialog}
        />
      )}
    </>
  );
};

export default DiffCalculationAction;
