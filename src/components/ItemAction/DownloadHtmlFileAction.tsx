import React, { FC } from 'react';
import GetAppIcon from '@material-ui/icons/GetApp';
import FileSaver from 'file-saver';
import { Tooltip } from '@material-ui/core';
import htmlFileHelper from '../../helper/htmlFileHelper';

interface Props {
  htmlFile: string;
  fileName: string;
}

const DownloadHtmlFileAction: FC<Props> = ({ htmlFile, fileName }) => {
  return (
    <Tooltip title="Download html">
      <GetAppIcon
        color="action"
        style={{ cursor: 'pointer' }}
        onClick={() =>
          FileSaver.saveAs(
            htmlFileHelper.getBase64FromHtml(htmlFile),
            `${fileName}.html`
          )
        }
      />
    </Tooltip>
  );
};

export default DownloadHtmlFileAction;
