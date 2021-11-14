import React, { FC } from 'react';
import GetAppIcon from '@material-ui/icons/GetApp';
import FileSaver from 'file-saver';
import { Tooltip } from '@material-ui/core';
import base64Helper from '../../helper/base64Helper';
import htmlContentHelper from '../../helper/htmlContentHelper';
import {
  CONTENT_TYPE_HTML,
  CONTENT_TYPE_MARKDOWN,
  ContentType,
  getExtensionFromContentType,
} from '../../model/artifacts/Artifact';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const pretty = require('pretty');

interface Props {
  content: string;
  contentType: ContentType;
  fileName: string;
}

const DownloadContentAction: FC<Props> = ({
  content,
  contentType,
  fileName,
}) => {
  const handleDownloadClick = () => {
    if (contentType === CONTENT_TYPE_MARKDOWN) {
      FileSaver.saveAs(
        base64Helper.getBase64FromFile(content, CONTENT_TYPE_MARKDOWN),
        `${fileName}.${getExtensionFromContentType(contentType)}`
      );
      return;
    }

    FileSaver.saveAs(
      base64Helper.getBase64FromFile(
        pretty(htmlContentHelper.stripBottomSpacing(content)),
        CONTENT_TYPE_HTML
      ),
      `${fileName}.${getExtensionFromContentType(contentType)}`
    );
  };

  return (
    <Tooltip title={`Download ${contentType}`}>
      <GetAppIcon
        color="action"
        style={{ cursor: 'pointer' }}
        onClick={handleDownloadClick}
      />
    </Tooltip>
  );
};

export default DownloadContentAction;
