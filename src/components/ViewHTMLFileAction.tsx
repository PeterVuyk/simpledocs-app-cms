import React, { FC, useState } from 'react';
import FindInPageTwoToneIcon from '@material-ui/icons/FindInPageTwoTone';
import HtmlPreview from './dialog/HtmlPreview';

interface Props {
  htmlFile: string;
  iconStyle?: React.CSSProperties;
}

const ViewHTMLFileAction: FC<Props> = ({ htmlFile, iconStyle }) => {
  const [showHtmlPreview, setShowHtmlPreview] = useState<boolean>(false);

  return (
    <>
      <FindInPageTwoToneIcon
        color="primary"
        style={{ cursor: 'pointer', ...iconStyle }}
        onClick={() => setShowHtmlPreview(true)}
      />
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
