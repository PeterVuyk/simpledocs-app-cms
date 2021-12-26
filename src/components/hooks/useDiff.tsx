import { Grid } from '@material-ui/core';
import React, { Fragment, useCallback } from 'react';
import { Change } from 'diff';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
  inlineBlock: { display: 'inline', marginRight: 10 },
}));

function useDiff() {
  const classes = useStyles();
  const removedColor = '#ff0000';
  const addedColor = 'green';

  const getAddedSpan = useCallback(
    (text: string | number | undefined) => {
      return <span style={{ color: addedColor }}>{text ?? ''}</span>;
    },
    [addedColor]
  );

  const getRemovedSpan = useCallback(
    (text: string | number | undefined) => {
      return <span style={{ color: removedColor }}>{text ?? ''}</span>;
    },
    [removedColor]
  );

  const mapDiff = useCallback(
    (changes: Change[]) => {
      return changes.map((part, index) => {
        // eslint-disable-next-line no-nested-ternary
        const color = part.added
          ? addedColor
          : part.removed
          ? removedColor
          : '#404854';
        return (
          <span key={index.toString()} style={{ color }} color={color}>
            {part.value.includes('\n')
              ? part.value.split('\n').map((value, splitIndex) => (
                  <Fragment key={splitIndex.toString()}>
                    {splitIndex !== 0 ? <br /> : ''}
                    {value}
                  </Fragment>
                ))
              : part.value}
          </span>
        );
      });
    },
    [addedColor, removedColor]
  );

  const getPropertiesDiff = useCallback(
    (title: string, elements: JSX.Element[]) => {
      return (
        <Grid item xs={12}>
          <h3 className={classes.inlineBlock}>{title}:</h3>
          <div className={classes.inlineBlock}>
            {elements[0].props.children === '' ? '-' : elements}
          </div>
        </Grid>
      );
    },
    [classes.inlineBlock]
  );

  return {
    mapDiff,
    getPropertiesDiff,
    getAddedSpan,
    getRemovedSpan,
  };
}

export default useDiff;