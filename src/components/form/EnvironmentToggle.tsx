import React from 'react';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import EditIcon from '@material-ui/icons/Edit';
import PublicIcon from '@material-ui/icons/Public';

const EnvironmentToggle: React.FC = () => {
  const [alignment, setAlignment] = React.useState<string>('right');

  const handleAlignment = (
    event: React.MouseEvent<HTMLElement>,
    newAlignment: string | null
  ) => {
    if (newAlignment === null) {
      return;
    }
    setAlignment(newAlignment);
  };

  return (
    <ToggleButtonGroup
      style={{ display: 'inline-block' }}
      size="small"
      value={alignment}
      exclusive
      onChange={handleAlignment}
      aria-label="text alignment"
    >
      <ToggleButton value="left" aria-label="left aligned">
        <EditIcon />
      </ToggleButton>
      <ToggleButton value="right" aria-label="right aligned">
        <PublicIcon />
      </ToggleButton>
    </ToggleButtonGroup>
  );
};

export default EnvironmentToggle;
