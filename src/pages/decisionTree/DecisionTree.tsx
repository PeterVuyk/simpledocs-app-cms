import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import PageHeading from '../../layout/PageHeading';
import UploadDecisionTreeDialog from './UploadDecisionTreeDialog';

const useStyles = makeStyles({
  table: {
    width: '100%',
  },
  head: {
    backgroundColor: '#ddd',
  },
});

const Publications: React.FC = () => {
  const classes = useStyles();
  const [openUploadDialog, setOpenUploadDialog] = React.useState<boolean>(
    false
  );

  return (
    <>
      <PageHeading title="Beslisboom">
        <Button
          variant="contained"
          color="primary"
          onClick={() => setOpenUploadDialog(true)}
        >
          Beslisboom uploaden
        </Button>
        {openUploadDialog && (
          <UploadDecisionTreeDialog
            dialogText="Vervang de beslisboom met een nieuwe versie door middel van een komma gescheiden csv bestand."
            setOpenUploadDialog={setOpenUploadDialog}
          />
        )}
      </PageHeading>
      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow className={classes.head}>
              <TableCell>
                <strong>ID</strong>
              </TableCell>
              <TableCell>
                <strong>Label</strong>
              </TableCell>
              <TableCell>
                <strong>Parent ID</strong>
              </TableCell>
              <TableCell>
                <strong>Antwoord</strong>
              </TableCell>
              <TableCell>
                <strong>Link regelgevingen</strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <p>bla</p>
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default Publications;
