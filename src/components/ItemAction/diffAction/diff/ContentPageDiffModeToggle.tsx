import React, { FC } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import 'diff2html/bundles/css/diff2html.min.css';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import ToggleButton from '@material-ui/lab/ToggleButton';
import TextFieldsIcon from '@material-ui/icons/TextFields';
import CodeIcon from '@material-ui/icons/Code';
import { Tooltip } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  container: {
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(3),
  },
  icon: {
    width: 45,
  },
}));

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
        aria-label="text alignment"
      >
        <ToggleButton value="text" aria-label="left aligned">
          <TextFieldsIcon />
        </ToggleButton>
        <ToggleButton value="source" aria-label="right aligned">
          <CodeIcon />
        </ToggleButton>
      </ToggleButtonGroup>
    </Tooltip>
  );
};

export default ContentPageDiffModeToggle;
