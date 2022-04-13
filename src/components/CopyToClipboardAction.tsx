import React, { FC } from 'react';
import Button from '@mui/material/Button';
import FilterNoneIcon from '@mui/icons-material/FilterNone';
import { Tooltip } from '@mui/material';
import utilHelper from '../helper/utilHelper';

interface Props {
  textToCopy: string;
  disabled?: boolean;
}

const CopyToClipboardAction: FC<Props> = ({ textToCopy, disabled }) => {
  return (
    <Tooltip disableInteractive title="Kopieer naar klembord">
      <div>
        <span>
          <Button
            onClick={() => utilHelper.copyText(textToCopy)}
            variant="contained"
            color="inherit"
            disabled={disabled === undefined ? false : disabled}
          >
            <FilterNoneIcon />
          </Button>
        </span>
      </div>
    </Tooltip>
  );
};

export default CopyToClipboardAction;
