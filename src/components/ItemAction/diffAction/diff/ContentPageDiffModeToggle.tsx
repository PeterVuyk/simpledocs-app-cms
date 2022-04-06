import React, { FC } from 'react';
import 'diff2html/bundles/css/diff2html.min.css';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import ToggleButton from '@material-ui/lab/ToggleButton';
import TextFieldsIcon from '@material-ui/icons/TextFields';
import CodeIcon from '@material-ui/icons/Code';
import { Tooltip } from '@material-ui/core';

interface Props {
  diffModeToggle: string;
  setDiffModeToggle: (mode: string) => void;
}

const ContentPageDiffModeToggle: FC<Props> = ({
  diffModeToggle,
  setDiffModeToggle,
}) => {
  const handleToggle = (
    event: React.MouseEvent<HTMLElement>,
    status: string | null
  ) => {
    if (status === 'source' || status === 'text') {
      setDiffModeToggle(status);
    }
  };

  return (
    <Tooltip title="Tekstuele wijzigingen / Broncode wijzigingen">
      <ToggleButtonGroup
        style={{ display: 'inline-block' }}
        size="small"
        value={diffModeToggle}
        exclusive
        onChange={handleToggle}
      >
        <ToggleButton value="text">
          <TextFieldsIcon />
        </ToggleButton>
        <ToggleButton value="source">
          <CodeIcon />
        </ToggleButton>
      </ToggleButtonGroup>
    </Tooltip>
  );
};

export default ContentPageDiffModeToggle;
