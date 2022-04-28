import React, { FC, useRef, useState } from 'react';
import * as Yup from 'yup';
import { Formik, FormikValues } from 'formik';
import { Dialog, DialogTitle } from '@mui/material';
import { notify } from '../../../../../../redux/slice/notificationSlice';
import logger from '../../../../../../helper/logger';
import { useAppDispatch } from '../../../../../../redux/hooks';
import ImageUploadForm from './ImageUploadForm/ImageUploadForm';
import ImageCodeBlockView from './ImageCodeBlockView/ImageCodeBlockView';
import { ContentType } from '../../../../../../model/ContentType';
import validateYupFilename from '../../../validators/validateYupFilename';
import validateYupFilesCategory from '../../../validators/validateYupFilesCategory';
import uploadFileToImageLibrary from '../../../../../../firebase/storage/uploadFileToImageLibrary';
import { ImageInfo } from '../../../../../../model/imageLibrary/ImageInfo';
import getDownloadUrlFromFilePath from '../../../../../../firebase/storage/getDownloadUrlFromFilePath';
import HelpAction from '../../../../../ItemAction/helpAction/HelpAction';
import { DocumentationType } from '../../../../../../model/DocumentationType';
import DialogTransition from '../../../../../dialog/DialogTransition';
import { ImageLibraryType } from '../../../../../../model/imageLibrary/ImageLibraryType';

interface Props {
  contentType?: ContentType;
  onCloseDialog: () => void;
  title: string;
  dialogContentText: string;
  documentationType: DocumentationType;
  allowedMimeTypes: string[];
  imageLibraryType: ImageLibraryType;
  uploadCallback?: (imageInfo: ImageInfo) => void;
}

const ImageUploadDialog: FC<Props> = ({
  onCloseDialog,
  contentType,
  title,
  dialogContentText,
  documentationType,
  allowedMimeTypes,
  imageLibraryType,
  uploadCallback,
}) => {
  const [submitted, setSubmitted] = useState<ImageInfo | null>(null);
  const formikRef = useRef<any>();
  const dispatch = useAppDispatch();

  const handleSubmitForm = (values: FormikValues) => {
    uploadFileToImageLibrary(values as ImageInfo, imageLibraryType)
      .then(getDownloadUrlFromFilePath)
      .then((link) => {
        const imageInfo = { ...values, downloadUrl: link } as ImageInfo;
        setSubmitted(imageInfo);
        if (uploadCallback) {
          uploadCallback(imageInfo);
        }
      })
      .then(() =>
        dispatch(
          notify({
            notificationType: 'success',
            notificationOpen: true,
            notificationMessage: 'De afbeelding is geupload.',
          })
        )
      )
      .then(() => {
        if (!contentType) {
          onCloseDialog();
        }
      })
      .catch((error) => {
        logger.errorWithReason(
          'Failed uploading image to storage in imageUploadDialog.handleSubmitForm',
          error
        );
        dispatch(
          notify({
            notificationType: 'error',
            notificationOpen: true,
            notificationMessage: `Het uploaden van de afbeelding is mislukt.`,
          })
        );
      });
  };

  const initialFormState = () => {
    return {
      image: '',
      category: '',
      filename: '',
    };
  };

  const formValidation = Yup.object().shape({
    image: Yup.mixed().required(
      'Het uploaden van een afbeelding is verplicht.'
    ),
    category: validateYupFilesCategory(),
    filename: validateYupFilename(),
  });

  return (
    <Formik
      innerRef={formikRef}
      initialValues={{ ...initialFormState() }}
      validationSchema={formValidation}
      onSubmit={handleSubmitForm}
    >
      {({ isSubmitting, dirty }) => (
        <Dialog
          fullWidth
          open
          TransitionComponent={DialogTransition}
          keepMounted
          onClose={() =>
            (submitted === null && !isSubmitting && onCloseDialog()) ||
            (submitted !== null && onCloseDialog())
          }
        >
          <DialogTitle id="alert-dialog-slide-title">
            {title}&ensp;
            <HelpAction documentationType={documentationType} />
          </DialogTitle>
          {!submitted && (
            <ImageUploadForm
              formik={formikRef}
              onCloseDialog={onCloseDialog}
              dirty={dirty}
              isSubmitting={isSubmitting}
              dialogContentText={dialogContentText}
              allowedMimeTypes={allowedMimeTypes}
              imageLibraryType={imageLibraryType}
            />
          )}
          {contentType && submitted && (
            <ImageCodeBlockView
              contentType={contentType}
              onCloseDialog={onCloseDialog}
              imageInfo={submitted}
            />
          )}
        </Dialog>
      )}
    </Formik>
  );
};

export default ImageUploadDialog;
