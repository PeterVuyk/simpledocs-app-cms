import React, { FC, useState } from 'react';
import { Tooltip } from '@material-ui/core';
import CompareArrowsIcon from '@material-ui/icons/CompareArrows';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import ShowDiffConfigurationDialog from './ShowDiffConfigurationDialog';
import { ConfigurationType } from '../../../../model/configurations/ConfigurationType';

const useStyles = makeStyles({
  button: {
    marginLeft: 8,
  },
});

interface Props {
  configurationType: ConfigurationType;
}

const DiffConfigurationAction: FC<Props> = ({ configurationType }) => {
  const [showDiffDialog, setShowDiffDialog] = useState<boolean>(false);
  const classes = useStyles();

  return (
    <>
      <Tooltip title="Bekijk de wijzigingen">
        <Button
          className={classes.button}
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
