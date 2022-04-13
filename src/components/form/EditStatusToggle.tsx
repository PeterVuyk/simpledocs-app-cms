import React, { FC } from 'react';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { Tooltip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import PublicIcon from '@mui/icons-material/Public';
import {
  EDIT_STATUS_DRAFT,
  EDIT_STATUS_PUBLISHED,
  EditStatus,
} from '../../model/EditStatus';

interface Props {
  setEditStatus: (editStatus: EditStatus) => void;
  editStatus: EditStatus;
}

const EditStatusToggle: FC<Props> = ({ editStatus, setEditStatus }) => {
  const handleStatus = (
    event: React.MouseEvent<HTMLElement>,
    status: string | null
  ) => {
    if (status === EDIT_STATUS_DRAFT || status === EDIT_STATUS_PUBLISHED) {
      setEditStatus(status);
    }
  };

  return (
    <Tooltip disableInteractive title="concepten / gepubliceerd">
      <ToggleButtonGroup
        style={{ display: 'inline-block' }}
        size="small"
        value={editStatus}
        exclusive
        onChange={handleStatus}
      >
        <ToggleButton value="draft">
          <EditIcon />
        </ToggleButton>
        <ToggleButton value="published">
          <PublicIcon />
        </ToggleButton>
      </ToggleButtonGroup>
    </Tooltip>
  );
};

export default EditStatusToggle;
