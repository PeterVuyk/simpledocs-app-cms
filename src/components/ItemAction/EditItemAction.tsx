import React, { FC } from 'react';
import { EditTwoTone } from '@material-ui/icons';
import { Tooltip } from '@material-ui/core';
import { useHistory } from 'react-router-dom';

interface Props {
  urlSlug: string;
}

const EditItemAction: FC<Props> = ({ urlSlug }) => {
  const history = useHistory();

  return (
    <Tooltip title="Wijzigen">
      <EditTwoTone
        style={{ cursor: 'pointer' }}
        onClick={() => history.push(urlSlug)}
      />
    </Tooltip>
  );
};

export default EditItemAction;
