import React, { FC, useEffect, useState } from 'react';
import Autocomplete, {
  createFilterOptions,
} from '@material-ui/lab/Autocomplete';
import { CircularProgress, TextField } from '@material-ui/core';
import { useField, useFormikContext } from 'formik';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { ImageLibraryCategory } from '../../../../../../../model/imageLibrary/ImageLibraryCategory';
import getImageLibraryCategories from '../../../../../../../firebase/storage/getImageLibraryCategories';
import logger from '../../../../../../../helper/logger';
import getImageDownloadUrl from '../../../../../../../firebase/storage/fileInImageLibraryExists';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    categorySelector: {
      marginBottom: theme.spacing(1),
    },
  })
);

const filter = createFilterOptions<ImageLibraryCategory>();

interface Props {
  showError: boolean;
  disabled: boolean;
}

const ImageCategorySelector: FC<Props> = ({ showError, disabled }) => {
  const [categories, setCategories] = useState<ImageLibraryCategory[] | null>(
    null
  );
  const [field, meta] = useField('category');
  const formikProps = useFormikContext();
  const classes = useStyles();

  useEffect(() => {
    getImageLibraryCategories()
      .then((categoryNames) =>
        categoryNames.map((categoryName) => {
          return { category: categoryName } as ImageLibraryCategory;
        })
      )
      .then(setCategories)
      .catch((reason) =>
        logger.errorWithReason(
          'Failed retrieving categories from firebase storage in ImageCategorySelector',
          reason
        )
      );
  }, []);

  const getErrorHelperText = () => {
    return showError ? meta.error : '';
  };

  return (
    <Autocomplete
      disabled={disabled}
      onChange={(event, newValue) => {
        if (typeof newValue === 'string') {
          formikProps.setFieldValue('category', newValue);
          return;
        }
        if (newValue === null) {
          formikProps.setFieldValue('category', '');
          return;
        }
        if (newValue.inputValue !== undefined) {
          formikProps.setFieldValue(
            'category',
            (newValue as ImageLibraryCategory).inputValue
          );
          return;
        }
        formikProps.setFieldValue(
          'category',
          (newValue as ImageLibraryCategory).category
        );
      }}
      filterOptions={(options, params) => {
        const filtered = filter(options, params);
        // Suggest the creation of a new value
        if (params.inputValue !== '') {
          filtered.push({
            inputValue: params.inputValue,
            category: `"${params.inputValue}" toevoegen`,
          });
        }

        return filtered;
      }}
      selectOnFocus
      clearOnBlur
      handleHomeEndKeys
      id="free-solo-with-text-demo"
      options={categories ?? []}
      getOptionLabel={(option) => {
        // Value selected with enter, right from the input
        if (typeof option === 'string') {
          return option;
        }
        // Add "xxx" option created dynamically
        if (option.inputValue) {
          return option.inputValue;
        }
        // Regular option
        return option.category;
      }}
      renderOption={(option) => {
        if (option.inputValue !== undefined) {
          return option.category;
        }
        return option.category;
      }}
      freeSolo
      className={classes.categorySelector}
      renderInput={(params) => (
        <TextField
          {...params}
          className={classes.categorySelector}
          label="Categorie"
          variant="outlined"
          name="category"
          fullWidth
          disabled={disabled}
          error={showError && meta?.error !== undefined}
          helperText={getErrorHelperText()}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {categories == null ? (
                  <CircularProgress color="inherit" size={20} />
                ) : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
    />
  );
};

export default ImageCategorySelector;
