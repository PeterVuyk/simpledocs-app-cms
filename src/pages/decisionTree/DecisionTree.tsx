import React, { FC, useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import { useHistory } from 'react-router-dom';
import PageHeading from '../../layout/PageHeading';
import decisionTreeRepository from '../../firebase/database/decisionTreeRepository';
import UploadDecisionTreeDialog from './UploadDecisionTreeDialog';
import { DecisionTreeStep } from '../../model/DecisionTreeStep';
import HtmlFileList from './html/HtmlFileList';
import DecisionTreeStepsList from './DecisionTreeStepsList';
import { EDIT_STATUS_DRAFT, EditStatus } from '../../model/EditStatus';
import EditStatusToggle from '../../components/form/EditStatusToggle';
import MarkForDeletionDecisionTreeMenuButton from './remove/MarkForDeletionDecisionTreeMenuButton';
import RemoveDecisionTreeMenuButton from './remove/RemoveDecisionTreeMenuButton';
import DownloadDecisionTreeMenuButton from './download/DownloadDecisionTreeMenuButton';

const useStyles = makeStyles({
  button: {
    marginLeft: 8,
  },
});

const DecisionTree: FC = () => {
  const classes = useStyles();
  const [decisionTreeSteps, setDecisionTreeSteps] = useState<
    DecisionTreeStep[] | null
  >();
  const [openUploadDialog, setOpenUploadDialog] = useState<boolean>(false);
  const [editStatus, setEditStatus] = useState<EditStatus>(EDIT_STATUS_DRAFT);
  const history = useHistory();

  const loadDecisionTreeHandle = (): void => {
    decisionTreeRepository
      .getDecisionTreeSteps(editStatus === EDIT_STATUS_DRAFT)
      .then((steps) => setDecisionTreeSteps(steps));
  };

  useEffect(() => {
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
      <PageHeading title="Beslisboom">
        <EditStatusToggle
          editStatus={editStatus}
          setEditStatus={setEditStatus}
        />
        {decisionTreeSteps && hasMarkedForDeletionTitles(decisionTreeSteps) && (
          <MarkForDeletionDecisionTreeMenuButton
            decisionTreeSteps={decisionTreeSteps}
            onSubmitAction={loadDecisionTreeHandle}
          />
        )}
        {decisionTreeSteps && hasDecisionTreeSteps(decisionTreeSteps) && (
          <>
            <RemoveDecisionTreeMenuButton
              editStatus={editStatus}
              decisionTreeSteps={decisionTreeSteps}
              onSubmitAction={loadDecisionTreeHandle}
            />
            <DownloadDecisionTreeMenuButton
              editStatus={editStatus}
              decisionTreeSteps={decisionTreeSteps}
            />
          </>
        )}
        <Button
          className={classes.button}
          variant="contained"
          color="primary"
          onClick={() => history.push(`/decision-tree/html/add`)}
        >
          HTML bestand uploaden
        </Button>
        <Button
          className={classes.button}
          variant="contained"
          color="primary"
          onClick={() => setOpenUploadDialog(true)}
        >
          Beslisboom uploaden
        </Button>
        {openUploadDialog && (
          <UploadDecisionTreeDialog
            dialogText="Voeg een nieuwe beslisboom toe of vervang de bestaande door middel van het overschrijven van de benaming en het uploaden van een komma gescheiden csv bestand."
            setOpenUploadDialog={setOpenUploadDialog}
            loadDecisionTreeHandle={loadDecisionTreeHandle}
          />
        )}
      </PageHeading>
      {decisionTreeSteps && (
        <DecisionTreeStepsList
          editStatus={editStatus}
          decisionTreeSteps={decisionTreeSteps}
        />
      )}
      {editStatus === EDIT_STATUS_DRAFT && <HtmlFileList />}
    </>
  );
};

export default DecisionTree;
