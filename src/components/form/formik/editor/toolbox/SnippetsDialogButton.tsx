import React, { FC, ReactNode } from 'react';
import DialogContentText from '@mui/material/DialogContentText';
import DialogContent from '@mui/material/DialogContent';
import Grid from '@mui/material/Grid';
import Highlight from 'react-highlight';
import Paper from '@mui/material/Paper';
import ReactMarkdown from 'react-markdown';
import { styled } from '@mui/material/styles';
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

const DivPaper = styled('div')(() => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  width: 375,
}));

const DivHighLightContainer = styled('div')(() => ({
  width: '100%',
  marginBottom: -10,
}));

const DivIframe = styled('div')(() => ({
  border: 'none',
  width: 375,
  height: 700,
}));

const DivMarkdown = styled('div')(() => ({
  width: 375,
  minHeight: 700,
  padding: 10,
}));

const SnippetsDialogButton: FC<Props> = ({ artifacts }) => {
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
              <DivHighLightContainer>
                <Highlight
                  className={
                    snippet!.contentType === CONTENT_TYPE_HTML
                      ? 'html'
                      : 'markdown'
                  }
                >
                  {snippet!.content}
                </Highlight>
              </DivHighLightContainer>
            </Grid>
            <Grid item sm={4}>
              <DialogContentText
                color="textPrimary"
                style={{ whiteSpace: 'pre-line' }}
                id="alert-dialog-slide-description"
              >
                Voorbeeld:
              </DialogContentText>
              <DivPaper>
                <Paper elevation={2}>
                  {snippet!.contentType === CONTENT_TYPE_HTML && (
                    <DivIframe>
                      <iframe title="snippet.html" srcDoc={snippet!.content} />
                    </DivIframe>
                  )}
                  {snippet!.contentType === CONTENT_TYPE_MARKDOWN && (
                    <DivMarkdown>
                      <ReactMarkdown>{snippet!.content}</ReactMarkdown>
                    </DivMarkdown>
                  )}
                </Paper>
              </DivPaper>
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
