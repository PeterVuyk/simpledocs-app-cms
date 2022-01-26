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
import { Icon } from '@material-ui/core';
import { MenuItem } from '../model/configurations/CmsConfigurations';
import useCmsConfiguration from '../configuration/useCmsConfiguration';
import useNavigate from './useNavigate';
import useAppConfiguration from '../configuration/useAppConfiguration';

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
      boxShadow: '0 -1px 0 #175BA0 inset',
      paddingTop: theme.spacing(2),
      paddingBottom: theme.spacing(2),
    },
    title: {
      fontSize: 24,
      color: theme.palette.common.white,
    },
    itemActiveItem: {
      color: '#5E8AC7',
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
  const { navigate } = useNavigate();
  const { getSortedBooks, getTabByBookType } = useAppConfiguration();
  const { configuration } = useCmsConfiguration();

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

  const getListItem = (title: string, menuItems: MenuItem[]) => {
    return menuItems
      .sort((a, b) => a.navigationIndex - b.navigationIndex)
      .map((menuItem) => (
        <ListItem
          key={menuItem.title}
          button
          onClick={(e) =>
            navigate(
              e,
              title === 'Boeken'
                ? `/books/${menuItem.urlSlug}`
                : `/${menuItem.urlSlug}`
            )
          }
          className={clsx(
            classes.item,
            currentPage === menuItem.urlSlug && classes.itemActiveItem
          )}
        >
          <ListItemIcon className={classes.itemIcon}>
            <Icon>{menuItem.icon}</Icon>
          </ListItemIcon>
          <ListItemText
            classes={{
              primary: classes.itemPrimary,
            }}
          >
            {menuItem.title}
          </ListItemText>
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
          CMS APP
        </ListItem>
        {getCategoryItem(
          'Boeken',
          getListItem(
            'Boeken',
            Object.values(
              getSortedBooks().map((value, index) => ({
                title: value.title,
                navigationIndex: index,
                urlSlug: value.bookType,
                icon:
                  getTabByBookType(value.bookType) === 'firstBookTab'
                    ? 'looks_one_icon'
                    : 'looks_two_icon',
              }))
            )
          )
        )}
        {getCategoryItem(
          configuration.menu.title,
          getListItem(
            configuration.menu.title,
            Object.values(configuration.menu.menuItems)
          )
        )}
      </List>
    </Drawer>
  );
};

export default withStyles(styles)(NavigationDrawer);
