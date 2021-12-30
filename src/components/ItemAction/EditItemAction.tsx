import React, { FC } from 'react';
import { EditTwoTone } from '@material-ui/icons';
import { Tooltip } from '@material-ui/core';
import useNavigate from '../../navigation/useNavigate';

interface Props {
  urlSlug: string;
}

const EditItemAction: FC<Props> = ({ urlSlug }) => {
  const { navigate } = useNavigate();

  return (
    <Tooltip title="Wijzigen">
      <EditTwoTone
        style={{ cursor: 'pointer' }}
        onClick={(e) => navigate(e, urlSlug)}
      />
    </Tooltip>
  );
};

export default EditItemAction;
