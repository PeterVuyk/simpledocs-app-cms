import React, { FC, useState } from 'react';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import DeleteTwoToneIcon from '@material-ui/icons/DeleteTwoTone';
import { Tooltip } from '@material-ui/core';
import RemoveVersionMenu from './RemoveVersionMenu';
import { Versioning } from '../../../model/Versioning';
import useConfiguration from '../../../configuration/useConfiguration';

const useStyles = makeStyles({
  button: {
    marginLeft: 8,
  },
});

interface Props {
  onReloadPublications: () => void;
  versions: Versioning[];
}

const RemoveVersionButton: FC<Props> = ({ onReloadPublications, versions }) => {
  const [removeMenu, setRemoveMenu] = useState<null | HTMLElement>(null);
  const classes = useStyles();
  const { configuration } = useConfiguration();

  const openDeleteMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setRemoveMenu(event.currentTarget);
  };

  const getBookVersions = () => {
    const bookTypes = Object.keys(configuration.books.bookItems);
    return versions.filter((version) => bookTypes.includes(version.aggregate));
  };

  return (
    <>
      <Tooltip title="Boek versie verwijderen">
        <Button
          className={classes.button}
          variant="contained"
          color="secondary"
          onClick={openDeleteMenu}
        >
          <DeleteTwoToneIcon />
          &nbsp;Boek versie verwijderen
        </Button>
      </Tooltip>
      <RemoveVersionMenu
        onReloadPublications={onReloadPublications}
        removeMenu={removeMenu}
        setRemoveMenu={setRemoveMenu}
        versions={getBookVersions()}
      />
    </>
  );
};

export default RemoveVersionButton;
