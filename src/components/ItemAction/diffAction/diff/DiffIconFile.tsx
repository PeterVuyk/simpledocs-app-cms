import React, { FC } from 'react';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
  icon: {
    width: 45,
    display: 'inline',
    verticalAlign: 'middle',
  },
}));

interface Props {
  conceptIconFile: string;
  publicationIconFile: string;
  altText: string;
}

const DiffIconFile: FC<Props> = ({
  conceptIconFile,
  publicationIconFile,
  altText,
}) => {
  const classes = useStyles();

  return (
    <>
      <h3>Illustratie:</h3>
      <p>
        Gepubliceerd:&nbsp;
        <img
          className={classes.icon}
          src={`${publicationIconFile}`}
          alt={altText}
        />
        &nbsp;&nbsp;Concept:&nbsp;
        <img
          className={classes.icon}
          src={`${conceptIconFile}`}
          alt={altText}
        />
      </p>
    </>
  );
};

export default DiffIconFile;
