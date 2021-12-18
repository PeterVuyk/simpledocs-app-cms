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
import { Dialog, DialogTitle, Slide } from '@material-ui/core';
// eslint-disable-next-line import/no-unresolved
import { TransitionProps } from '@material-ui/core/transitions';
import { ContentType } from '../../../../../../model/artifacts/Artifact';
import SelectLinkPageForm from './SelectLinkPageForm';
import LinkCodeBlockView from './LinkCodeBlockView';
import { LinkInfo } from '../../../../../../model/LinkInfo';

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

const CreateLinkPageDialog: FC<Props> = ({ onCloseDialog, contentType }) => {
  const [submitted, setSubmitted] = useState<LinkInfo | null>(null);
  const formikRef = useRef<any>();

  const handleSubmitForm = (values: FormikValues) => {
    setSubmitted(values as LinkInfo);
  };

  const initialFormState = () => {
    return {
      bookType: '',
      bookPageId: '',
      linkText: '',
    };
  };

  const formValidation = Yup.object().shape({
    bookType: Yup.string().required('Geef een boek op'),
    bookPageId: Yup.string().required(
      'Geef een pagina op waar je naar wilt refereren'
    ),
    linkText: Yup.string().required(
      'Geef de tekst op die je in de link wilt tonen'
    ),
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
            Link naar pagina maken
          </DialogTitle>
          {!submitted && (
            <SelectLinkPageForm
              formik={formikRef}
              onCloseDialog={onCloseDialog}
              dirty={dirty}
              isSubmitting={isSubmitting}
            />
          )}
          {submitted && (
            <LinkCodeBlockView
              contentType={contentType}
              onCloseDialog={onCloseDialog}
              linkInfo={submitted}
            />
          )}
        </Dialog>
      )}
    </Formik>
  );
};

export default CreateLinkPageDialog;
