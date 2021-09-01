import React, { FC, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import { connect } from 'react-redux';
import { FormikValues } from 'formik';
import { NotificationOptions } from '../../model/NotificationOptions';
import PageHeading from '../../layout/PageHeading';
import notification from '../../redux/actions/notification';
import logger from '../../helper/logger';
import htmlFileHelper from '../../helper/htmlFileHelper';
import { HtmlFileInfo } from '../../model/HtmlFileInfo';
import HtmlPageForm from '../form/HtmlPageForm';
import htmlFileInfoRepository from '../../firebase/database/htmlFileInfoRepository';
import {
  HtmlFileCategory,
  isHtmlFileCategory,
} from '../../model/HtmlFileCategory';
import Navigation from '../../pages/navigation/Navigation';
import NotFound from '../../pages/NotFound';

interface Props {
  htmlFileId?: string;
  htmlFileCategory: HtmlFileCategory;
  setNotification: (notificationOptions: NotificationOptions) => void;
}

const HtmlInfoEditor: FC<Props> = ({
  htmlFileCategory,
  htmlFileId,
  setNotification,
}) => {
  const [isNewHtmlFile, setIsNewHtmlFile] = useState<boolean>(false);
  const [htmlFileInfo, setHtmlFileInfo] = useState<HtmlFileInfo | null>(null);
  const history = useHistory();

  useEffect(() => {
    if (htmlFileId === undefined) {
      setIsNewHtmlFile(true);
      setHtmlFileInfo({
        htmlFileCategory,
        htmlFile: '',
        title: '',
        id: '',
      });
      return;
    }
    htmlFileInfoRepository
      .getHtmlFileById(htmlFileId)
      .then((value) => setHtmlFileInfo(value));
  }, [htmlFileCategory, htmlFileId]);

  const addOrEditText = isNewHtmlFile ? 'toegevoegd' : 'gewijzigd';

  const handleSubmit = async (values: FormikValues): Promise<void> => {
    await htmlFileInfoRepository
      .updateHtmlFile({
        id: htmlFileInfo?.id,
        htmlFileCategory,
        title: values.title.charAt(0).toUpperCase() + values.title.slice(1),
        htmlFile: htmlFileHelper.addHTMLTagsAndBottomSpacingToHTMLFile(
          values.htmlFile
        ),
      })
      .then(() => history.push(`/html-layout`))
      .then(() =>
        setNotification({
          notificationType: 'success',
          notificationOpen: true,
          notificationMessage: `HTML pagina is ${addOrEditText}.`,
        })
      )
      .catch((error) => {
        logger.errorWithReason(
          `Edit/Add ${htmlFileCategory} has failed in HtmlInfoEditor.handleSubmit`,
          error
        );
        setNotification({
          notificationType: 'error',
          notificationOpen: true,
          notificationMessage: `Het ${addOrEditText} van is mislukt, neem contact op met de beheerder.`,
        });
      });
  };

  if (!isHtmlFileCategory(htmlFileCategory)) {
    return <NotFound />;
  }

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
      {htmlFileInfo && (
        <HtmlPageForm
          isNewHtmlFile={isNewHtmlFile}
          onSubmit={handleSubmit}
          htmlFileInfo={htmlFileInfo}
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

export default connect(mapStateToProps, mapDispatchToProps)(HtmlInfoEditor);
