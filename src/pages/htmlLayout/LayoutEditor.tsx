import React, { FC } from 'react';
import { useParams } from 'react-router-dom';
import HtmlInfoEditor from '../../components/htmlInfo/HtmlInfoEditor';
import { HtmlFileCategory } from '../../model/HtmlFileCategory';

const LayoutEditor: FC = () => {
  const { htmlFileCategory, htmlFileId } =
    useParams<{ htmlFileCategory: HtmlFileCategory; htmlFileId: string }>();

  return (
    <HtmlInfoEditor
      htmlFileCategory={htmlFileCategory}
      htmlFileId={htmlFileId}
    />
  );
};

export default LayoutEditor;
