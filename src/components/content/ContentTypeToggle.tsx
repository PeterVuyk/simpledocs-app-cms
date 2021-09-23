import React, { FC } from 'react';
import { Button } from '@material-ui/core';
// eslint-disable-next-line import/no-unresolved
import { makeStyles } from '@material-ui/core/styles';
import {
  CONTENT_TYPE_HTML,
  CONTENT_TYPE_MARKDOWN,
  ContentType,
} from '../../model/Artifact';
import HelpAction from '../ItemAction/helpAction/HelpAction';
import { DOCUMENTATION_CONTENT_TYPES } from '../../model/DocumentationType';

const useStyles = makeStyles((theme) => ({
  buttonContainer: {
    marginBottom: theme.spacing(1),
  },
  relativeContainer: {
    position: 'relative',
  },
  infoContainer: {
    zIndex: 11,
    position: 'absolute',
    top: 5,
    right: 10,
  },
}));

interface Props {
  contentType: ContentType | undefined;
  setContentTypeToggle: (contentType: ContentType | undefined) => void;
}

const ContentTypeToggle: FC<Props> = ({
  contentType,
  setContentTypeToggle,
}) => {
  const classes = useStyles();

  return (
    <div className={classes.relativeContainer}>
      <div className={classes.buttonContainer}>
        <Button
          style={{ width: '50%', borderRadius: 0 }}
          variant={contentType === CONTENT_TYPE_HTML ? 'contained' : 'outlined'}
          color="primary"
          onClick={() => setContentTypeToggle(CONTENT_TYPE_HTML)}
        >
          Html
        </Button>
        <Button
          style={{ width: '50%', borderRadius: 0 }}
          variant={
            contentType === CONTENT_TYPE_MARKDOWN ? 'contained' : 'outlined'
          }
          color="primary"
          onClick={() => setContentTypeToggle(CONTENT_TYPE_MARKDOWN)}
        >
          Markdown
        </Button>
      </div>
      <div className={classes.infoContainer}>
        <HelpAction documentationType={DOCUMENTATION_CONTENT_TYPES} />
      </div>
    </div>
  );
};

export default ContentTypeToggle;
