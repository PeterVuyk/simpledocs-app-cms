import React, { FC } from 'react';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { CalculationInfo } from '../../../model/calculations/CalculationInfo';

interface Props {
  removeMenuElement: null | HTMLElement;
  setRemoveMenuElement: (anchorEL: null | HTMLElement) => void;
  calculationInfos: CalculationInfo[];
  onSubmitAction: (calculationInfo: CalculationInfo) => void;
}

const RemoveDecisionTreeMenu: FC<Props> = ({
  removeMenuElement,
  setRemoveMenuElement,
  calculationInfos,
  onSubmitAction,
}) => {
  const handleClose = () => {
    setRemoveMenuElement(null);
  };

  const handleSubmit = (info: CalculationInfo) => {
    handleClose();
    onSubmitAction(info);
  };

  return (
    <Menu
      id="remove-calculations-menu"
      anchorEl={removeMenuElement}
      keepMounted
      open={Boolean(removeMenuElement)}
      onClose={handleClose}
    >
      {calculationInfos.map((info) => (
        <MenuItem key={info.title} onClick={() => handleSubmit(info)}>
          {info.title}
        </MenuItem>
      ))}
    </Menu>
  );
};

export default RemoveDecisionTreeMenu;
