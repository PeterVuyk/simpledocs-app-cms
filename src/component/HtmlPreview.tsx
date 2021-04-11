import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import Slide from '@material-ui/core/Slide';
// eslint-disable-next-line import/no-unresolved
import { TransitionProps } from '@material-ui/core/transitions';
import { Regulation } from '../firebase/database/regulationRepository';

const Transition = React.forwardRef(function Transition(
  // eslint-disable-next-line react/require-default-props
  props: TransitionProps & { children?: React.ReactElement<any, any> },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

interface Props {
  showHtmlPreview: Regulation | null;
  setShowHtmlPreview: (showHtmlModal: Regulation | null) => void;
}

const RegulationDialog: React.FC<Props> = ({
  showHtmlPreview,
  setShowHtmlPreview,
}) => {
  const handleClose = () => {
    setShowHtmlPreview(null);
  };

  return (
    <div>
      <Dialog
        open={showHtmlPreview !== null}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
      >
        <iframe
          style={{ height: 812, width: 375, border: 'none' }}
          title={showHtmlPreview?.title}
          src={showHtmlPreview?.htmlFile}
        />
      </Dialog>
    </div>
  );
};

export default RegulationDialog;
