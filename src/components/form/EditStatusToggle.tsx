import React from 'react';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import EditIcon from '@material-ui/icons/Edit';
import PublicIcon from '@material-ui/icons/Public';

interface Props {
  setEditStatus: (editStatus: 'draft' | 'published') => void;
  editStatus: 'draft' | 'published';
}

const EditStatusToggle: React.FC<Props> = ({ editStatus, setEditStatus }) => {
  const handleStatus = (
    event: React.MouseEvent<HTMLElement>,
    status: string | null
  ) => {
    if (status === 'draft' || status === 'published') {
      setEditStatus(status);
    }
  };

  return (
    <ToggleButtonGroup
      style={{ display: 'inline-block' }}
      size="small"
      value={editStatus}
      exclusive
      onChange={handleStatus}
      aria-label="text alignment"
    >
      <ToggleButton value="draft" aria-label="left aligned">
        <EditIcon />
      </ToggleButton>
      <ToggleButton value="published" aria-label="right aligned">
        <PublicIcon />
      </ToggleButton>
    </ToggleButtonGroup>
  );
};

export default EditStatusToggle;
