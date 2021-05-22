import React, { useEffect, useState } from 'react';
import TableContainer from '@material-ui/core/TableContainer';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';
import { makeStyles } from '@material-ui/core/styles';
import Alert from '@material-ui/lab/Alert';
import FindInPageTwoToneIcon from '@material-ui/icons/FindInPageTwoTone';
import PageHeading from '../../layout/PageHeading';
import breakingDistanceRepository, {
  BreakingDistanceInfo,
} from '../../firebase/database/breakingDistanceRepository';
import logger from '../../helper/logger';
import HtmlPreview from '../../components/dialog/HtmlPreview';
import regulationRepository from '../../firebase/database/regulationRepository';

const useStyles = makeStyles({
  table: {
    width: '100%',
  },
  head: {
    backgroundColor: '#ddd',
  },
});

const BreakingDistance: React.FC = () => {
  const [error, setError] = useState('');
  const [
    breakingDistanceInfo,
    setBreakingDistanceInfo,
  ] = React.useState<BreakingDistanceInfo | null>(null);
  const [showHtmlPreview, setShowHtmlPreview] = React.useState<string>('');
  const [htmlFile, setHtmlFile] = React.useState<string | null>();

  const classes = useStyles();

  const closeHtmlPreviewHandle = (): void => setShowHtmlPreview('');

  useEffect(() => {
    if (showHtmlPreview === '') {
      return;
    }
    regulationRepository
      .getRegulationsByField('chapter', showHtmlPreview)
      .then((result) => setHtmlFile(result.shift()?.htmlFile ?? null));
  }, [showHtmlPreview]);

  const reloadPublicationsHandle = (): void => {
    breakingDistanceRepository.getBreakingDistanceInfo().then((result) => {
      if (result.length !== 1) {
        setError(
          'Er is iets misgegaan bij het ophalen van de data. Neem contact op met de beheerder.'
        );
        logger.error(
          `Collected breakingDistanceInfo from database, expected only one row, but ${result.length} rows found`
        );
        return;
      }
      setBreakingDistanceInfo(result[0]);
    });
  };

  React.useEffect(() => {
    reloadPublicationsHandle();
  }, []);

  return (
    <>
      <PageHeading title="Beslisboom" />
      <TableContainer component={Paper}>
        {error && <Alert severity="error">{error}</Alert>}
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow className={classes.head}>
              <TableCell>
                <strong>Titel</strong>
              </TableCell>
              <TableCell>
                <strong>Toelichting</strong>
              </TableCell>
              <TableCell>
                <strong>Illustratie</strong>
              </TableCell>
              <TableCell>
                <strong>Verwijzing regelgeving</strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {breakingDistanceInfo && (
              <TableRow hover key="1">
                <TableCell>{breakingDistanceInfo.title}</TableCell>
                <TableCell>{breakingDistanceInfo.explanation}</TableCell>
                <TableCell>
                  <img src={`${breakingDistanceInfo.iconFile}`} />
                </TableCell>
                <TableCell>
                  {breakingDistanceInfo.regulationChapter}
                  <FindInPageTwoToneIcon
                    color="primary"
                    style={{ cursor: 'pointer', marginBottom: -5 }}
                    onClick={() =>
                      setShowHtmlPreview(breakingDistanceInfo.regulationChapter)
                    }
                  />
                  {showHtmlPreview && htmlFile && (
                    <HtmlPreview
                      showHtmlPreview={htmlFile}
                      closeHtmlPreviewHandle={closeHtmlPreviewHandle}
                    />
                  )}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default BreakingDistance;
