import React, { FC, useState } from 'react';
import { Tooltip } from '@material-ui/core';
import CompareArrowsIcon from '@material-ui/icons/CompareArrows';
import ShowDiffCalculationDialog from './showDiffCalculationDialog';
import { CalculationInfo } from '../../../../model/calculations/CalculationInfo';

interface Props {
  calculationInfo: CalculationInfo;
}

const DiffCalculationAction: FC<Props> = ({ calculationInfo }) => {
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
        <ShowDiffCalculationDialog
          conceptCalculationInfo={calculationInfo}
          setShowDiffDialog={setShowDiffDialog}
        />
      )}
    </>
  );
};

export default DiffCalculationAction;
