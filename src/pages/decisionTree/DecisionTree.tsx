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
import GetAppIcon from '@material-ui/icons/GetApp';
import FindInPageTwoToneIcon from '@material-ui/icons/FindInPageTwoTone';
import DeleteTwoToneIcon from '@material-ui/icons/DeleteTwoTone';
import PageHeading from '../../layout/PageHeading';
import decisionTreeRepository, {
  DecisionTreeStep,
} from '../../firebase/database/decisionTreeRepository';
import HtmlPreview from '../../components/dialog/HtmlPreview';
import regulationRepository from '../../firebase/database/regulationRepository';
import DownloadDecisionTreeMenu from './DownloadDecisionTreeMenu';
import RemoveDecisionTreeMenu from './RemoveDecisionTreeMenu';
import UploadDecisionTreeDialog from './UploadDecisionTreeDialog';

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
  const [
    showHtmlPreview,
    setShowHtmlPreview,
  ] = React.useState<DecisionTreeStep>();
  const [htmlFile, setHtmlFile] = React.useState<string | null>();
  const [
    downloadMenuElement,
    setDownloadMenuElement,
  ] = React.useState<null | HTMLElement>(null);
  const [
    deleteMenuElement,
    setDeleteMenuElement,
  ] = React.useState<null | HTMLElement>(null);

  const openDownloadMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setDownloadMenuElement(event.currentTarget);
  };

  const openDeleteMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setDeleteMenuElement(event.currentTarget);
  };

  const closeHtmlPreviewHandle = (): void => setShowHtmlPreview(undefined);

  useEffect(() => {
    if (
      showHtmlPreview === null ||
      showHtmlPreview?.regulationChapter === undefined
    ) {
      return;
    }
    regulationRepository
      .getRegulationsByField(
        'chapter',
        showHtmlPreview.regulationChapter.toString()
      )
      .then((result) => setHtmlFile(result.shift()?.htmlFile ?? null));
  }, [showHtmlPreview]);

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
            color="secondary"
            onClick={openDeleteMenu}
          >
            <DeleteTwoToneIcon />
          </Button>
        )}
        {decisionTreeSteps.length !== 0 && (
          <Button
            className={classes.button}
            variant="contained"
            onClick={openDownloadMenu}
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
            dialogText="Voeg een nieuwe beslisboom toe of vervang de bestaande door middel van het overschrijven van de benaming en het uploaden van een komma gescheiden csv bestand."
            setOpenUploadDialog={setOpenUploadDialog}
            loadDecisionTreeHandle={loadDecisionTreeHandle}
          />
        )}
        <DownloadDecisionTreeMenu
          decisionTreeSteps={decisionTreeSteps}
          downloadMenuElement={downloadMenuElement}
          setDownloadMenuElement={setDownloadMenuElement}
        />
        <RemoveDecisionTreeMenu
          removeMenuElement={deleteMenuElement}
          setRemoveMenuElement={setDeleteMenuElement}
          decisionTreeSteps={decisionTreeSteps}
          onSubmitAction={loadDecisionTreeHandle}
        />
      </PageHeading>
      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow className={classes.head}>
              <TableCell>
                <strong>Titel</strong>
              </TableCell>
              <TableCell>
                <strong>ID</strong>
                <br />
                id
              </TableCell>
              <TableCell>
                <strong>Label</strong>
                <br />
                label
              </TableCell>
              <TableCell style={{ whiteSpace: 'nowrap' }}>
                <strong>Parent ID</strong>
                <br />
                parentId
              </TableCell>
              <TableCell>
                <strong>Antwoord</strong>
                <br />
                lineLabel
              </TableCell>
              <TableCell>
                <strong>Verwijzing</strong>
                <br />
                regulationChapter
              </TableCell>
              <TableCell>
                <strong>Interne notitie</strong>
                <br />
                internalNote
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {decisionTreeSteps.map((row) => (
              <TableRow hover key={row.id + row.title}>
                <TableCell component="th" scope="row">
                  {row.title}&nbsp;
                  {row.iconFile && (
                    <img style={{ width: 30 }} src={`${row.iconFile}`} />
                  )}
                </TableCell>
                <TableCell>{row.id}</TableCell>
                <TableCell>{row.label}</TableCell>
                <TableCell>{row.parentId}</TableCell>
                <TableCell>{row.lineLabel}</TableCell>
                <TableCell>
                  {row.regulationChapter}&nbsp;
                  {row.regulationChapter && (
                    <FindInPageTwoToneIcon
                      color="primary"
                      style={{ cursor: 'pointer', marginBottom: -5 }}
                      onClick={() => setShowHtmlPreview(row)}
                    />
                  )}
                  {showHtmlPreview &&
                    htmlFile &&
                    showHtmlPreview.title === row.title &&
                    showHtmlPreview.regulationChapter ===
                      row.regulationChapter && (
                      <HtmlPreview
                        showHtmlPreview={htmlFile}
                        closeHtmlPreviewHandle={closeHtmlPreviewHandle}
                      />
                    )}
                </TableCell>
                <TableCell>{row.internalNote}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default DecisionTree;
