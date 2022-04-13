import React, { FC, useState } from 'react';
import { Tooltip } from '@mui/material';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import Button from '@mui/material/Button';
import ShowDiffConfigurationDialog from './ShowDiffConfigurationDialog';
import { ConfigurationType } from '../../../../model/configurations/ConfigurationType';

interface Props {
  configurationType: ConfigurationType;
}

const DiffConfigurationAction: FC<Props> = ({ configurationType }) => {
  const [showDiffDialog, setShowDiffDialog] = useState<boolean>(false);

  return (
    <>
      <Tooltip disableInteractive title="Bekijk de wijzigingen">
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
