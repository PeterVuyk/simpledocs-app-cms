import React, { FC, ReactNode } from 'react';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogContent from '@material-ui/core/DialogContent';
import Grid from '@material-ui/core/Grid';
import Highlight from 'react-highlight';
import Paper from '@material-ui/core/Paper';
import ReactMarkdown from 'react-markdown';
import { makeStyles } from '@material-ui/core/styles';
import { MenuListDialog } from '../../../../buttonMenuDialog/model/MenuListDialog';
import { MenuListItem } from '../../../../buttonMenuDialog/model/MenuListItem';
import MenuDialogButton from '../../../../buttonMenuDialog/MenuDialogButton';
import { Artifact } from '../../../../../model/artifacts/Artifact';
import {
  CONTENT_TYPE_HTML,
  CONTENT_TYPE_MARKDOWN,
} from '../../../../../model/ContentType';

interface Props {
  artifacts: Artifact[];
}

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

const SnippetsDialogButton: FC<Props> = ({ artifacts }) => {
  const classes = useStyles();

  const menuListItems = (): MenuListItem[] => {
    return artifacts.map((artifact) => {
      return { key: artifact.id, value: artifact.title } as MenuListItem;
    });
  };

  const dialogContent = (key: string): ReactNode => {
    const snippet = artifacts.find((artifact) => artifact.id === key);
    return (
      <DialogContent>
        <div>
          <Grid container spacing={2} alignItems="flex-start">
            <Grid item sm={8}>
              <DialogContentText
                color="textPrimary"
                style={{ whiteSpace: 'pre-line' }}
                id="alert-dialog-slide-description"
              >
                {snippet!.contentType}:
              </DialogContentText>
              <div className="highLightContainer">
                <Highlight
                  className={
                    snippet!.contentType === CONTENT_TYPE_HTML
                      ? 'html'
                      : 'markdown'
                  }
                >
                  {snippet!.content}
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
                {snippet!.contentType === CONTENT_TYPE_HTML && (
                  <iframe
                    className={classes.iframe}
                    title="snippet.html"
                    srcDoc={snippet!.content}
                  />
                )}
                {snippet!.contentType === CONTENT_TYPE_MARKDOWN && (
                  <ReactMarkdown className={classes.markdown}>
                    {snippet!.content}
                  </ReactMarkdown>
                )}
              </Paper>
            </Grid>
          </Grid>
        </div>
      </DialogContent>
    );
  };

  const menuListDialog = (): MenuListDialog => {
    return {
      dialogTitle: 'Snippet',
      closeButtonText: 'Terug',
      dialogContent,
    };
  };

  return (
    <MenuDialogButton
      iconName="loyalty"
      toolTip="Snippets gebruiken"
      menuListItems={menuListItems()}
      menuListDialog={menuListDialog()}
    />
  );
};

export default SnippetsDialogButton;
