import React, { FC } from 'react';
import Button from '@material-ui/core/Button';
import { TextFieldProps } from '@material-ui/core/TextField';
import FilterNoneIcon from '@material-ui/icons/FilterNone';
import { Tooltip } from '@material-ui/core';

interface Props {
  textField: TextFieldProps | undefined;
  disabled: boolean;
}

const CopyToClipboardAction: FC<Props> = ({ textField, disabled }) => {
  const copyBase64ToClipboardHandle = (e: any) => {
    // @ts-ignore
    textField?.select();
    document.execCommand('copy');
    e.target.focus();
  };

  return (
    <div
      style={{
        float: 'right',
        marginLeft: 8,
      }}
    >
      <Tooltip title="Kopieer naar klembord">
        <div>
          <Button
            onClick={copyBase64ToClipboardHandle}
            variant="contained"
            disabled={disabled}
          >
            <FilterNoneIcon />
          </Button>
        </div>
      </Tooltip>
    </div>
  );
};

export default CopyToClipboardAction;
