import React, { FC } from 'react';
import Button from '@material-ui/core/Button';
import FilterNoneIcon from '@material-ui/icons/FilterNone';
import { Tooltip } from '@material-ui/core';

interface Props {
  textToCopy: string;
  disabled?: boolean;
}

const CopyToClipboardAction: FC<Props> = ({ textToCopy, disabled }) => {
  const copyText = () => {
    const el = document.createElement('textarea');
    el.value = textToCopy;
    el.setAttribute('readonly', '');
    el.style.position = 'absolute';
    el.style.left = '-9999px';
    document.body.appendChild(el);
    el.select();
    el.focus();
    document.execCommand('copy');
    document.body.removeChild(el);
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
            onClick={copyText}
            variant="contained"
            disabled={disabled === undefined ? false : disabled}
          >
            <FilterNoneIcon />
          </Button>
        </div>
      </Tooltip>
    </div>
  );
};

export default CopyToClipboardAction;
