import React, { FC, useState } from 'react';
import FindInPageTwoToneIcon from '@material-ui/icons/FindInPageTwoTone';
import { Tooltip } from '@material-ui/core';
import HtmlPreview from '../dialog/HtmlPreview';

interface Props {
  htmlFile: string;
  iconStyle?: React.CSSProperties;
}

const ViewHTMLFileAction: FC<Props> = ({ htmlFile, iconStyle }) => {
  const [showHtmlPreview, setShowHtmlPreview] = useState<boolean>(false);

  return (
    <>
      <Tooltip title="Html preview">
        <FindInPageTwoToneIcon
          color="primary"
          style={{ cursor: 'pointer', ...iconStyle }}
          onClick={() => setShowHtmlPreview(true)}
        />
      </Tooltip>
      {showHtmlPreview && (
        <HtmlPreview
          showHtmlPreview={htmlFile}
          closeHtmlPreviewHandle={() => setShowHtmlPreview(false)}
        />
      )}
    </>
  );
};

export default ViewHTMLFileAction;
