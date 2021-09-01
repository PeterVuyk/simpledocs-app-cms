import React, { FC, useState } from 'react';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import UploadDecisionTreeDialog from '../../UploadDecisionTreeDialog';

const useStyles = makeStyles({
  button: {
    marginLeft: 8,
  },
});

interface Props {
  onLoadDecisionTree: () => void;
}

const UploadDecisionTreeButton: FC<Props> = ({ onLoadDecisionTree }) => {
  const [openUploadDialog, setOpenUploadDialog] = useState<boolean>(false);
  const classes = useStyles();

  return (
    <>
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
          onLoadDecisionTree={onLoadDecisionTree}
        />
      )}
    </>
  );
};

export default UploadDecisionTreeButton;
