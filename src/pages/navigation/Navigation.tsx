import React, { FC, ReactNode, useEffect, useState } from 'react';
import { Tabs, Tab, Grid } from '@material-ui/core';
// eslint-disable-next-line import/no-extraneous-dependencies
import { useRouteMatch } from 'react-router';
import { useHistory } from 'react-router-dom';
import CssBaseline from '@material-ui/core/CssBaseline';
import Publications from '../publications/Publications';
import Header from '../../components/header/Header';
import DecisionTree from '../decisionTree/DecisionTree';
import Calculations from '../calculations/Calculations';
import Articles from '../articles/list/Articles';
import { AT_INSTRUCTION_MANUAL } from '../../model/ArticleType';
import RegulationNavigationMenu from './RegulationNavigationMenu';
import articleTypeHelper from '../../helper/articleTypeHelper';

interface Props {
  children: ReactNode;
}

const Navigation: FC<Props> = ({ children }) => {
  const [regulationsMenu, setRegulationsMenu] = useState<null | HTMLElement>(
    null
  );
  const match = useRouteMatch<{ page: string }>();
  const history = useHistory();

  const { params } = match;
  const { page } = params;

  const getIndexToTabName = {
    instructionManual: 0,
    regulations: 1,
    decisionTree: 2,
    calculations: 3,
    publications: 4,
  };

  const [selectedTab, setSelectedTab] = useState<number | undefined>(
    // @ts-ignore
    getIndexToTabName[page]
  );

  useEffect(() => {
    if (page === 'instruction-manual') {
      setSelectedTab(0);
    }
    if (
      page === 'rvv-1990' ||
      page === 'brancherichtlijn-medische-hulpverlening' ||
      page === 'regeling-ogs-2009' ||
      page === 'ontheffing-goede-taakuitoefening'
    ) {
      setSelectedTab(1);
    }
    if (page === 'decision-tree') {
      setSelectedTab(2);
    }
    if (page === 'calculations') {
      setSelectedTab(3);
    }
    if (page === 'publications') {
      setSelectedTab(4);
    }
  }, [page]);

  const handleChange = (event: any, newValue: number) => {
    if (newValue === 0) {
      history.push('/article/instruction-manual');
    }
    if (newValue === 1) {
      setRegulationsMenu(event.currentTarget);
    }
    if (newValue === 2) {
      history.push('/decision-tree');
    }
    if (newValue === 3) {
      history.push('/calculations');
    }
    if (newValue === 4) {
      history.push('/publications');
    }
  };

  return (
    <>
      <Grid spacing={0} container direction="column">
        <Grid item container>
          <Header>
            <Tabs
              textColor="inherit"
              value={selectedTab ?? false}
              onChange={handleChange}
            >
              <Tab label="Handboek" />
              <Tab label="Regelgeving" />
              <Tab label="Beslisboom" />
              <Tab label="Berekeningen" />
              <Tab label="Publiceren" />
            </Tabs>
            <RegulationNavigationMenu
              regulationsMenu={regulationsMenu}
              setRegulationsMenu={setRegulationsMenu}
            />
          </Header>
        </Grid>
        <Grid item container>
          <Grid item sm={false} lg={1} />
          <Grid item sm={10} lg={10}>
            <CssBaseline />
            {selectedTab === 0 && (
              <Articles articleType={AT_INSTRUCTION_MANUAL} />
            )}
            {selectedTab === 1 && page !== '' && (
              <Articles
                articleType={articleTypeHelper.dashedPathToArticleType(page)}
              />
            )}
            {selectedTab === 2 && <DecisionTree />}
            {selectedTab === 3 && <Calculations />}
            {selectedTab === 4 && <Publications />}
            {children && children}
          </Grid>
          <Grid item sm={false} lg={1} />
        </Grid>
      </Grid>
    </>
  );
};

export default Navigation;
