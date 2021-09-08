import React, { FC } from 'react';
import { useParams } from 'react-router-dom';
import ArtifactEditor from '../../../components/artifact/ArtifactEditor';
import { ARTIFACT_TYPE_DECISION_TREE } from '../../../model/ArtifactType';

const DecisionTreeArtifactEditor: FC = () => {
  const { artifactId } = useParams<{ artifactId: string }>();

  return (
    <ArtifactEditor
      artifactType={ARTIFACT_TYPE_DECISION_TREE}
      artifactId={artifactId}
    />
  );
};

export default DecisionTreeArtifactEditor;
