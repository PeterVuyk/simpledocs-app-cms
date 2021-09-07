import React, { FC } from 'react';
import GetAppIcon from '@material-ui/icons/GetApp';
import FileSaver from 'file-saver';
import { Tooltip } from '@material-ui/core';
import base64Helper from '../../helper/base64Helper';
import stylesheetHelper from '../../helper/stylesheetHelper';
import htmlFileHelper from '../../helper/htmlFileHelper';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const pretty = require('pretty');

interface Props {
  htmlFile: string;
  fileName: string;
  extension?: string;
}

const DownloadFileAction: FC<Props> = ({ htmlFile, fileName, extension }) => {
  const handleDownloadClick = () => {
    FileSaver.saveAs(
      base64Helper.getBase64FromFile(
        pretty(
          htmlFileHelper.stripBottomSpacing(
            stylesheetHelper.removeInnerHeaderCss(htmlFile)
          )
        ),
        'html'
      ),
      `${fileName}.${extension ?? 'html'}`
    );
  };

  return (
    <Tooltip title={`Download ${extension ?? 'html'}`}>
      <GetAppIcon
        color="action"
        style={{ cursor: 'pointer' }}
        onClick={handleDownloadClick}
      />
    </Tooltip>
  );
};

export default DownloadFileAction;
