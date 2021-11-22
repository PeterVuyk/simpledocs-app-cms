import React, { FC, useState } from 'react';
import FilterNoneIcon from '@material-ui/icons/FilterNone';
import { Tooltip } from '@material-ui/core';
import { Article } from '../../../model/Article';
import CopyArticleDialog from './CopyArticleDialog';

interface Props {
  article: Article;
  bookType: string;
}

const CopyArticleAction: FC<Props> = ({ bookType, article }) => {
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  return (
    <>
      <Tooltip title="Kopieer pagina">
        <FilterNoneIcon
          style={{
            cursor: 'pointer',
          }}
          onClick={() => setOpenDialog(true)}
        />
      </Tooltip>
      {openDialog && (
        <CopyArticleDialog
          bookType={bookType}
          article={article}
          onClose={() => setOpenDialog(false)}
        />
      )}
    </>
  );
};

export default CopyArticleAction;
