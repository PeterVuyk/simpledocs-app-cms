import React, { FC, useState } from 'react';
import { Tooltip } from '@material-ui/core';
import CompareArrowsIcon from '@material-ui/icons/CompareArrows';
import Button from '@material-ui/core/Button';
import DiffDecisionTreeMenu from './DiffDecisionTreeMenu';
import { DecisionTree } from '../../../../model/DecisionTree/DecisionTree';

interface Props {
  decisionTrees: DecisionTree[];
}

const DiffDecisionTreeAction: FC<Props> = ({ decisionTrees }) => {
  const [decisionTreeDiffMenu, setDecisionTreeDiffMenu] =
    useState<null | HTMLElement>(null);

  const openDownloadMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setDecisionTreeDiffMenu(event.currentTarget);
  };

  const getTitles = () => {
    const publishedTitles = decisionTrees
      .filter((value) => !value.isDraft)
      .map((value) => value.title);
    const conceptTitles = decisionTrees
      .filter((value) => value.isDraft)
      .map((value) => value.title);

    return publishedTitles.filter((value) => conceptTitles.includes(value));
  };

  if (getTitles().length === 0) {
    return null;
  }

  return (
    <>
      <Tooltip title="Bekijk de wijzigingen">
        <Button variant="contained" color="primary" onClick={openDownloadMenu}>
          <CompareArrowsIcon />
        </Button>
      </Tooltip>
      <DiffDecisionTreeMenu
        setDecisionTreeDiffMenu={setDecisionTreeDiffMenu}
        decisionTreeDiffMenu={decisionTreeDiffMenu}
        titles={getTitles()}
      />
    </>
  );
};

export default DiffDecisionTreeAction;
