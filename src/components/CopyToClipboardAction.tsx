import React, { FC } from 'react';
import Button from '@material-ui/core/Button';
import FilterNoneIcon from '@material-ui/icons/FilterNone';
import { Tooltip } from '@material-ui/core';
import utilHelper from '../helper/utilHelper';

interface Props {
  textToCopy: string;
  disabled?: boolean;
}

const CopyToClipboardAction: FC<Props> = ({ textToCopy, disabled }) => {
  return (
    <div
      style={{
        float: 'right',
        marginLeft: 8,
      }}
    >
      <Tooltip title="Kopieer naar klembord">
        <div>
          <span>
            <Button
              onClick={() => utilHelper.copyText(textToCopy)}
              variant="contained"
              disabled={disabled === undefined ? false : disabled}
            >
              <FilterNoneIcon />
            </Button>
          </span>
        </div>
      </Tooltip>
    </div>
  );
};

export default CopyToClipboardAction;
