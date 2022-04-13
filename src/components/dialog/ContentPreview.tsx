import React, { FC } from 'react';
import Dialog from '@mui/material/Dialog';
import ReactMarkdown from 'react-markdown';
import DialogTransition from './DialogTransition';
import {
  CONTENT_TYPE_HTML,
  CONTENT_TYPE_MARKDOWN,
  ContentType,
} from '../../model/ContentType';

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
  return (
    <Dialog
      open={showContentPreview !== null}
      TransitionComponent={DialogTransition}
      keepMounted
      onClose={onCloseContentPreview}
    >
      {contentType === CONTENT_TYPE_MARKDOWN && (
        <div style={{ height: 812, width: 375, padding: 10 }}>
          <ReactMarkdown>{showContentPreview!}</ReactMarkdown>
        </div>
      )}
      {contentType === CONTENT_TYPE_HTML && (
        <iframe
          style={{ border: 'none', height: 812, width: 375 }}
          title="preview.html"
          srcDoc={showContentPreview}
        />
      )}
    </Dialog>
  );
};

export default ContentPreview;
