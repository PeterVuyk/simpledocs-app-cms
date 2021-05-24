import React, { useState } from 'react';
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
import Button from '@material-ui/core/Button';
import { useHistory } from 'react-router-dom';
import PageHeading from '../../layout/PageHeading';
import breakingDistanceRepository, {
  BreakingDistanceInfo,
} from '../../firebase/database/breakingDistanceRepository';
import logger from '../../helper/logger';
import HtmlPreview from '../../components/dialog/HtmlPreview';

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

const BreakingDistance: React.FC = () => {
  const [error, setError] = useState('');
  const [
    breakingDistanceInfo,
    setBreakingDistanceInfo,
  ] = React.useState<BreakingDistanceInfo | null>(null);
  const [showHtmlPreview, setShowHtmlPreview] = React.useState<string>('');

  const classes = useStyles();
  const history = useHistory();

  const closeHtmlPreviewHandle = (): void => setShowHtmlPreview('');

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
      <PageHeading title="Remafstand berekenen">
        <Button
          className={classes.button}
          variant="contained"
          color="primary"
          onClick={() => history.push('/breaking-distance/edit')}
        >
          Remafstand updaten
        </Button>
      </PageHeading>
      <TableContainer component={Paper}>
        {error && <Alert severity="error">{error}</Alert>}
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow className={classes.head}>
              <TableCell>
                <strong>Titel</strong>
              </TableCell>
              <TableCell>
                <strong>Illustratie</strong>
              </TableCell>
              <TableCell>
                <strong>Toelichting</strong>
              </TableCell>
              <TableCell>
                <strong>Regelgeving knop tekst</strong>
              </TableCell>
              <TableCell>
                <strong>Regelgeving pagina</strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {breakingDistanceInfo && (
              <>
                <TableRow hover key="1">
                  <TableCell>{breakingDistanceInfo.title}</TableCell>
                  <TableCell>
                    <img
                      style={{ width: 30 }}
                      src={`${breakingDistanceInfo.iconFile}`}
                    />
                  </TableCell>
                  <TableCell>{breakingDistanceInfo.explanation}</TableCell>
                  <TableCell>
                    {breakingDistanceInfo.regulationButtonText}
                  </TableCell>
                  <TableCell>
                    <FindInPageTwoToneIcon
                      color="primary"
                      style={{ cursor: 'pointer', marginBottom: -5 }}
                      onClick={() =>
                        setShowHtmlPreview(breakingDistanceInfo.htmlFile)
                      }
                    />
                    {showHtmlPreview && (
                      <HtmlPreview
                        showHtmlPreview={breakingDistanceInfo.htmlFile}
                        closeHtmlPreviewHandle={closeHtmlPreviewHandle}
                      />
                    )}
                  </TableCell>
                </TableRow>
                <TableRow hover key="2">
                  <TableCell className={classes.head}>
                    <strong>Remafstand afbeelding</strong>
                  </TableCell>
                  <TableCell colSpan={4}>
                    <img
                      style={{ width: 600 }}
                      src={`${breakingDistanceInfo?.breakingDistanceImage}`}
                    />
                  </TableCell>
                </TableRow>
              </>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default BreakingDistance;
