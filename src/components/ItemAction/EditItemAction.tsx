import React, { FC } from 'react';
import { EditTwoTone } from '@material-ui/icons';
import { Tooltip } from '@material-ui/core';
import useNavigate from '../../navigation/useNavigate';

interface Props {
  urlSlug?: string;
  onClick?: () => void;
}

const EditItemAction: FC<Props> = ({ urlSlug, onClick }) => {
  const { navigate } = useNavigate();

  const handleClick = (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
    if (onClick !== undefined) {
      onClick();
      return;
    }
    if (urlSlug !== undefined) {
      navigate(e, urlSlug);
    }
  };

  return (
    <Tooltip title="Wijzigen">
      <EditTwoTone style={{ cursor: 'pointer' }} onClick={handleClick} />
    </Tooltip>
  );
};

export default EditItemAction;
