import React, { FC } from 'react';
import { useParams } from 'react-router-dom';
import ArtifactEditor from '../../components/artifact/ArtifactEditor';
import { ArtifactType } from '../../model/artifacts/ArtifactType';

const StyleEditor: FC = () => {
  const { artifactType, artifactId } = useParams<{
    artifactType: ArtifactType;
    artifactId: string;
  }>();

  return <ArtifactEditor artifactType={artifactType} artifactId={artifactId} />;
};

export default StyleEditor;
