import React, { FC, ReactNode } from 'react';
import { styled } from '@mui/material/styles';
import clsx from 'clsx';
import Divider from '@mui/material/Divider';
import Drawer, { DrawerProps } from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { Icon } from '@mui/material';
import { MenuItem } from '../model/configurations/CmsConfigurations';
import useCmsConfiguration from '../configuration/useCmsConfiguration';
import useNavigate from './useNavigate';
import useAppConfiguration from '../configuration/useAppConfiguration';
import {
  FIRST_BOOK_TAB,
  SECOND_BOOK_TAB,
  THIRD_BOOK_TAB,
} from '../model/configurations/BookTab';

const PREFIX = 'NavigationDrawer';

const classes = {
  item: `${PREFIX}-item`,
  itemCategory: `${PREFIX}-itemCategory`,
  title: `${PREFIX}-title`,
  itemIcon: `${PREFIX}-itemIcon`,
};

const StyledDrawer = styled(Drawer)(({ theme }) => ({
  [`& .${classes.item}`]: {
    paddingTop: 1,
    paddingBottom: 1,
    color: 'rgba(255, 255, 255, 0.7)',
    '&:hover,&:focus': {
      backgroundColor: 'rgba(255, 255, 255, 0.08)',
    },
  },

  [`& .${classes.itemCategory}`]: {
    backgroundColor: '#232f3e',
    boxShadow: '0 -1px 0 #175BA0 inset',
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },

  [`& .${classes.title}`]: {
    fontSize: 24,
    color: theme.palette.common.white,
  },

  [`& .${classes.itemIcon}`]: {
    minWidth: 'auto',
    marginRight: theme.spacing(2),
    color: 'rgba(255, 255, 255, 0.7)',
    '&:hover,&:focus': {
      backgroundColor: 'rgba(255, 255, 255, 0.08)',
    },
  },
}));

export interface Props extends Omit<DrawerProps, 'classes'> {
  currentPage: string;
}

const NavigationDrawer: FC<Props> = (props: Props) => {
  const { currentPage, ...other } = props;
  const { navigate } = useNavigate();
  const { getSortedBooks, getTabByBookType } = useAppConfiguration();
  const { configuration } = useCmsConfiguration();

  const getCategoryItem = (title: string, children: ReactNode) => {
    return (
      <React.Fragment key={title}>
        <ListItem
          sx={(theme) => ({
            paddingTop: theme.spacing(2),
            paddingBottom: theme.spacing(2),
          })}
        >
          <ListItemText sx={{ color: (theme) => theme.palette.common.white }}>
            {title}
          </ListItemText>
        </ListItem>
        {children}
        <Divider sx={{ marginTop: (theme) => theme.spacing(2) }} />
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
          className={classes.item}
          style={{
            color: currentPage === menuItem.urlSlug ? '#5E8AC7' : undefined,
          }}
        >
          <ListItemIcon className={classes.itemIcon}>
            <Icon>{menuItem.icon}</Icon>
          </ListItemIcon>
          <ListItemText>{menuItem.title}</ListItemText>
        </ListItem>
      ));
  };

  const getBookIcon = (bookType: string) => {
    switch (getTabByBookType(bookType)) {
      case SECOND_BOOK_TAB:
        return 'looks_two_icon';
      case THIRD_BOOK_TAB:
        return 'looks_3_icon';
      case FIRST_BOOK_TAB:
      default:
        return 'looks_one_icon';
    }
  };

  return (
    <StyledDrawer variant="permanent" {...other}>
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
                icon: getBookIcon(value.bookType),
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
    </StyledDrawer>
  );
};

export default NavigationDrawer;
