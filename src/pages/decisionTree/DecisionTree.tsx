import React, { FC, useEffect, useState } from 'react';
import Button from '@material-ui/core/Button';
import { ButtonGroup } from '@material-ui/core';
import PageHeading from '../../layout/PageHeading';
import decisionTreeRepository from '../../firebase/database/decisionTreeRepository';
import { DecisionTreeStep } from '../../model/DecisionTreeStep';
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

interface Props {
  title: string;
}

const DecisionTree: FC<Props> = ({ title }) => {
  const [decisionTreeSteps, setDecisionTreeSteps] = useState<
    DecisionTreeStep[] | null
  >(null);
  const { editStatus, setEditStatus } = useStatusToggle();
  const { history, navigate } = useNavigate();

  const handleLoadDecisionTree = (): void => {
    decisionTreeRepository
      .getDecisionTreeSteps(editStatus === EDIT_STATUS_DRAFT)
      .then((steps) => setDecisionTreeSteps(steps));
  };

  useEffect(() => {
    setDecisionTreeSteps(null);
    decisionTreeRepository
      .getDecisionTreeSteps(editStatus === EDIT_STATUS_DRAFT)
      .then((steps) => {
        setDecisionTreeSteps(steps);
      });
  }, [editStatus]);

  const hasDecisionTreeSteps = (steps: DecisionTreeStep[]): boolean => {
    return (
      steps.filter(
        (step) => step.isDraft === (editStatus === EDIT_STATUS_DRAFT)
      ).length > 0
    );
  };

  const hasMarkedForDeletionTitles = (steps: DecisionTreeStep[]): boolean => {
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
          {decisionTreeSteps &&
            hasMarkedForDeletionTitles(decisionTreeSteps) && (
              <MarkForDeletionDecisionTreeMenuButton
                decisionTreeSteps={decisionTreeSteps}
                onSubmitAction={handleLoadDecisionTree}
              />
            )}
          {decisionTreeSteps && hasDecisionTreeSteps(decisionTreeSteps) && (
            <>
              {editStatus === EDIT_STATUS_DRAFT && (
                <DiffDecisionTreeAction decisionTreeSteps={decisionTreeSteps} />
              )}
              <RemoveDecisionTreeMenuButton
                editStatus={editStatus}
                decisionTreeSteps={decisionTreeSteps}
                onSubmitAction={handleLoadDecisionTree}
              />
              <DownloadDecisionTreeMenuButton
                editStatus={editStatus}
                decisionTreeSteps={decisionTreeSteps}
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
        decisionTreeSteps={decisionTreeSteps}
      />
      {editStatus === EDIT_STATUS_DRAFT && <ArtifactsList />}
      {decisionTreeSteps === null && <LoadingSpinner />}
    </>
  );
};

export default DecisionTree;
