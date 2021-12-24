import React, { FC } from 'react';
import { CircularProgress } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  center: {
    position: 'absolute',
    left: '50%',
    top: 250,
  },
  relativeContainer: {
    position: 'relative',
  },
});

interface Props {
  showInBlock?: boolean;
}

const LoadingSpinner: FC<Props> = ({ showInBlock }) => {
  const classes = useStyles();
  return (
    <div style={showInBlock ? { height: 500 } : {}}>
      <div className={classes.relativeContainer}>
        <div className={classes.center}>
          <CircularProgress />
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
