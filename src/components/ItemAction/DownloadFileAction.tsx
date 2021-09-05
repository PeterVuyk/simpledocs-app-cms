import React, { FC } from 'react';
import GetAppIcon from '@material-ui/icons/GetApp';
import FileSaver from 'file-saver';
import { Tooltip } from '@material-ui/core';
import base64Helper from '../../helper/base64Helper';

interface Props {
  htmlFile: string;
  fileName: string;
  extension?: string;
}

const DownloadFileAction: FC<Props> = ({ htmlFile, fileName, extension }) => {
  return (
    <Tooltip title={`Download ${extension ?? 'html'}`}>
      <GetAppIcon
        color="action"
        style={{ cursor: 'pointer' }}
        onClick={() =>
          FileSaver.saveAs(
            base64Helper.getBase64FromFile(htmlFile, 'html'),
            `${fileName}.${extension}`
          )
        }
      />
    </Tooltip>
  );
};

export default DownloadFileAction;
