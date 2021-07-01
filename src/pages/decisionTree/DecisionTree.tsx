import React, { FC, useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import GetAppIcon from '@material-ui/icons/GetApp';
import DeleteTwoToneIcon from '@material-ui/icons/DeleteTwoTone';
import { useHistory } from 'react-router-dom';
import RestoreFromTrashTwoToneIcon from '@material-ui/icons/RestoreFromTrashTwoTone';
import PageHeading from '../../layout/PageHeading';
import decisionTreeRepository from '../../firebase/database/decisionTreeRepository';
import RemoveDecisionTreeMenu from './RemoveDecisionTreeMenu';
import UploadDecisionTreeDialog from './UploadDecisionTreeDialog';
import { DecisionTreeStep } from '../../model/DecisionTreeStep';
import DownloadDecisionTreeMenu from './download/DownloadDecisionTreeMenu';
import HtmlFileList from './html/HtmlFileList';
import DecisionTreeStepsList from './DecisionTreeStepsList';
import { EDIT_STATUS_DRAFT, EditStatus } from '../../model/EditStatus';
import EditStatusToggle from '../../components/form/EditStatusToggle';
import UndoMarkForDeletionDecisionTreeMenu from './UndoMarkForDeletionDecisionTreeMenu';

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
  const [downloadMenuElement, setDownloadMenuElement] =
    useState<null | HTMLElement>(null);
  const [deleteMenuElement, setDeleteMenuElement] =
    useState<null | HTMLElement>(null);
  const [removeMarkForDeleteMenuElement, setRemoveMarkForDeleteMenuElement] =
    useState<null | HTMLElement>(null);
  const history = useHistory();

  const openDownloadMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setDownloadMenuElement(event.currentTarget);
  };

  const openDeleteMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setDeleteMenuElement(event.currentTarget);
  };

  const openRemoveMarkForDeletionMenu = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    setRemoveMarkForDeleteMenuElement(event.currentTarget);
  };

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
          <>
            <Button
              className={classes.button}
              variant="contained"
              style={{ backgroundColor: '#099000FF' }}
              onClick={openRemoveMarkForDeletionMenu}
            >
              <RestoreFromTrashTwoToneIcon
                style={{ cursor: 'pointer', color: 'white' }}
              />
            </Button>
            <UndoMarkForDeletionDecisionTreeMenu
              removeMarkForDeleteMenuElement={removeMarkForDeleteMenuElement}
              setRemoveMarkForDeleteMenuElement={
                setRemoveMarkForDeleteMenuElement
              }
              decisionTreeSteps={decisionTreeSteps}
              onSubmitAction={loadDecisionTreeHandle}
            />
          </>
        )}
        {decisionTreeSteps && hasDecisionTreeSteps(decisionTreeSteps) && (
          <>
            <Button
              className={classes.button}
              variant="contained"
              color="secondary"
              onClick={openDeleteMenu}
            >
              <DeleteTwoToneIcon />
            </Button>
            <Button
              className={classes.button}
              variant="contained"
              onClick={openDownloadMenu}
            >
              <GetAppIcon color="action" />
            </Button>
            <DownloadDecisionTreeMenu
              decisionTreeSteps={decisionTreeSteps}
              downloadMenuElement={downloadMenuElement}
              setDownloadMenuElement={setDownloadMenuElement}
            />
            <RemoveDecisionTreeMenu
              editStatus={editStatus}
              removeMenuElement={deleteMenuElement}
              setRemoveMenuElement={setDeleteMenuElement}
              decisionTreeSteps={decisionTreeSteps}
              onSubmitAction={loadDecisionTreeHandle}
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
