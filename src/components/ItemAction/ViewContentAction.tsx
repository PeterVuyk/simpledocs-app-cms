import React, { FC, useState } from 'react';
import FindInPageTwoToneIcon from '@mui/icons-material/FindInPageTwoTone';
import { Tooltip } from '@mui/material';
import ContentPreview from '../dialog/ContentPreview';
import { ContentType } from '../../model/ContentType';

interface Props {
  content: string;
  contentType: ContentType;
}

const ViewContentAction: FC<Props> = ({ content, contentType }) => {
  const [showPreview, setShowPreview] = useState<boolean>(false);

  return (
    <>
      <Tooltip disableInteractive title="Preview pagina">
        <FindInPageTwoToneIcon
          color="primary"
          style={{ cursor: 'pointer' }}
          onClick={() => setShowPreview(true)}
        />
      </Tooltip>
      {showPreview && (
        <ContentPreview
          contentType={contentType}
          showContentPreview={content}
          onCloseContentPreview={() => setShowPreview(false)}
        />
      )}
    </>
  );
};

export default ViewContentAction;
