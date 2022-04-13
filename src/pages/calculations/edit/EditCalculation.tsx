import React, { FC, useEffect, useRef, useState } from 'react';
import Button from '@mui/material/Button';
import { Form, Formik, FormikValues } from 'formik';
import Grid from '@mui/material/Grid';
import * as Yup from 'yup';
import { Box } from '@mui/material';
import PageHeading from '../../../layout/PageHeading';
import TextField from '../../../components/form/formik/TextField';
import SubmitButton from '../../../components/form/formik/SubmitButton';
import Navigation from '../../../navigation/Navigation';
import logger from '../../../helper/logger';
import calculationsRepository from '../../../firebase/database/calculationsRepository';
import { CalculationInfo } from '../../../model/calculations/CalculationInfo';
import { CalculationType } from '../../../model/calculations/CalculationType';
import { CALCULATIONS_PAGE } from '../../../navigation/UrlSlugs';
import useStatusToggle from '../../../components/hooks/useStatusToggle';
import { EDIT_STATUS_DRAFT } from '../../../model/EditStatus';
import LoadingSpinner from '../../../components/LoadingSpinner';
import ContentTypeToggle from '../../../components/content/ContentTypeToggle';
import ContentEditor from '../../../components/content/ContentEditor';
import useContentTypeToggle from '../../../components/content/useContentTypeToggle';
import {
  CONTENT_TYPE_HTML,
  CONTENT_TYPE_MARKDOWN,
} from '../../../model/ContentType';
import validateYupMarkdownContent from '../../../components/form/formik/validators/validateYupMarkdownContent';
import validateYupHtmlContent from '../../../components/form/formik/validators/validateYupHtmlContent';
import useHtmlModifier from '../../../components/hooks/useHtmlModifier';
import markdownHelper from '../../../helper/markdownHelper';
import { useAppDispatch } from '../../../redux/hooks';
import { notify } from '../../../redux/slice/notificationSlice';
import useNavigate from '../../../navigation/useNavigate';

interface Props {
  calculationType: CalculationType;
}

const EditCalculation: FC<Props> = ({ calculationType }) => {
  const [calculationInfo, setCalculationInfo] =
    useState<CalculationInfo | null>(null);
  const [contentTypeToggle, setContentTypeToggle] = useContentTypeToggle(
    calculationInfo?.contentType
  );
  const [showError, setShowError] = useState<boolean>(false);
  const formikRef = useRef<any>();
  const { history, navigateBack } = useNavigate();
  const dispatch = useAppDispatch();
  const { setEditStatus } = useStatusToggle();
  const { modifyHtmlForStorage } = useHtmlModifier();

  useEffect(() => {
    calculationsRepository
      .getCalculationsInfoToEdit(calculationType)
      .then((result) => {
        if (!result) {
          dispatch(
            notify({
              notificationType: 'error',
              notificationOpen: true,
              notificationMessage:
                'Het openen van de wijzigingspagina is mislukt',
            })
          );
          history.push(CALCULATIONS_PAGE);
          return;
        }
        setCalculationInfo(result);
      });
  }, [calculationType, dispatch, history]);

  const FORM_VALIDATION = Yup.object().shape({
    title: Yup.string().required('Titel is een verplicht veld.'),
    explanation: Yup.string().required('Toelichting is een verplicht veld.'),
    markdownContent: validateYupMarkdownContent(contentTypeToggle),
    htmlContent: validateYupHtmlContent(contentTypeToggle),
  });

  const handleSubmit = (values: FormikValues): void => {
    calculationsRepository
      .updateCalculationsInfo({
        calculationType,
        title: values.title,
        explanation: values.explanation,
        contentType: contentTypeToggle,
        content:
          contentTypeToggle === CONTENT_TYPE_HTML
            ? modifyHtmlForStorage(values.htmlContent)
            : markdownHelper.modifyMarkdownForStorage(values.markdownContent),
        isDraft: true,
      })
      .then(() => setEditStatus(EDIT_STATUS_DRAFT))
      .then(() => history.push(CALCULATIONS_PAGE))
      .then(() =>
        dispatch(
          notify({
            notificationType: 'success',
            notificationOpen: true,
            notificationMessage: 'De berekening pagina is gewijzigd.',
          })
        )
      )
      .catch((error) => {
        logger.errorWithReason(
          'Edit stopping distance has failed in EditCalculation.handleSubmit',
          error
        );
        dispatch(
          notify({
            notificationType: 'error',
            notificationOpen: true,
            notificationMessage:
              'Het wijzigen is mislukt. Neem contact op met de beheerder.',
          })
        );
      });
  };

  return (
    <Navigation>
      <PageHeading title="Pagina bewerken">
        <Button
          variant="contained"
          color="secondary"
          onClick={(e) => navigateBack(e, CALCULATIONS_PAGE)}
        >
          Terug
        </Button>
      </PageHeading>
      {calculationInfo === null && <LoadingSpinner />}
      {calculationInfo && (
        <Formik
          innerRef={formikRef}
          initialValues={{ ...calculationInfo }}
          validationSchema={FORM_VALIDATION}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, dirty }) => (
            <Form>
              <Grid
                container
                spacing={0}
                alignItems="flex-start"
                justifyContent="flex-start"
                direction="row"
              >
                <Grid container item xs={12} sm={6} spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      showError={showError}
                      required
                      id="title"
                      label="Titel"
                      name="title"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      showError={showError}
                      multiline
                      minRows={3}
                      maxRows={8}
                      required
                      id="explanation"
                      label="Toelichting"
                      name="explanation"
                    />
                  </Grid>
                </Grid>
                <Grid container item sm={6} spacing={0}>
                  <Grid
                    item
                    xs={12}
                    style={{ marginLeft: 18, marginRight: -18 }}
                  >
                    <ContentTypeToggle
                      contentType={contentTypeToggle}
                      setContentTypeToggle={setContentTypeToggle}
                      allowedContentTypes={[
                        CONTENT_TYPE_HTML,
                        CONTENT_TYPE_MARKDOWN,
                      ]}
                    />
                    <ContentEditor
                      contentTypeToggle={contentTypeToggle}
                      showError={showError}
                      formik={formikRef}
                      initialContentType={calculationInfo?.contentType}
                      initialContent={calculationInfo?.content ?? null}
                      allowedContentTypes={[
                        CONTENT_TYPE_HTML,
                        CONTENT_TYPE_MARKDOWN,
                      ]}
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Box sx={{ margin: (theme) => theme.spacing(3, 0, 2) }}>
                <SubmitButton
                  showInBottomBar
                  setShowError={setShowError}
                  disabled={isSubmitting || !dirty}
                >
                  Wijzigen
                </SubmitButton>
              </Box>
            </Form>
          )}
        </Formik>
      )}
    </Navigation>
  );
};

export default EditCalculation;
