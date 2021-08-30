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
import NotFound from '../NotFound';
import navigationConfig from './navigationConfig.json';
import { NavigationConfig } from '../../model/NavigationConfig';
import HtmlLayout from '../htmlLayout/HtmlLayout';

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
  });

interface Props extends WithStyles<typeof styles> {
  children: ReactNode;
}

const Navigation: FC<Props> = ({ classes, children }) => {
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const match = useRouteMatch<{ page: string }>();
  const configs = navigationConfig as NavigationConfig;

  const { params } = match;
  const { page } = params;

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const getPage = () => {
    switch (page) {
      case 'instruction-manual':
        return <Articles bookType={AGGREGATE_INSTRUCTION_MANUAL} />;
      case 'rvv-1990':
        return <Articles bookType={AGGREGATE_REGULATION_RVV_1990} />;
      case 'regeling-ogs-2009':
        return <Articles bookType={AGGREGATE_REGULATION_OGS_2009} />;
      case 'ontheffing-goede-taakuitoefening':
        return (
          <Articles
            bookType={AGGREGATE_REGULATION_ONTHEFFING_GOEDE_TAAKUITVOERING}
          />
        );
      case 'brancherichtlijn-medische-hulpverlening':
        return (
          <Articles
            bookType={
              AGGREGATE_REGULATION_BRANCHERICHTLIJN_MEDISCHE_HULPVERLENING
            }
          />
        );
      case 'html-layout':
        return <HtmlLayout />;
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

  const slugExist = () => {
    const urlSlugs = [
      ...configs.books.listItems.map((item) => item.urlSlug),
      ...configs.menu.listItems.map((item) => item.urlSlug),
    ];
    return urlSlugs.find((slug) => slug === page);
  };

  if (!slugExist() && !children) {
    return <NotFound />;
  }

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
