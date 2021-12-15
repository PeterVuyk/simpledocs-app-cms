import React, { FC, useState } from 'react';
import { Form } from 'formik';
import {
  Button,
  DialogActions,
  DialogContent,
  DialogContentText,
} from '@material-ui/core';
import AlertBox from '../../../../../../AlertBox';
import SubmitButton from '../../../../SubmitButton';
import ImageCategorySelector from './ImageCategorySelector';
import ImageWithFilenameField from './ImageWithFilenameField';

interface Props {
  isSubmitting: boolean;
  dirty: boolean;
  formik: any;
  onCloseDialog: () => void;
}

const ImageUploadForm: FC<Props> = ({
  isSubmitting,
  dirty,
  formik,
  onCloseDialog,
}) => {
  const [showError, setShowError] = useState<boolean>(false);

  return (
    <Form>
      <DialogContent>
        <DialogContentText style={{ whiteSpace: 'pre-line' }} id="description">
          Voeg een foto of afbeelding toe aan het archief om hier vervolgens
          vanuit de editor naar te refereren.
        </DialogContentText>
        {isSubmitting && (
          <AlertBox severity="info" message="Een moment geduld..." />
        )}
        <ImageCategorySelector disabled={isSubmitting} showError={showError} />
        <ImageWithFilenameField
          formik={formik}
          showError={showError}
          disabled={isSubmitting}
        />
      </DialogContent>
      <DialogActions>
        <Button
          onClick={onCloseDialog}
          color="primary"
          variant="contained"
          disabled={isSubmitting}
        >
          Annuleren
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
