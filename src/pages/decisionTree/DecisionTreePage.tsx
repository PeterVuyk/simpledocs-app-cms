import React, { FC, useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import { ButtonGroup } from '@mui/material';
import PageHeading from '../../layout/PageHeading';
import decisionTreeRepository from '../../firebase/database/decisionTreeRepository';
import ArtifactsList from './artifacts/ArtifactsList';
import DecisionTreeStepsList from './DecisionTreeStepsList';
import { EDIT_STATUS_DRAFT } from '../../model/EditStatus';
import EditStatusToggle from '../../components/form/EditStatusToggle';
import MarkForDeletionDecisionTreeMenuButton from './menu/remove/MarkForDeletionDecisionTreeMenuButton';
import RemoveDecisionTreeMenuButton from './menu/remove/RemoveDecisionTreeMenuButton';
import DownloadDecisionTreeMenuButton from './menu/download/DownloadDecisionTreeMenuButton';
import UploadDecisionTreeButton from './menu/upload/UploadDecisionTreeButton';
import useStatusToggle from '../../components/hooks/useStatusToggle';
import { ADD_DECISION_TREE } from '../../navigation/UrlSlugs';
import LoadingSpinner from '../../components/LoadingSpinner';
import { DOCUMENTATION_DECISION_TREE } from '../../model/DocumentationType';
import DiffDecisionTreeAction from '../../components/ItemAction/diffAction/diffDecisionTreeAction/DiffDecisionTreeAction';
import useNavigate from '../../navigation/useNavigate';
import { DecisionTree } from '../../model/DecisionTree/DecisionTree';

interface Props {
  title: string;
}

const DecisionTreePage: FC<Props> = ({ title }) => {
  const [decisionTrees, setDecisionTrees] = useState<DecisionTree[] | null>(
    null
  );
  const { editStatus, setEditStatus } = useStatusToggle();
  const { navigate } = useNavigate();

  const handleLoadDecisionTree = (): void => {
    decisionTreeRepository
      .getDecisionTree(editStatus === EDIT_STATUS_DRAFT)
      .then((steps) => setDecisionTrees(steps));
  };

  useEffect(() => {
    setDecisionTrees(null);
    decisionTreeRepository
      .getDecisionTree(editStatus === EDIT_STATUS_DRAFT)
      .then((steps) => {
        setDecisionTrees(steps);
      });
  }, [editStatus]);

  const hasDecisionTreeSteps = (steps: DecisionTree[]): boolean => {
    return (
      steps.filter(
        (step) => step.isDraft === (editStatus === EDIT_STATUS_DRAFT)
      ).length > 0
    );
  };

  const hasMarkedForDeletionTitles = (steps: DecisionTree[]): boolean => {
    return steps.filter((step) => step.markedForDeletion).length > 0;
  };

  return (
    <>
      <PageHeading title={title} help={DOCUMENTATION_DECISION_TREE}>
        <ButtonGroup>
          <EditStatusToggle
            editStatus={editStatus}
            setEditStatus={setEditStatus}
          />
          {decisionTrees && hasMarkedForDeletionTitles(decisionTrees) && (
            <MarkForDeletionDecisionTreeMenuButton
              decisionTrees={decisionTrees}
              onSubmitAction={handleLoadDecisionTree}
            />
          )}
          {decisionTrees && hasDecisionTreeSteps(decisionTrees) && (
            <>
              {editStatus === EDIT_STATUS_DRAFT && (
                <DiffDecisionTreeAction decisionTrees={decisionTrees} />
              )}
              <RemoveDecisionTreeMenuButton
                editStatus={editStatus}
                decisionTrees={decisionTrees}
                onSubmitAction={handleLoadDecisionTree}
              />
              <DownloadDecisionTreeMenuButton
                editStatus={editStatus}
                decisionTrees={decisionTrees}
              />
            </>
          )}
          <Button
            variant="contained"
            color="primary"
            onClick={(e) => {
              navigate(e, ADD_DECISION_TREE);
            }}
          >
            Toelichting bestand uploaden
          </Button>
          <UploadDecisionTreeButton
            onLoadDecisionTree={handleLoadDecisionTree}
          />
        </ButtonGroup>
      </PageHeading>
      <DecisionTreeStepsList
        editStatus={editStatus}
        decisionTrees={decisionTrees}
      />
      {editStatus === EDIT_STATUS_DRAFT && <ArtifactsList />}
      {decisionTrees === null && <LoadingSpinner />}
    </>
  );
};

export default DecisionTreePage;
