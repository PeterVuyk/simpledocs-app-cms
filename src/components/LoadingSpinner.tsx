import React, { FC } from 'react';
import { CircularProgress } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  container: {
    height: 500,
  },
  center: {
    position: 'absolute',
    left: '50%',
    top: 250,
  },
  relativeContainer: {
    position: 'relative',
  },
});

const LoadingSpinner: FC = () => {
  const classes = useStyles();
  return (
    <div className={classes.container}>
      <div className={classes.relativeContainer}>
        <div className={classes.center}>
          <CircularProgress />
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
