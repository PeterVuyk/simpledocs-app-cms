import React, { FC } from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import JSZip from 'jszip';
import { DecisionTreeStep } from '../../../../model/DecisionTreeStep';
import { EDIT_STATUS_DRAFT, EditStatus } from '../../../../model/EditStatus';
import htmlFileInfoRepository from '../../../../firebase/database/htmlFileInfoRepository';
import { HTML_FILE_CATEGORY_DECISION_TREE } from '../../../../model/HtmlFileCategory';

interface Props {
  editStatus: EditStatus;
  decisionTreeSteps: DecisionTreeStep[];
}

const DownloadDecisionTreeHtmlFiles: FC<Props> = ({
  editStatus,
  decisionTreeSteps,
}) => {
  const handleExportHTMLFiles = (): void => {
    const zip = new JSZip();
    if (editStatus === EDIT_STATUS_DRAFT) {
      htmlFileInfoRepository
        .getHtmlInfoByCategories([HTML_FILE_CATEGORY_DECISION_TREE])
        .then((files) => {
          files.forEach((file) => {
            zip.file(`id-${file.id}.html`, file.htmlFile);
          });
          zip.generateAsync({ type: 'blob' }).then((blob) => {
            saveAs(blob, 'html-bestanden.zip');
          });
        });
      return;
    }
    decisionTreeSteps
      .filter((step) => step.htmlFile !== undefined)
      .forEach((step) => {
        zip.file(`id-${step.id}.html`, step.htmlFile);
      });
    zip.generateAsync({ type: 'blob' }).then((blob) => {
      saveAs(blob, 'html-bestanden.zip');
    });
  };

  return (
    <MenuItem key="html" onClick={() => handleExportHTMLFiles()}>
      html-bestanden.zip
    </MenuItem>
  );
};

export default DownloadDecisionTreeHtmlFiles;
