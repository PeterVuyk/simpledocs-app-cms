import React, { FC, useEffect, useState } from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import { Box } from '@mui/material';
import getImageLibraryCategories from '../../../../../../firebase/storage/getImageLibraryCategories';
import capitalizeFirstLetter from '../../../../../../helper/text/capitalizeFirstLetter';
import { notify } from '../../../../../../redux/slice/notificationSlice';
import logger from '../../../../../../helper/logger';
import { useAppDispatch } from '../../../../../../redux/hooks';

interface Props {
  currentCategory: string;
  setCurrentCategory: (category: string) => void;
}

const CategoryList: FC<Props> = ({ currentCategory, setCurrentCategory }) => {
  const [categories, setCategories] = useState<string[]>([]);
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
    <Box
      sx={{
        position: 'relative',
        overflow: 'auto',
        width: '100%',
        maxWidth: 360,
        height: 600,
        backgroundColor: (theme) => theme.palette.background.paper,
      }}
    >
      <List component="nav">
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
    </Box>
  );
};

export default CategoryList;
