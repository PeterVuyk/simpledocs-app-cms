import React, { FC, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import { connect } from 'react-redux';
import { FormikValues } from 'formik';
import { NotificationOptions } from '../../model/NotificationOptions';
import PageHeading from '../../layout/PageHeading';
import notification from '../../redux/actions/notification';
import logger from '../../helper/logger';
import htmlContentHelper from '../../helper/htmlContentHelper';
import ContentPageForm from '../form/ContentPageForm';
import Navigation from '../../navigation/Navigation';
import NotFound from '../../pages/NotFound';
import {
  DECISION_TREE_PAGE,
  HTML_LAYOUT_PAGE,
} from '../../navigation/UrlSlugs';
import artifactsRepository from '../../firebase/database/artifactsRepository';
import {
  ARTIFACT_TYPE_DECISION_TREE,
  ArtifactType,
  isArtifactType,
} from '../../model/ArtifactType';
import { Artifact } from '../../model/Artifact';

interface Props {
  artifactId?: string;
  artifactType: ArtifactType;
  setNotification: (notificationOptions: NotificationOptions) => void;
}

const ArtifactEditor: FC<Props> = ({
  artifactType,
  artifactId,
  setNotification,
}) => {
  const [isNewFile, setIsNewFile] = useState<boolean>(false);
  const [artifact, setArtifact] = useState<Artifact | null>(null);
  const history = useHistory();

  useEffect(() => {
    if (artifactId === undefined) {
      setIsNewFile(true);
      setArtifact({
        type: artifactType,
        content: '',
        contentType: 'html',
        title: '',
        id: '',
      });
      return;
    }
    artifactsRepository
      .getArtifactById(artifactId)
      .then((value) => setArtifact(value));
  }, [artifactType, artifactId]);

  const addOrEditText = isNewFile ? 'toegevoegd' : 'gewijzigd';

  const handleSubmit = async (values: FormikValues): Promise<void> => {
    await artifactsRepository
      .updateArtifact({
        id: artifact?.id,
        type: artifactType,
        contentType: 'html',
        title: values.title.charAt(0).toUpperCase() + values.title.slice(1),
        content: htmlContentHelper.addHTMLTagsAndBottomSpacingToHtmlContent(
          values.htmlContent
        ),
      })
      .then(() =>
        history.push(
          artifactType === ARTIFACT_TYPE_DECISION_TREE
            ? DECISION_TREE_PAGE
            : HTML_LAYOUT_PAGE
        )
      )
      .then(() =>
        setNotification({
          notificationType: 'success',
          notificationOpen: true,
          notificationMessage: `De pagina is ${addOrEditText}.`,
        })
      )
      .catch((error) => {
        logger.errorWithReason(
          `Edit/Add ${artifactType} has failed in ArtifactEditor.handleSubmit`,
          error
        );
        setNotification({
          notificationType: 'error',
          notificationOpen: true,
          notificationMessage: `Het ${addOrEditText} van is mislukt, neem contact op met de beheerder.`,
        });
      });
  };

  if (!isArtifactType(artifactType)) {
    return <NotFound />;
  }

  return (
    <Navigation>
      <PageHeading title={`Bestand ${isNewFile ? 'toevoegen' : 'wijzigen'}`}>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => history.goBack()}
        >
          Terug
        </Button>
      </PageHeading>
      {artifact && (
        <ContentPageForm
          isNewFile={isNewFile}
          onSubmit={handleSubmit}
          artifact={artifact}
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

export default connect(mapStateToProps, mapDispatchToProps)(ArtifactEditor);
