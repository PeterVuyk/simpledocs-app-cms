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
import Configurations from '../pages/configurations/Configurations';
import Publications from '../pages/publications/Publications';
import NotFound from '../pages/NotFound';
import navigationConfig from './navigationConfig.json';
import { NavigationConfig } from '../model/NavigationConfig';
import HtmlLayout from '../pages/htmlLayout/HtmlLayout';
import { BookType } from '../model/BookType';

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
    const article = Object.values(configs.books.bookItems).find(
      (item) => item.urlSlug === page
    );
    if (article) {
      const bookType = Object.keys(navigationConfig.books.bookItems)[
        Object.values(navigationConfig.books.bookItems)
          .map((item) => item.urlSlug)
          .indexOf(page)
      ] as BookType;
      return <Articles title={article.title} bookType={bookType} />;
    }
    switch (page) {
      case configs.menu.menuItems.htmlLayout.urlSlug:
        return <HtmlLayout title={configs.menu.menuItems.htmlLayout.title} />;
      case configs.menu.menuItems.decisionTree.urlSlug:
        return (
          <DecisionTree title={configs.menu.menuItems.decisionTree.title} />
        );
      case configs.menu.menuItems.calculations.urlSlug:
        return (
          <Calculations title={configs.menu.menuItems.calculations.title} />
        );
      case configs.menu.menuItems.configurations.urlSlug:
        return (
          <Configurations title={configs.menu.menuItems.configurations.title} />
        );
      case configs.menu.menuItems.publications.urlSlug:
      default:
        return (
          <Publications title={configs.menu.menuItems.publications.title} />
        );
    }
  };

  const slugExist = () => {
    const urlSlugs = [
      ...Object.values(configs.books.bookItems).map((item) => item.urlSlug),
      ...Object.values(configs.menu.menuItems).map((item) => item.urlSlug),
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
