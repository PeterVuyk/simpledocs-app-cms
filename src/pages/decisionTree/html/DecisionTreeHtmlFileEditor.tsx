import React, { FC } from 'react';
import { useParams } from 'react-router-dom';
import { HTML_FILE_CATEGORY_DECISION_TREE } from '../../../model/HtmlFileCategory';
import HtmlInfoEditor from '../../../components/htmlInfo/HtmlInfoEditor';

const DecisionTreeHtmlFileEditor: FC = () => {
  const { htmlFileId } = useParams<{ htmlFileId: string }>();

  return (
    <HtmlInfoEditor
      htmlFileCategory={HTML_FILE_CATEGORY_DECISION_TREE}
      htmlFileId={htmlFileId}
    />
  );
};

export default DecisionTreeHtmlFileEditor;
