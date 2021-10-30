import React, { FC, useEffect, useState } from 'react';
import Button from '@material-ui/core/Button';
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import CodeIcon from '@material-ui/icons/Code';
import StyleIcon from '@material-ui/icons/Style';
import LoyaltyIcon from '@material-ui/icons/Loyalty';
import ArtifactsTable from '../../components/artifact/ArtifactsTable';
import logger from '../../helper/logger';
import PageHeading from '../../layout/PageHeading';
import { AGGREGATE_STYLEGUIDE } from '../../model/Aggregate';
import { ADD_SNIPPETS, ADD_TEMPLATE } from '../../navigation/UrlSlugs';
import LoadingSpinner from '../../components/LoadingSpinner';
import StylesheetDialog from './StylesheetDialog';
import { Artifact } from '../../model/Artifact';
import artifactsRepository from '../../firebase/database/artifactsRepository';
import {
  ARTIFACT_TYPE_CSS_STYLESHEET,
  ARTIFACT_TYPE_SNIPPET,
  ARTIFACT_TYPE_TEMPLATE,
} from '../../model/ArtifactType';
import { useAppDispatch } from '../../redux/hooks';
import { notify } from '../../redux/slice/notificationSlice';

const useStyles = makeStyles({
  button: {
    marginLeft: 8,
  },
});

interface Props {
  title: string;
}

const Styleguide: FC<Props> = ({ title }) => {
  const [artifacts, setArtifacts] = useState<Artifact[] | null>(null);
  const [openStylesheetDialog, setOpenStylesheetDialog] =
    useState<Artifact | null>(null);
  const dispatch = useAppDispatch();

  const history = useHistory();
  const classes = useStyles();

  const loadArtifacts = () => {
    artifactsRepository
      .getArtifactsByCategories([
        ARTIFACT_TYPE_TEMPLATE,
        ARTIFACT_TYPE_SNIPPET,
        ARTIFACT_TYPE_CSS_STYLESHEET,
      ])
      .then(setArtifacts);
  };

  useEffect(() => {
    loadArtifacts();
  }, []);

  const handleDeleteArtifact = (id: string) => {
    artifactsRepository
      .deleteArtifact(id)
      .then(loadArtifacts)
      .catch(() => {
        logger.error(`Failed removing the file from artifacts with id ${id}`);
        dispatch(
          notify({
            notificationOpen: true,
            notificationType: 'error',
            notificationMessage: 'Het verwijderen van het bestand is mislukt',
          })
        );
      });
  };

  return (
    <>
      <PageHeading title={title}>
        <Button
          className={classes.button}
          variant="contained"
          color="primary"
          onClick={() => history.push(ADD_TEMPLATE)}
        >
          <StyleIcon />
          &nbsp;Template uploaden
        </Button>
        <Button
          className={classes.button}
          variant="contained"
          color="primary"
          onClick={() => history.push(ADD_SNIPPETS)}
        >
          <LoyaltyIcon />
          &nbsp;Snippet uploaden
        </Button>
        {artifacts && (
          <Button
            className={classes.button}
            variant="contained"
            color="primary"
            onClick={() =>
              setOpenStylesheetDialog(
                artifacts?.find(
                  (value) => value.type === ARTIFACT_TYPE_CSS_STYLESHEET
                ) ?? null
              )
            }
          >
            <CodeIcon />
            &nbsp;CSS stylesheet wijzigen
          </Button>
        )}
        {openStylesheetDialog && (
          <StylesheetDialog
            openStylesheetDialog={openStylesheetDialog}
            oncloseDialog={() => setOpenStylesheetDialog(null)}
          />
        )}
      </PageHeading>
      <ArtifactsTable
        aggregate={AGGREGATE_STYLEGUIDE}
        artifacts={artifacts}
        onDelete={handleDeleteArtifact}
        showIdColumn={false}
        showArtifactType
      />
      {artifacts === null && <LoadingSpinner />}
    </>
  );
};

export default Styleguide;
