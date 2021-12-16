import React, {
  FC,
  forwardRef,
  ReactElement,
  Ref,
  useRef,
  useState,
} from 'react';
import * as Yup from 'yup';
import { Formik, FormikValues } from 'formik';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Slide,
} from '@material-ui/core';
// eslint-disable-next-line import/no-unresolved
import { TransitionProps } from '@material-ui/core/transitions';
import Highlight from 'react-highlight';
import { notify } from '../../../../../../redux/slice/notificationSlice';
import logger from '../../../../../../helper/logger';
import { useAppDispatch } from '../../../../../../redux/hooks';
import ImageUploadForm from './ImageUploadForm/ImageUploadForm';
import ImageCodeBlockView from './ImageCodeBlockView/ImageCodeBlockView';
import { ContentType } from '../../../../../../model/artifacts/Artifact';
import validateYupFilename from '../../../validators/validateYupFilename';
import validateYupFilesCategory from '../../../validators/validateYupFilesCategory';
import uploadFileToImageLibrary from '../../../../../../firebase/storage/uploadFileToImageLibrary';
import { ImageInfo } from '../../../../../../model/imageLibrary/ImageInfo';
import getDownloadUrlFromFilePath from '../../../../../../firebase/storage/getDownloadUrlFromFilePath';
import utilHelper from '../../../../../../helper/utilHelper';
import HelpAction from '../../../../../ItemAction/helpAction/HelpAction';
import { DOCUMENTATION_IMAGE_LIBRARY } from '../../../../../../model/DocumentationType';

const Transition = forwardRef(function Transition(
  props: TransitionProps & { children?: ReactElement },
  ref: Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

interface Props {
  contentType: ContentType;
  onCloseDialog: () => void;
}

const ImageUploadDialog: FC<Props> = ({ onCloseDialog, contentType }) => {
  const [submitted, setSubmitted] = useState<ImageInfo | null>(null);
  const formikRef = useRef<any>();
  const dispatch = useAppDispatch();

  const handleSubmitForm = (values: FormikValues) => {
    uploadFileToImageLibrary(values as ImageInfo)
      .then(getDownloadUrlFromFilePath)
      .then((link) =>
        setSubmitted({ ...values, downloadUrl: link } as ImageInfo)
      )
      .then(() =>
        dispatch(
          notify({
            notificationType: 'success',
            notificationOpen: true,
            notificationMessage: 'De afbeelding is geupload.',
          })
        )
      )
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
          TransitionComponent={Transition}
          keepMounted
          onClose={() =>
            (submitted === null && !isSubmitting && onCloseDialog()) ||
            (submitted !== null && onCloseDialog())
          }
          aria-labelledby="alert-dialog-slide-title"
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogTitle id="alert-dialog-slide-title">
            Afbeelding uploaden&ensp;
            <HelpAction documentationType={DOCUMENTATION_IMAGE_LIBRARY} />
          </DialogTitle>
          {!submitted && (
            <ImageUploadForm
              formik={formikRef}
              onCloseDialog={onCloseDialog}
              dirty={dirty}
              isSubmitting={isSubmitting}
            />
          )}
          {submitted && (
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
