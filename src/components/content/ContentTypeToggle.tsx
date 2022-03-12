import React, { FC, useEffect } from 'react';
import { Button } from '@material-ui/core';
// eslint-disable-next-line import/no-unresolved
import { makeStyles } from '@material-ui/core/styles';
import HelpAction from '../ItemAction/helpAction/HelpAction';
import { DOCUMENTATION_CONTENT_TYPES } from '../../model/DocumentationType';
import {
  CONTENT_TYPE_DECISION_TREE,
  CONTENT_TYPE_HTML,
  CONTENT_TYPE_MARKDOWN,
  ContentType,
} from '../../model/ContentType';

const useStyles = makeStyles((theme) => ({
  buttonContainer: {
    marginBottom: theme.spacing(1),
    display: 'flex',
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
  allowedContentTypes: ContentType[];
}

const ContentTypeToggle: FC<Props> = ({
  contentType,
  setContentTypeToggle,
  allowedContentTypes,
}) => {
  const classes = useStyles();

  useEffect(() => {
    if (
      contentType === undefined ||
      !allowedContentTypes.includes(contentType)
    ) {
      setContentTypeToggle(CONTENT_TYPE_HTML);
    }
  }, [allowedContentTypes, contentType, setContentTypeToggle]);

  return (
    <div className={classes.relativeContainer}>
      <div className={classes.buttonContainer}>
        {allowedContentTypes.includes(CONTENT_TYPE_HTML) && (
          <Button
            style={{ flex: 1, borderRadius: 0 }}
            variant={
              contentType === CONTENT_TYPE_HTML ? 'contained' : 'outlined'
            }
            color="primary"
            onClick={() => setContentTypeToggle(CONTENT_TYPE_HTML)}
          >
            Html
          </Button>
        )}
        {allowedContentTypes.includes(CONTENT_TYPE_MARKDOWN) && (
          <Button
            style={{ flex: 1, borderRadius: 0 }}
            variant={
              contentType === CONTENT_TYPE_MARKDOWN ? 'contained' : 'outlined'
            }
            color="primary"
            onClick={() => setContentTypeToggle(CONTENT_TYPE_MARKDOWN)}
          >
            Markdown
          </Button>
        )}
        {allowedContentTypes.includes(CONTENT_TYPE_DECISION_TREE) && (
          <Button
            style={{ flex: 1, borderRadius: 0 }}
            variant={
              contentType === CONTENT_TYPE_DECISION_TREE
                ? 'contained'
                : 'outlined'
            }
            color="primary"
            onClick={() => setContentTypeToggle(CONTENT_TYPE_DECISION_TREE)}
          >
            Beslisboom
          </Button>
        )}
      </div>
      <div className={classes.infoContainer}>
        <HelpAction documentationType={DOCUMENTATION_CONTENT_TYPES} />
      </div>
    </div>
  );
};

export default ContentTypeToggle;
