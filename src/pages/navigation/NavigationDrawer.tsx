import React, { FC, ReactNode } from 'react';
import clsx from 'clsx';
import {
  createStyles,
  Theme,
  withStyles,
  WithStyles,
} from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import Drawer, { DrawerProps } from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { useHistory } from 'react-router-dom';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import { Icon } from '@material-ui/core';
import navigationConfig from './navigationConfig.json';
import {
  MenuConfig,
  MenuLinkConfig,
  NavigationConfig,
} from '../../model/NavigationConfig';

const styles = (theme: Theme) =>
  createStyles({
    categoryHeader: {
      paddingTop: theme.spacing(2),
      paddingBottom: theme.spacing(2),
    },
    categoryHeaderPrimary: {
      color: theme.palette.common.white,
    },
    item: {
      paddingTop: 1,
      paddingBottom: 1,
      fontWeight: 'bold',
      color: 'rgba(255, 255, 255, 0.7)',
      '&:hover,&:focus': {
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
      },
    },
    itemCategory: {
      backgroundColor: '#232f3e',
      boxShadow: '0 -1px 0 #154594 inset',
      paddingTop: theme.spacing(2),
      paddingBottom: theme.spacing(2),
    },
    title: {
      fontSize: 24,
      color: theme.palette.common.white,
    },
    itemActiveItem: {
      color: '#0091ea',
    },
    itemPrimary: {
      fontWeight: 'bold',
      fontSize: 'inherit',
    },
    itemIcon: {
      minWidth: 'auto',
      marginRight: theme.spacing(2),
      color: 'rgba(255, 255, 255, 0.7)',
      '&:hover,&:focus': {
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
      },
    },
    divider: {
      marginTop: theme.spacing(2),
    },
  });

export interface Props
  extends Omit<DrawerProps, 'classes'>,
    WithStyles<typeof styles> {
  currentPage: string;
}

const NavigationDrawer: FC<Props> = (props: Props) => {
  const { classes, currentPage, ...other } = props;
  const history = useHistory();
  const configs = navigationConfig as NavigationConfig;

  const getCategoryItem = (title: string, children: ReactNode) => {
    return (
      <React.Fragment key={title}>
        <ListItem className={classes.categoryHeader}>
          <ListItemText
            classes={{
              primary: classes.categoryHeaderPrimary,
            }}
          >
            {title}
          </ListItemText>
        </ListItem>
        {children}
        <Divider className={classes.divider} />
      </React.Fragment>
    );
  };

  const getListItem = (menuConfig: MenuConfig) => {
    return menuConfig.listItems.map(({ id: childId, urlSlug, icon }) => (
      <ListItem
        key={childId}
        button
        onClick={() => {
          if (menuConfig.title === 'Boeken') {
            history.push(`/books/${urlSlug}`);
          } else {
            history.push(`/${urlSlug}`);
          }
        }}
        className={clsx(
          classes.item,
          currentPage === urlSlug && classes.itemActiveItem
        )}
      >
        <ListItemIcon className={classes.itemIcon}>
          <Icon>{icon}</Icon>
        </ListItemIcon>
        <ListItemText
          classes={{
            primary: classes.itemPrimary,
          }}
        >
          {childId}
        </ListItemText>
      </ListItem>
    ));
  };

  const getLinkListItem = (menuConfig: MenuLinkConfig) => {
    return menuConfig.listItems.map(({ id: childId, url, icon }) => (
      <ListItem
        key={childId}
        button
        onClick={() => window.open(url, '_blank')}
        className={clsx(classes.item)}
      >
        <ListItemIcon className={classes.itemIcon}>
          <Icon>{icon}</Icon>
        </ListItemIcon>
        <ListItemText
          classes={{
            primary: classes.itemPrimary,
          }}
        >
          {childId}
        </ListItemText>
        <ListItemIcon className={classes.itemIcon}>
          <OpenInNewIcon />
        </ListItemIcon>
      </ListItem>
    ));
  };

  return (
    <Drawer variant="permanent" {...other}>
      <List disablePadding>
        <ListItem
          className={clsx(classes.title, classes.item, classes.itemCategory)}
          // @ts-ignore
          onClick={props.onClose}
        >
          Ambulance App CMS
        </ListItem>
        {getCategoryItem(configs.books.title, getListItem(configs.books))}
        {getCategoryItem(configs.menu.title, getListItem(configs.menu))}
        {getCategoryItem(
          configs.externalLinks.title,
          getLinkListItem(configs.externalLinks)
        )}
      </List>
    </Drawer>
  );
};

export default withStyles(styles)(NavigationDrawer);
