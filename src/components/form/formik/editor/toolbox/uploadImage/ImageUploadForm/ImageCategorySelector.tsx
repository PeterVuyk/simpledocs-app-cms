import React, { FC, useEffect, useState } from 'react';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import { CircularProgress, TextField } from '@mui/material';
import { useField, useFormikContext } from 'formik';
import { ImageLibraryCategory } from '../../../../../../../model/imageLibrary/ImageLibraryCategory';
import getImageLibraryCategories from '../../../../../../../firebase/storage/getImageLibraryCategories';
import logger from '../../../../../../../helper/logger';
import { ImageLibraryType } from '../../../../../../../model/imageLibrary/ImageLibraryType';

const filter = createFilterOptions<ImageLibraryCategory>();

interface Props {
  showError: boolean;
  disabled: boolean;
  imageLibraryType: ImageLibraryType;
}

const ImageCategorySelector: FC<Props> = ({
  showError,
  disabled,
  imageLibraryType,
}) => {
  const [categories, setCategories] = useState<ImageLibraryCategory[] | null>(
    null
  );
  const [field, meta] = useField('category');
  const formikProps = useFormikContext();

  useEffect(() => {
    getImageLibraryCategories(imageLibraryType)
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
  }, [imageLibraryType]);

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
        const { inputValue } = params;
        // Suggest the creation of a new value
        const isExisting = options.some(
          (option) => inputValue === option.category
        );
        if (inputValue !== '' && !isExisting) {
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
      id="category-selector"
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
      renderOption={(props, option) => <li {...props}>{option.category}</li>}
      freeSolo
      sx={{
        marginBottom: (theme) => theme.spacing(2),
        marginTop: (theme) => theme.spacing(2),
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Categorie"
          variant="outlined"
          name="category"
          fullWidth
          // disabled={disabled}
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
