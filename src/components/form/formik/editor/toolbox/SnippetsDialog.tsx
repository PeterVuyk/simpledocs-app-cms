import React, { FC, forwardRef, ReactElement, Ref } from 'react';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
// eslint-disable-next-line import/no-unresolved
import { TransitionProps } from '@material-ui/core/transitions';
import Highlight from 'react-highlight';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import ReactMarkdown from 'react-markdown';
import CopyToClipboardAction from '../../../../CopyToClipboardAction';
import '../../../../../../node_modules/highlight.js/styles/a11y-dark.css';
import {
  Artifact,
  CONTENT_TYPE_HTML,
  CONTENT_TYPE_MARKDOWN,
} from '../../../../../model/Artifact';

const useStyles = makeStyles(() => ({
  paper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: 375,
  },
  highLightContainer: {
    width: '100%',
    marginBottom: -10,
  },
  relativeContainer: {
    position: 'relative',
  },
  iframe: {
    border: 'none',
    width: 375,
    height: 700,
  },
  markdown: {
    width: 375,
    minHeight: 700,
    padding: 10,
  },
}));

const Transition = forwardRef(function Transition(
  // eslint-disable-next-line react/require-default-props
  props: TransitionProps & { children?: ReactElement<any, any> },
  ref: Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

interface Props {
  openSnippetsDialog: Artifact;
  oncloseDialog: () => void;
}

const SnippetsDialog: FC<Props> = ({ openSnippetsDialog, oncloseDialog }) => {
  const classes = useStyles();
  return (
    <Dialog
      fullWidth
      maxWidth="lg"
      open={openSnippetsDialog !== null}
      TransitionComponent={Transition}
      keepMounted
      onClose={oncloseDialog}
      aria-labelledby="alert-dialog-slide-title"
      aria-describedby="alert-dialog-slide-description"
    >
      <DialogTitle id="alert-dialog-slide-title">
        <div className={classes.relativeContainer}>
          <CopyToClipboardAction textToCopy={openSnippetsDialog.content} />
        </div>
        Snippet {openSnippetsDialog.title}
      </DialogTitle>
      <DialogContent>
        <div>
          <Grid container spacing={2} alignItems="flex-start">
            <Grid item sm={8}>
              <DialogContentText
                color="textPrimary"
                style={{ whiteSpace: 'pre-line' }}
                id="alert-dialog-slide-description"
              >
                {openSnippetsDialog.contentType}:
              </DialogContentText>
              <div className="highLightContainer">
                <Highlight
                  className={
                    openSnippetsDialog.contentType === CONTENT_TYPE_HTML
                      ? 'html'
                      : 'markdown'
                  }
                >
                  {openSnippetsDialog.content}
                </Highlight>
              </div>
            </Grid>
            <Grid item sm={4}>
              <DialogContentText
                color="textPrimary"
                style={{ whiteSpace: 'pre-line' }}
                id="alert-dialog-slide-description"
              >
                Voorbeeld:
              </DialogContentText>
              <Paper elevation={2} className={classes.paper}>
                {openSnippetsDialog.contentType === CONTENT_TYPE_HTML && (
                  <iframe
                    className={classes.iframe}
                    title="snippet.html"
                    srcDoc={openSnippetsDialog.content}
                  />
                )}
                {openSnippetsDialog.contentType === CONTENT_TYPE_MARKDOWN && (
                  <ReactMarkdown className={classes.markdown}>
                    {openSnippetsDialog.content}
                  </ReactMarkdown>
                )}
              </Paper>
            </Grid>
          </Grid>
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={oncloseDialog} color="primary" variant="contained">
          Terug
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SnippetsDialog;
