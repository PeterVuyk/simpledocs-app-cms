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
import Header from '../components/header/Header';
import NavigationDrawer from './NavigationDrawer';
import Articles from '../pages/articles/list/Articles';
import DecisionTree from '../pages/decisionTree/DecisionTree';
import Calculations from '../pages/calculations/Calculations';
import Publications from '../pages/publications/Publications';
import NotFound from '../pages/NotFound';
import Styleguide from '../pages/styleguide/Styleguide';
import useConfiguration from '../configuration/useConfiguration';
import AppConfigurationsPage from '../pages/appConfigurations/AppConfigurationsPage';
import CmsConfigurations from '../pages/cmsConfigurations/CmsConfigurations';

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
  const { configuration, slugExist, getBookTypeFromUrlSlug } =
    useConfiguration();

  const { params } = match;
  const { page } = params;

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const getPage = () => {
    const article = Object.values(configuration.books.bookItems).find(
      (item) => item.urlSlug === page
    );
    if (article) {
      return (
        <Articles
          title={article.title}
          bookType={getBookTypeFromUrlSlug(page)}
        />
      );
    }
    switch (page) {
      case configuration.menu.menuItems.styleguide.urlSlug:
        return (
          <Styleguide title={configuration.menu.menuItems.styleguide.title} />
        );
      case configuration.menu.menuItems.decisionTree.urlSlug:
        return (
          <DecisionTree
            title={configuration.menu.menuItems.decisionTree.title}
          />
        );
      case configuration.menu.menuItems.calculations.urlSlug:
        return (
          <Calculations
            title={configuration.menu.menuItems.calculations.title}
          />
        );
      case configuration.menu.menuItems.appConfigurations.urlSlug:
        return (
          <AppConfigurationsPage
            title={configuration.menu.menuItems.appConfigurations.title}
          />
        );
      case configuration.menu.menuItems.cmsConfigurations.urlSlug:
        return (
          <CmsConfigurations
            title={configuration.menu.menuItems.cmsConfigurations.title}
          />
        );
      case configuration.menu.menuItems.publications.urlSlug:
      default:
        return (
          <Publications
            title={configuration.menu.menuItems.publications.title}
          />
        );
    }
  };

  if (!slugExist(page) && !children) {
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
