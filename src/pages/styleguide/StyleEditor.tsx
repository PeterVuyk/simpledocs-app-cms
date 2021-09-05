import React, { FC } from 'react';
import { useParams } from 'react-router-dom';
import HtmlInfoEditor from '../../components/artifact/HtmlInfoEditor';
import { ArtifactType } from '../../model/ArtifactType';

const StyleEditor: FC = () => {
  const { artifactType, artifactId } =
    useParams<{ artifactType: ArtifactType; artifactId: string }>();

  return <HtmlInfoEditor artifactType={artifactType} artifactId={artifactId} />;
};

export default StyleEditor;
