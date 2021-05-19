import React, { useEffect } from 'react';
import { Tabs, Tab, Grid } from '@material-ui/core';
// eslint-disable-next-line import/no-extraneous-dependencies
import { useRouteMatch } from 'react-router';
import { useHistory } from 'react-router-dom';
import CssBaseline from '@material-ui/core/CssBaseline';
import RegulationsList from './regulations/regulationList/RegulationsList';
import Publications from './publications/Publications';
import Header from '../components/header/Header';
import DecisionTree from './decisionTree/DecisionTree';

interface Props {
  children: React.ReactNode;
}

const Navigation: React.FC<Props> = ({ children }) => {
  const match = useRouteMatch<{ page: string }>();
  const history = useHistory();

  const { params } = match;
  const { page } = params;

  const getIndexToTabName = {
    regulations: 0,
    decisionTree: 1,
    publications: 2,
  };

  const [selectedTab, setSelectedTab] = React.useState<number | undefined>(
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    getIndexToTabName[page]
  );

  useEffect(() => {
    if (page === 'regulations') {
      setSelectedTab(0);
    }
    if (page === 'decision-tree') {
      setSelectedTab(1);
    }
    if (page === 'publications') {
      setSelectedTab(2);
    }
  }, [page]);

  const handleChange = (event: any, newValue: number) => {
    if (newValue === 0) {
      history.push('/regulations');
    }
    if (newValue === 1) {
      history.push('/decision-tree');
    }
    if (newValue === 2) {
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
              <Tab label="Regelgevingen" />
              <Tab label="Beslisboom" />
              <Tab label="Publiceren" />
            </Tabs>
          </Header>
        </Grid>
        <Grid item container>
          <Grid item sm={false} lg={2} />
          <Grid item sm={12} lg={8}>
            <CssBaseline />
            {selectedTab === 0 && <RegulationsList />}
            {selectedTab === 1 && <DecisionTree />}
            {selectedTab === 2 && <Publications />}
            {children && children}
          </Grid>
          <Grid item sm={false} lg={2} />
        </Grid>
      </Grid>
    </>
  );
};

export default Navigation;
