import React, { FC, forwardRef, ReactElement, Ref } from 'react';
import Dialog from '@material-ui/core/Dialog';
import Slide from '@material-ui/core/Slide';
// eslint-disable-next-line import/no-unresolved
import { TransitionProps } from '@material-ui/core/transitions';

const Transition = forwardRef(function Transition(
  // eslint-disable-next-line react/require-default-props
  props: TransitionProps & { children?: ReactElement<any, any> },
  ref: Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

interface Props {
  showHtmlPreview?: string;
  onCloseHtmlPreview: () => void;
}

const HtmlPreview: FC<Props> = ({ showHtmlPreview, onCloseHtmlPreview }) => {
  return (
    <Dialog
      open={showHtmlPreview !== null}
      TransitionComponent={Transition}
      keepMounted
      onClose={onCloseHtmlPreview}
      aria-labelledby="alert-dialog-slide-title"
      aria-describedby="alert-dialog-slide-description"
    >
      <iframe
        style={{ height: 812, width: 375, border: 'none' }}
        title="preview.html"
        srcDoc={showHtmlPreview}
      />
    </Dialog>
  );
};

export default HtmlPreview;
