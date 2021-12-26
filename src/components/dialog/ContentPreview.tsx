import React, { FC } from 'react';
import Dialog from '@material-ui/core/Dialog';
import ReactMarkdown from 'react-markdown';
import { makeStyles } from '@material-ui/core/styles';
import {
  CONTENT_TYPE_HTML,
  CONTENT_TYPE_MARKDOWN,
  ContentType,
} from '../../model/artifacts/Artifact';
import DialogTransition from './DialogTransition';

const useStyles = makeStyles(() => ({
  previewContainer: {
    height: 812,
    width: 375,
  },
  markdown: {
    padding: 10,
  },
}));

interface Props {
  contentType: ContentType;
  showContentPreview?: string;
  onCloseContentPreview: () => void;
}

const ContentPreview: FC<Props> = ({
  contentType,
  showContentPreview,
  onCloseContentPreview,
}) => {
  const classes = useStyles();

  return (
    <Dialog
      open={showContentPreview !== null}
      TransitionComponent={DialogTransition}
      keepMounted
      onClose={onCloseContentPreview}
    >
      {contentType === CONTENT_TYPE_MARKDOWN && (
        <div className={classes.previewContainer}>
          <ReactMarkdown className={classes.markdown}>
            {showContentPreview!}
          </ReactMarkdown>
        </div>
      )}
      {contentType === CONTENT_TYPE_HTML && (
        <iframe
          className={classes.previewContainer}
          style={{ border: 'none' }}
          title="preview.html"
          srcDoc={showContentPreview}
        />
      )}
    </Dialog>
  );
};

export default ContentPreview;
