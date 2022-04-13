import React, { FC } from 'react';
import 'diff2html/bundles/css/diff2html.min.css';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import ToggleButton from '@mui/material/ToggleButton';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import CodeIcon from '@mui/icons-material/Code';
import { Tooltip } from '@mui/material';

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
    <Tooltip
      disableInteractive
      title="Tekstuele wijzigingen / Broncode wijzigingen"
    >
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
