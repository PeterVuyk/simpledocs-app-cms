import React, { FC, useState } from 'react';
import { Form } from 'formik';
import {
  Button,
  DialogActions,
  DialogContent,
  DialogContentText,
} from '@mui/material';
import AlertBox from '../../../../../../AlertBox';
import SubmitButton from '../../../../SubmitButton';
import ImageCategorySelector from './ImageCategorySelector';
import ImageWithFilenameField from './ImageWithFilenameField';
import { ImageLibraryType } from '../../../../../../../model/imageLibrary/ImageLibraryType';

interface Props {
  isSubmitting: boolean;
  dirty: boolean;
  formik: any;
  onCloseDialog: () => void;
  dialogContentText: string;
  allowedMimeTypes: string[];
  imageLibraryType: ImageLibraryType;
}

const ImageUploadForm: FC<Props> = ({
  isSubmitting,
  dirty,
  formik,
  onCloseDialog,
  dialogContentText,
  allowedMimeTypes,
  imageLibraryType,
}) => {
  const [showError, setShowError] = useState<boolean>(false);

  return (
    <Form>
      <DialogContent>
        <DialogContentText style={{ whiteSpace: 'pre-line' }} id="description">
          {dialogContentText}
        </DialogContentText>
        {isSubmitting && (
          <AlertBox severity="info" message="Een moment geduld..." />
        )}
        <ImageCategorySelector
          disabled={isSubmitting}
          showError={showError}
          imageLibraryType={imageLibraryType}
        />
        <ImageWithFilenameField
          formik={formik}
          showError={showError}
          disabled={isSubmitting}
          allowedMimeTypes={allowedMimeTypes}
        />
      </DialogContent>
      <DialogActions>
        <Button
          onClick={onCloseDialog}
          color="primary"
          variant="contained"
          disabled={isSubmitting}
        >
          Terug
        </Button>
        <SubmitButton
          showInBottomBar={false}
          setShowError={setShowError}
          disabled={isSubmitting || !dirty}
          color="secondary"
          variant="contained"
        >
          Uploaden
        </SubmitButton>
      </DialogActions>
    </Form>
  );
};

export default ImageUploadForm;
