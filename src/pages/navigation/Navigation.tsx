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
import {
  ARTICLE_TYPE_INSTRUCTION_MANUAL,
  ARTICLE_TYPE_REGULATIONS,
} from '../../model/ArticleType';

interface Props {
  children: ReactNode;
  gridWidth: 'default' | 'wide';
}

const Navigation: FC<Props> = ({ children, gridWidth }) => {
  const match = useRouteMatch<{ page: string }>();
  const history = useHistory();

  const { params } = match;
  const { page } = params;

  const getIndexToTabName = {
    regulations: 0,
    instructionManual: 1,
    decisionTree: 2,
    calculations: 3,
    publications: 4,
  };

  const [selectedTab, setSelectedTab] = useState<number | undefined>(
    // @ts-ignore
    getIndexToTabName[page]
  );

  useEffect(() => {
    if (page === 'regulations') {
      setSelectedTab(0);
    }
    if (page === 'instruction-manual') {
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
      history.push('/regulations');
    }
    if (newValue === 1) {
      history.push('/instruction-manual');
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

  const defaultGridWidth = () => {
    return (
      <Grid item container>
        <Grid item sm={false} lg={2} />
        <Grid item sm={12} lg={8}>
          <CssBaseline />
          {selectedTab === 0 && (
            <Articles articleType={ARTICLE_TYPE_REGULATIONS} />
          )}
          {selectedTab === 1 && (
            <Articles articleType={ARTICLE_TYPE_INSTRUCTION_MANUAL} />
          )}
          {selectedTab === 2 && <DecisionTree />}
          {selectedTab === 3 && <Calculations />}
          {selectedTab === 4 && <Publications />}
          {children && children}
        </Grid>
        <Grid item sm={false} lg={2} />
      </Grid>
    );
  };

  const wideGridWidth = () => {
    return (
      <Grid item container>
        <Grid item sm={false} lg={1} />
        <Grid item sm={10} lg={10}>
          <CssBaseline />
          {children && children}
        </Grid>
        <Grid item sm={false} lg={1} />
      </Grid>
    );
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
              <Tab label="Regelgeving" />
              <Tab label="Handboek" />
              <Tab label="Beslisboom" />
              <Tab label="Berekeningen" />
              <Tab label="Publiceren" />
            </Tabs>
          </Header>
        </Grid>
        {gridWidth === 'default' && defaultGridWidth()}
        {gridWidth === 'wide' && wideGridWidth()}
      </Grid>
    </>
  );
};

export default Navigation;
