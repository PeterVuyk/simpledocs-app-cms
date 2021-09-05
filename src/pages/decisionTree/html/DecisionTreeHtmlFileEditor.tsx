import React, { FC } from 'react';
import { useParams } from 'react-router-dom';
import HtmlInfoEditor from '../../../components/artifact/HtmlInfoEditor';
import { ARTIFACT_TYPE_DECISION_TREE } from '../../../model/ArtifactType';

const DecisionTreeHtmlFileEditor: FC = () => {
  const { artifactId } = useParams<{ artifactId: string }>();

  return (
    <HtmlInfoEditor
      artifactType={ARTIFACT_TYPE_DECISION_TREE}
      artifactId={artifactId}
    />
  );
};

export default DecisionTreeHtmlFileEditor;
