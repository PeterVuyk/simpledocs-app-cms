import React, { FC, useState } from 'react';
import FindInPageTwoToneIcon from '@material-ui/icons/FindInPageTwoTone';
import { Tooltip } from '@material-ui/core';
import ContentPreview from '../dialog/ContentPreview';
import { ContentType } from '../../model/artifacts/Artifact';

interface Props {
  content: string;
  contentType: ContentType;
  iconStyle?: React.CSSProperties;
}

const ViewContentAction: FC<Props> = ({ content, contentType, iconStyle }) => {
  const [showPreview, setShowPreview] = useState<boolean>(false);

  return (
    <>
      <Tooltip title="Preview pagina">
        <FindInPageTwoToneIcon
          color="primary"
          style={{ cursor: 'pointer', ...iconStyle }}
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
