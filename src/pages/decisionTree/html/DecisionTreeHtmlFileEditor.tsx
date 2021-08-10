import React, { FC, useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import { connect } from 'react-redux';
import { FormikValues } from 'formik';
import decisionTreeHtmlFilesRepository from '../../../firebase/database/decisionTreeHtmlFilesRepository';
import { DecisionTreeHtmlFile } from '../../../model/DecisionTreeHtmlFile';
import { NotificationOptions } from '../../../model/NotificationOptions';
import Navigation from '../../navigation/Navigation';
import PageHeading from '../../../layout/PageHeading';
import notification from '../../../redux/actions/notification';
import HtmlPageForm from './HtmlPageForm';
import logger from '../../../helper/logger';
import htmlFileHelper from '../../../helper/htmlFileHelper';

interface Props {
  setNotification: (notificationOptions: NotificationOptions) => void;
}

const DecisionTreeHtmlFileEditor: FC<Props> = ({ setNotification }) => {
  const [isNewHtmlFile, setIsNewHtmlFile] = useState<boolean>(false);
  const [decisionTreeHtmlFile, setDecisionTreeHtmlFile] =
    useState<DecisionTreeHtmlFile | null>(null);
  const { htmlFileId } = useParams<{ htmlFileId: string }>();
  const history = useHistory();

  useEffect(() => {
    if (htmlFileId === undefined) {
      setIsNewHtmlFile(true);
      setDecisionTreeHtmlFile({
        htmlFile: '',
        title: '',
        id: '',
      });
    }
    decisionTreeHtmlFilesRepository
      .getHtmlFileById(htmlFileId)
      .then((value) => setDecisionTreeHtmlFile(value));
  }, [htmlFileId]);

  const addOrEditText = isNewHtmlFile ? 'toegevoegd' : 'gewijzigd';

  const handleSubmit = async (values: FormikValues): Promise<void> => {
    await decisionTreeHtmlFilesRepository
      .updateHtmlFile({
        id: decisionTreeHtmlFile?.id,
        title: values.title,
        htmlFile: htmlFileHelper.addHTMLTagsToHTMLFile(values.htmlFile),
      })
      .then(() => history.push(`/decision-tree`))
      .then(() =>
        setNotification({
          notificationType: 'success',
          notificationOpen: true,
          notificationMessage: `HTML pagina is ${addOrEditText}.`,
        })
      )
      .catch((error) => {
        logger.errorWithReason(
          'Edit/Add decision tree html page has failed in DecisionTreeHtmlFileEditor.handleSubmit',
          error
        );
        setNotification({
          notificationType: 'error',
          notificationOpen: true,
          notificationMessage: `Het ${addOrEditText} van het artikel is mislukt, neem contact op met de beheerder.`,
        });
      });
  };

  return (
    <Navigation>
      <PageHeading
        title={`HTML bestand ${isNewHtmlFile ? 'toevoegen' : 'wijzigen'}`}
      >
        <Button
          variant="contained"
          color="secondary"
          onClick={() => history.goBack()}
        >
          Terug
        </Button>
      </PageHeading>
      {decisionTreeHtmlFile && (
        <HtmlPageForm
          isNewHtmlFile={isNewHtmlFile}
          handleSubmit={handleSubmit}
          decisionTreeHtmlFile={decisionTreeHtmlFile}
        />
      )}
    </Navigation>
  );
};

const mapStateToProps = (state: any) => {
  return {
    notificationOptions: state.notification.notificationOptions,
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    setNotification: (notificationOptions: NotificationOptions) =>
      // eslint-disable-next-line import/no-named-as-default-member
      dispatch(notification.setNotification(notificationOptions)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DecisionTreeHtmlFileEditor);
