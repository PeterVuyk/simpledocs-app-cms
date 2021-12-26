import React, { FC, useState } from 'react';
import { Tooltip } from '@material-ui/core';
import CompareArrowsIcon from '@material-ui/icons/CompareArrows';
import Button from '@material-ui/core/Button';
import ShowDiffConfigurationDialog from './ShowDiffConfigurationDialog';
import { ConfigurationType } from '../../../../model/configurations/ConfigurationType';

interface Props {
  configurationType: ConfigurationType;
}

const DiffConfigurationAction: FC<Props> = ({ configurationType }) => {
  const [showDiffDialog, setShowDiffDialog] = useState<boolean>(false);

  return (
    <>
      <Tooltip title="Bekijk de wijzigingen">
        <Button
          variant="contained"
          color="primary"
          onClick={() => setShowDiffDialog(true)}
        >
          <CompareArrowsIcon />
        </Button>
      </Tooltip>
      {showDiffDialog && (
        <ShowDiffConfigurationDialog
          configurationType={configurationType}
          setShowDiffDialog={setShowDiffDialog}
        />
      )}
    </>
  );
};

export default DiffConfigurationAction;
