import React, { FC, forwardRef, ReactElement, Ref } from 'react';
import Dialog from '@material-ui/core/Dialog';
import Slide from '@material-ui/core/Slide';
// eslint-disable-next-line import/no-unresolved
import { TransitionProps } from '@material-ui/core/transitions';
import Markdown from 'markdown-to-jsx';
import { makeStyles } from '@material-ui/core/styles';
import {
  CONTENT_TYPE_HTML,
  CONTENT_TYPE_MARKDOWN,
  ContentType,
} from '../../model/Artifact';

const Transition = forwardRef(function Transition(
  // eslint-disable-next-line react/require-default-props
  props: TransitionProps & { children?: ReactElement<any, any> },
  ref: Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const useStyles = makeStyles(() => ({
  previewContainer: {
    height: 812,
    width: 375,
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
      TransitionComponent={Transition}
      keepMounted
      onClose={onCloseContentPreview}
      aria-labelledby="alert-dialog-slide-title"
      aria-describedby="alert-dialog-slide-description"
    >
      {contentType === CONTENT_TYPE_MARKDOWN && (
        <div className={classes.previewContainer}>
          <Markdown>{showContentPreview!}</Markdown>
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
