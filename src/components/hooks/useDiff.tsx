import { Grid } from '@material-ui/core';
import React, { Fragment } from 'react';
import { Change } from 'diff';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
  inlineBlock: { display: 'inline', marginRight: 10 },
}));

function useDiff() {
  const classes = useStyles();

  const mapDiff = (changes: Change[]) => {
    console.log('2');
    return changes.map((part, index) => {
      // eslint-disable-next-line no-nested-ternary
      const color = part.added ? 'green' : part.removed ? '#ff0000' : '#404854';
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
  };

  const getPropertiesDiff = (title: string, elements: JSX.Element[]) => {
    console.log('1');
    return (
      <Grid item xs={12}>
        <h3 className={classes.inlineBlock}>{title}:</h3>
        <div className={classes.inlineBlock}>
          {elements[0].props.children === '' ? '-' : elements}
        </div>
      </Grid>
    );
  };

  return { mapDiff, getPropertiesDiff };
}

export default useDiff;
