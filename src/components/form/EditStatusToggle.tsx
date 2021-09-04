import React, { FC } from 'react';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import { Tooltip } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import PublicIcon from '@material-ui/icons/Public';
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
    <Tooltip title="concepten / gepubliceerd">
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
    </Tooltip>
  );
};

export default EditStatusToggle;
