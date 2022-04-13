import { Grid } from '@mui/material';
import React, { Fragment, useCallback } from 'react';
import { Change } from 'diff';

function useDiff() {
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
          <h3 style={{ display: 'inline', marginRight: 10 }}>{title}:</h3>
          <div style={{ display: 'inline', marginRight: 10 }}>
            {elements[0].props.children === '' ? '-' : elements}
          </div>
        </Grid>
      );
    },
    []
  );

  return {
    mapDiff,
    getPropertiesDiff,
    getAddedSpan,
    getRemovedSpan,
  };
}

export default useDiff;
