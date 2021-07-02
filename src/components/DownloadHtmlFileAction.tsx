import React, { FC } from 'react';
import GetAppIcon from '@material-ui/icons/GetApp';
import FileSaver from 'file-saver';
import fileHelper from '../helper/fileHelper';

interface Props {
  htmlFile: string;
  fileName: string;
}

const DownloadHtmlFileAction: FC<Props> = ({ htmlFile, fileName }) => {
  return (
    <GetAppIcon
      color="action"
      style={{ cursor: 'pointer' }}
      onClick={() =>
        FileSaver.saveAs(
          fileHelper.getBase64FromHtml(htmlFile),
          `${fileName}.html`
        )
      }
    />
  );
};

export default DownloadHtmlFileAction;
