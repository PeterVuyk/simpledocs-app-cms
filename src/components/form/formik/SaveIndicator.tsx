import React, { FC } from 'react';
import SaveIcon from '@material-ui/icons/Save';
import { createStyles, makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() =>
  createStyles({
    saveIcon: {
      position: 'absolute',
      zIndex: 1000,
      right: 50,
      top: 50,
      backgroundColor: '#fff',
      color: '#099000FF',
      fontSize: 'xxx-large',
    },
  })
);

const SaveIndicator: FC = () => {
  const classes = useStyles();

  return <SaveIcon className={classes.saveIcon} />;
};

export default SaveIndicator;
