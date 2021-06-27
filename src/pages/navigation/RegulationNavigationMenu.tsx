import React, { FC } from 'react';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { useHistory } from 'react-router-dom';

interface Props {
  regulationsMenu: null | HTMLElement;
  setRegulationsMenu: (anchorEL: null | HTMLElement) => void;
}

const RegulationNavigationMenu: FC<Props> = ({
  regulationsMenu,
  setRegulationsMenu,
}) => {
  const handleClose = () => {
    setRegulationsMenu(null);
  };
  const history = useHistory();

  const regulations = {
    'RVV 1990': 'rvv-1990',
    'Regeling OGS 2009': 'regeling-ogs-2009',
    'Ontheffing goede taakuitoefening': 'ontheffing-goede-taakuitoefening',
    'Brancherichtlijn medische hulpverlening':
      'brancherichtlijn-medische-hulpverlening',
  };

  const onClick = (path: string) => {
    handleClose();
    history.push(`/article/${path}`);
  };

  return (
    <>
      <Menu
        id="regulations-menu"
        anchorEl={regulationsMenu}
        keepMounted
        open={Boolean(regulationsMenu)}
        onClose={handleClose}
      >
        {Object.entries(regulations).map(([title, path]) => (
          <MenuItem key={path} onClick={() => onClick(path)}>
            {title}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default RegulationNavigationMenu;
