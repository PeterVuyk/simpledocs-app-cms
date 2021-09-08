import React, { FC, forwardRef, ReactElement, Ref } from 'react';
import Dialog from '@material-ui/core/Dialog';
import Slide from '@material-ui/core/Slide';
// eslint-disable-next-line import/no-unresolved
import { TransitionProps } from '@material-ui/core/transitions';
import { CONTENT_TYPE_HTML, ContentType } from '../../model/Artifact';

const Transition = forwardRef(function Transition(
  // eslint-disable-next-line react/require-default-props
  props: TransitionProps & { children?: ReactElement<any, any> },
  ref: Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

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
  // TODO: Add functionality for markdown Preview
  return (
    <Dialog
      open={showContentPreview !== null}
      TransitionComponent={Transition}
      keepMounted
      onClose={onCloseContentPreview}
      aria-labelledby="alert-dialog-slide-title"
      aria-describedby="alert-dialog-slide-description"
    >
      {contentType === CONTENT_TYPE_HTML && (
        <iframe
          style={{ height: 812, width: 375, border: 'none' }}
          title="preview.html"
          srcDoc={showContentPreview}
        />
      )}
    </Dialog>
  );
};

export default ContentPreview;
