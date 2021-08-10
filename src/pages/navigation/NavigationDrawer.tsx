import React, { FC } from 'react';
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
import PublicIcon from '@material-ui/icons/Public';
import CallSplitIcon from '@material-ui/icons/CallSplit';
import {
  ErrorOutline,
  Folder,
  Person,
  PhonelinkSetup,
} from '@material-ui/icons';
import { useHistory } from 'react-router-dom';
import DialpadIcon from '@material-ui/icons/Dialpad';
import LooksOneIcon from '@material-ui/icons/LooksOne';
import LooksTwoIcon from '@material-ui/icons/LooksTwo';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import EuroSymbolIcon from '@material-ui/icons/EuroSymbol';

const categories = [
  {
    id: 'Boeken',
    children: [
      {
        id: 'Handboek',
        urlSlug: 'instruction-manual',
        icon: <LooksOneIcon />,
      },
      { id: 'RVV 1990', urlSlug: 'rvv-1990', icon: <LooksTwoIcon /> },
      {
        id: 'Regeling OGS',
        urlSlug: 'regeling-ogs-2009',
        icon: <LooksTwoIcon />,
      },
      {
        id: 'Ontheffing goede taakuitvoering',
        urlSlug: 'ontheffing-goede-taakuitoefening',
        icon: <LooksTwoIcon />,
      },
      {
        id: 'Brancherichtlijn medische hulpverlening',
        urlSlug: 'brancherichtlijn-medische-hulpverlening',
        icon: <LooksTwoIcon />,
      },
    ],
  },
  {
    id: 'Menu',
    children: [
      { id: 'Beslisboom', urlSlug: 'decision-tree', icon: <CallSplitIcon /> },
      { id: 'Berekening', urlSlug: 'calculations', icon: <DialpadIcon /> },
      {
        id: 'Configuratie',
        urlSlug: 'configurations',
        icon: <PhonelinkSetup />,
      },
      { id: 'Publiceren', urlSlug: 'publications', icon: <PublicIcon /> },
    ],
  },
  {
    id: 'Links',
    children: [
      { id: 'Bestanden', urlSlug: null, icon: <Folder /> },
      { id: 'Logging', urlSlug: null, icon: <ErrorOutline /> },
      { id: 'Gebruikersbeheer', urlSlug: null, icon: <Person /> },
      { id: 'Cloud kosten', urlSlug: null, icon: <EuroSymbolIcon /> },
    ],
  },
];

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
    firebase: {
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

  const navigateHandler = (
    id: string,
    childId: string,
    urlSlug: string | null
  ): void => {
    if (urlSlug === currentPage) {
      return;
    }
    if (urlSlug === null) {
      switch (childId) {
        case 'Bestanden':
          window.open(
            'https://console.firebase.google.com/u/0/project/ambulancezorg-app/storage/ambulancezorg-app.appspot.com/files',
            '_blank'
          );
          return;
        case 'Logging':
          window.open(
            'https://app.bugsnag.com/organizations/-181/stability-center',
            '_blank'
          );
          return;
        case 'Gebruikersbeheer':
          window.open(
            'https://console.firebase.google.com/u/0/project/ambulancezorg-app/authentication/users',
            '_blank'
          );
          return;
        case 'Cloud kosten':
          window.open(
            'https://console.firebase.google.com/u/0/project/ambulancezorg-app/usage',
            '_blank'
          );
          return;
        default:
          return;
      }
    }

    if (id === 'Boeken') {
      history.push(`/books/${urlSlug}`);
    } else {
      history.push(`/${urlSlug}`);
    }
  };

  return (
    <Drawer variant="permanent" {...other}>
      <List disablePadding>
        <ListItem
          className={clsx(classes.firebase, classes.item, classes.itemCategory)}
          // @ts-ignore
          onClick={props.onClose}
        >
          Ambulance App CMS
        </ListItem>
        {categories.map(({ id, children }) => (
          <React.Fragment key={id}>
            <ListItem className={classes.categoryHeader}>
              <ListItemText
                classes={{
                  primary: classes.categoryHeaderPrimary,
                }}
              >
                {id}
              </ListItemText>
            </ListItem>
            {children.map(({ id: childId, urlSlug, icon }) => (
              <ListItem
                key={childId}
                button
                onClick={() => navigateHandler(id, childId, urlSlug)}
                className={clsx(
                  classes.item,
                  currentPage === urlSlug && classes.itemActiveItem
                )}
              >
                <ListItemIcon className={classes.itemIcon}>{icon}</ListItemIcon>
                <ListItemText
                  classes={{
                    primary: classes.itemPrimary,
                  }}
                >
                  {childId}
                </ListItemText>
                {urlSlug === null && (
                  <ListItemIcon className={classes.itemIcon}>
                    <OpenInNewIcon />
                  </ListItemIcon>
                )}
              </ListItem>
            ))}
            <Divider className={classes.divider} />
          </React.Fragment>
        ))}
      </List>
    </Drawer>
  );
};

export default withStyles(styles)(NavigationDrawer);
