import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Papa from 'papaparse';
import FileSaver from 'file-saver';
import GetAppIcon from '@material-ui/icons/GetApp';
import FindInPageTwoToneIcon from '@material-ui/icons/FindInPageTwoTone';
import PageHeading from '../../layout/PageHeading';
import UploadDecisionTreeDialog from './uploadCSVFile/UploadDecisionTreeDialog';
import decisionTreeRepository, {
  DecisionTreeStep,
} from '../../firebase/database/decisionTreeRepository';
import HtmlPreview from '../../components/dialog/HtmlPreview';
import regulationRepository from '../../firebase/database/regulationRepository';

const useStyles = makeStyles({
  table: {
    width: '100%',
  },
  button: {
    marginLeft: 8,
  },
  head: {
    backgroundColor: '#ddd',
  },
});

const DecisionTree: React.FC = () => {
  const classes = useStyles();
  const [decisionTreeSteps, setDecisionTreeSteps] = React.useState<
    DecisionTreeStep[]
  >([]);
  const [openUploadDialog, setOpenUploadDialog] = React.useState<boolean>(
    false
  );
  const [showHtmlPreview, setShowHtmlPreview] = React.useState<string>('');
  const [htmlFile, setHtmlFile] = React.useState<string | null>();

  const closeHtmlPreviewHandle = (): void => setShowHtmlPreview('');

  useEffect(() => {
    regulationRepository
      .getRegulationsByField('chapter', showHtmlPreview.toString())
      .then((result) => setHtmlFile(result.shift()?.htmlFile ?? null));
  }, [showHtmlPreview]);

  const exportDecisionTreeCSFile = (): void => {
    const csvString = Papa.unparse({
      fields: ['id', 'label', 'parentId', 'lineLabel', 'regulationChapter'],
      data: decisionTreeSteps,
    });
    const csvFile = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    FileSaver.saveAs(csvFile, 'beslisboom.csv');
  };

  const loadDecisionTreeHandle = (): void => {
    decisionTreeRepository
      .getDecisionTreeSteps()
      .then((steps) => setDecisionTreeSteps(steps));
  };

  useEffect(() => {
    loadDecisionTreeHandle();
  }, []);

  return (
    <>
      <PageHeading title="Beslisboom">
        {decisionTreeSteps.length !== 0 && (
          <Button
            className={classes.button}
            variant="contained"
            onClick={() => exportDecisionTreeCSFile()}
          >
            <GetAppIcon color="action" />
          </Button>
        )}
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
            dialogText="Vervang de beslisboom met een nieuwe versie door middel van een komma gescheiden csv bestand."
            setOpenUploadDialog={setOpenUploadDialog}
            loadDecisionTreeHandle={loadDecisionTreeHandle}
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
                <strong>Verwijzing</strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {decisionTreeSteps.map((row) => (
              <TableRow hover key={row.id}>
                <TableCell component="th" scope="row">
                  {row.id}
                </TableCell>
                <TableCell>{row.label}</TableCell>
                <TableCell>{row.parentId}</TableCell>
                <TableCell>{row.lineLabel}</TableCell>
                <TableCell>
                  {row.regulationChapter}&nbsp;
                  {row.regulationChapter && (
                    <FindInPageTwoToneIcon
                      color="primary"
                      style={{ cursor: 'pointer', marginBottom: -5 }}
                      onClick={() =>
                        setShowHtmlPreview(row.regulationChapter ?? '')
                      }
                    />
                  )}
                  {showHtmlPreview &&
                    htmlFile &&
                    showHtmlPreview === row.regulationChapter && (
                      <HtmlPreview
                        showHtmlPreview={htmlFile}
                        closeHtmlPreviewHandle={closeHtmlPreviewHandle}
                      />
                    )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default DecisionTree;
