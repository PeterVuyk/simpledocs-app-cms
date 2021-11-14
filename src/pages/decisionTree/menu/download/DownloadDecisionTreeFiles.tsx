import React, { FC } from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import JSZip from 'jszip';
import { DecisionTreeStep } from '../../../../model/DecisionTreeStep';
import { EDIT_STATUS_DRAFT, EditStatus } from '../../../../model/EditStatus';
import artifactsRepository from '../../../../firebase/database/artifactsRepository';
import { ARTIFACT_TYPE_DECISION_TREE } from '../../../../model/artifacts/ArtifactType';
import { getExtensionFromContentType } from '../../../../model/artifacts/Artifact';

interface Props {
  editStatus: EditStatus;
  decisionTreeSteps: DecisionTreeStep[];
}

const DownloadDecisionTreeFiles: FC<Props> = ({
  editStatus,
  decisionTreeSteps,
}) => {
  const handleExportFiles = (): void => {
    const zip = new JSZip();
    if (editStatus === EDIT_STATUS_DRAFT) {
      artifactsRepository
        .getArtifactsByCategories([ARTIFACT_TYPE_DECISION_TREE])
        .then((artifacts) => {
          artifacts.forEach((artifact) => {
            zip.file(
              `id-${artifact.id}.${getExtensionFromContentType(
                artifact.contentType
              )}`,
              artifact.content
            );
          });
          zip.generateAsync({ type: 'blob' }).then((blob) => {
            saveAs(blob, 'beslisboom-bestanden.zip');
          });
        });
      return;
    }
    decisionTreeSteps
      .filter((step) => step.content !== undefined)
      .filter((step) => step.contentType !== undefined)
      .forEach((step) => {
        zip.file(
          `id-${step.id}.${getExtensionFromContentType(step.contentType!)}`,
          step.content!
        );
      });
    zip.generateAsync({ type: 'blob' }).then((blob) => {
      saveAs(blob, 'beslisboom-bestanden.zip');
    });
  };

  return (
    <MenuItem key="zip" onClick={() => handleExportFiles()}>
      beslisboom-bestanden.zip
    </MenuItem>
  );
};

export default DownloadDecisionTreeFiles;
