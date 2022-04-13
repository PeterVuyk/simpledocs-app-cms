import React, { FC } from 'react';
import { EditTwoTone } from '@mui/icons-material';
import { Tooltip } from '@mui/material';
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
    <Tooltip disableInteractive title="Wijzigen">
      <EditTwoTone style={{ cursor: 'pointer' }} onClick={handleClick} />
    </Tooltip>
  );
};

export default EditItemAction;
