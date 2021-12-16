import React, { FC, useEffect, useState } from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import getImageLibraryCategories from '../../../../../../firebase/storage/getImageLibraryCategories';
import capitalizeFirstLetter from '../../../../../../helper/text/capitalizeFirstLetter';
import { notify } from '../../../../../../redux/slice/notificationSlice';
import logger from '../../../../../../helper/logger';
import { useAppDispatch } from '../../../../../../redux/hooks';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      maxWidth: 360,
      backgroundColor: theme.palette.background.paper,
    },
  })
);

interface Props {
  currentCategory: string;
  setCurrentCategory: (category: string) => void;
}

const CategoryList: FC<Props> = ({ currentCategory, setCurrentCategory }) => {
  const [categories, setCategories] = useState<string[]>([]);
  const classes = useStyles();
  const dispatch = useAppDispatch();

  useEffect(() => {
    getImageLibraryCategories()
      .then((result) => {
        setCategories(result);
        setCurrentCategory(result.length === 0 ? '' : result[0]);
      })
      .catch((error) => {
        logger.errorWithReason(
          'failed to get categories to list in imageLibrary',
          error
        );
        dispatch(
          notify({
            notificationType: 'error',
            notificationOpen: true,
            notificationMessage: `Het ophalen van de verschillende categorieën van de afbeeldingen bibliotheek is mislukt.`,
          })
        );
      });
  }, [dispatch, setCurrentCategory]);

  const handleListItemClick = (category: string) => {
    setCurrentCategory(category);
  };

  return (
    <div className={classes.root}>
      <List component="nav" aria-label="categories">
        {categories.map((category) => (
          <ListItem
            key={category.toString()}
            button
            selected={currentCategory === category}
            onClick={() => handleListItemClick(category)}
          >
            <ListItemText primary={capitalizeFirstLetter(category)} />
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default CategoryList;
