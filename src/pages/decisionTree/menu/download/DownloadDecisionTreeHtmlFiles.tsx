import React, { FC } from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import JSZip from 'jszip';
import { DecisionTreeStep } from '../../../../model/DecisionTreeStep';
import { EDIT_STATUS_DRAFT, EditStatus } from '../../../../model/EditStatus';
import artifactsRepository from '../../../../firebase/database/artifactsRepository';
import { ARTIFACT_TYPE_DECISION_TREE } from '../../../../model/ArtifactType';

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
      artifactsRepository
        .getArtifactsByCategories([ARTIFACT_TYPE_DECISION_TREE])
        .then((artifacts) => {
          artifacts.forEach((artifact) => {
            zip.file(`id-${artifact.id}.html`, artifact.file);
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
