import React, { FC, ReactNode } from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { useRouteMatch } from 'react-router';
import {
  createStyles,
  withStyles,
  WithStyles,
  Theme,
} from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Hidden from '@material-ui/core/Hidden';
import Header from '../../components/header/Header';
import NavigationDrawer from './NavigationDrawer';
import Articles from '../articles/list/Articles';
import {
  AGGREGATE_INSTRUCTION_MANUAL,
  AGGREGATE_REGULATION_BRANCHERICHTLIJN_MEDISCHE_HULPVERLENING,
  AGGREGATE_REGULATION_OGS_2009,
  AGGREGATE_REGULATION_ONTHEFFING_GOEDE_TAAKUITVOERING,
  AGGREGATE_REGULATION_RVV_1990,
} from '../../model/Aggregate';
import DecisionTree from '../decisionTree/DecisionTree';
import Calculations from '../calculations/Calculations';
import Configurations from '../configurations/Configurations';
import Publications from '../publications/Publications';

const drawerWidth = 240;

const styles = (theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      minHeight: '100vh',
    },
    drawer: {
      [theme.breakpoints.up('sm')]: {
        width: drawerWidth,
        flexShrink: 0,
      },
    },
    // TODO
    footer: {
      padding: theme.spacing(2),
      background: '#fff',
    },
  });

interface Props extends WithStyles<typeof styles> {
  children: ReactNode;
}

const Navigation: FC<Props> = (props: Props) => {
  const { classes, children } = props;
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  const match = useRouteMatch<{ page: string }>();
  const { params } = match;
  const { page } = params;

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const getPage = () => {
    switch (page) {
      case 'instruction-manual':
        return <Articles articleType={AGGREGATE_INSTRUCTION_MANUAL} />;
      case 'rvv-1990':
        return <Articles articleType={AGGREGATE_REGULATION_RVV_1990} />;
      case 'regeling-ogs-2009':
        return <Articles articleType={AGGREGATE_REGULATION_OGS_2009} />;
      case 'ontheffing-goede-taakuitoefening':
        return (
          <Articles
            articleType={AGGREGATE_REGULATION_ONTHEFFING_GOEDE_TAAKUITVOERING}
          />
        );
      case 'brancherichtlijn-medische-hulpverlening':
        return (
          <Articles
            articleType={
              AGGREGATE_REGULATION_BRANCHERICHTLIJN_MEDISCHE_HULPVERLENING
            }
          />
        );
      case 'decision-tree':
        return <DecisionTree />;
      case 'calculations':
        return <Calculations />;
      case 'configurations':
        return <Configurations />;
      case 'publications':
      default:
        return <Publications />;
    }
  };

  return (
    <div className={classes.root}>
      <CssBaseline />
      <nav className={classes.drawer}>
        <Hidden smUp implementation="js">
          <NavigationDrawer
            PaperProps={{ style: { width: drawerWidth } }}
            variant="temporary"
            open={drawerOpen}
            onClose={handleDrawerToggle}
            currentPage={page}
          />
        </Hidden>
        <Hidden xsDown implementation="css">
          <NavigationDrawer
            currentPage={page}
            PaperProps={{ style: { width: drawerWidth } }}
          />
        </Hidden>
      </nav>
      <Header onDrawerToggle={handleDrawerToggle}>
        {page && getPage()}
        {!page && children && children}
      </Header>
    </div>
  );
};

export default withStyles(styles)(Navigation);
