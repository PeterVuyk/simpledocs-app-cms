import React, { FC, useState } from 'react';
import Button from '@material-ui/core/Button';
import 'jsoneditor-react/es/editor.min.css';
import { Tooltip } from '@material-ui/core';
import TransformIcon from '@material-ui/icons/Transform';
import Base64TransformerDialog from './Base64TransformerDialog';

const Base64TransformerButton: FC = () => {
  const [openBase64TransformerDialog, setOpenBase64TransformerDialog] =
    useState<boolean>(false);

  return (
    <>
      <Tooltip title="Transformeer SVG < > Base64">
        <Button
          variant="contained"
          onClick={() => setOpenBase64TransformerDialog(true)}
        >
          <TransformIcon />
        </Button>
      </Tooltip>
      {openBase64TransformerDialog && (
        <Base64TransformerDialog
          openBase64TransformerDialog={openBase64TransformerDialog}
          setOpenBase64TransformerDialog={setOpenBase64TransformerDialog}
        />
      )}
    </>
  );
};

export default Base64TransformerButton;
