import React, { FC, useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import CodeIcon from '@mui/icons-material/Code';
import StyleIcon from '@mui/icons-material/Style';
import LoyaltyIcon from '@mui/icons-material/Loyalty';
import { ButtonGroup } from '@mui/material';
import ArtifactsTable from '../../components/artifact/ArtifactsTable';
import logger from '../../helper/logger';
import PageHeading from '../../layout/PageHeading';
import { AGGREGATE_STYLEGUIDE } from '../../model/Aggregate';
import { ADD_SNIPPETS, ADD_TEMPLATE } from '../../navigation/UrlSlugs';
import LoadingSpinner from '../../components/LoadingSpinner';
import StylesheetDialog from './StylesheetDialog';
import { Artifact } from '../../model/artifacts/Artifact';
import artifactsRepository from '../../firebase/database/artifactsRepository';
import {
  ARTIFACT_TYPE_CSS_STYLESHEET,
  ARTIFACT_TYPE_SNIPPET,
  ARTIFACT_TYPE_TEMPLATE,
} from '../../model/artifacts/ArtifactType';
import { useAppDispatch } from '../../redux/hooks';
import { notify } from '../../redux/slice/notificationSlice';
import useNavigate from '../../navigation/useNavigate';

interface Props {
  title: string;
}

const Styleguide: FC<Props> = ({ title }) => {
  const [artifacts, setArtifacts] = useState<Artifact[] | null>(null);
  const [openStylesheetDialog, setOpenStylesheetDialog] =
    useState<Artifact | null>(null);
  const dispatch = useAppDispatch();

  const { navigate } = useNavigate();

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

  const handleDeleteArtifact = async (id: string) => {
    await artifactsRepository
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
        <ButtonGroup>
          <Button
            variant="contained"
            color="primary"
            onClick={(e) => navigate(e, ADD_TEMPLATE)}
          >
            <StyleIcon />
            &nbsp;Template uploaden
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={(e) => navigate(e, ADD_SNIPPETS)}
          >
            <LoyaltyIcon />
            &nbsp;Snippet uploaden
          </Button>
          {artifacts && (
            <Button
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
        </ButtonGroup>
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
