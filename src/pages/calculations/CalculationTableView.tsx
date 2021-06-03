import React, { useEffect } from 'react';
import TableContainer from '@material-ui/core/TableContainer';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';
import { makeStyles } from '@material-ui/core/styles';
import FindInPageTwoToneIcon from '@material-ui/icons/FindInPageTwoTone';
import { CalculationInfo } from '../../firebase/database/calculationsRepository';
import HtmlPreview from '../../components/dialog/HtmlPreview';
import regulationRepository, {
  Regulation,
} from '../../firebase/database/regulationRepository';

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

interface Props {
  calculationInfo: CalculationInfo;
}

const BreakingDistance: React.FC<Props> = ({ calculationInfo }) => {
  const [showHtmlPreview, setShowHtmlPreview] = React.useState<string>('');
  const [regulation, setRegulation] = React.useState<Regulation | null>(null);

  useEffect(() => {
    regulationRepository
      .getRegulationsByField('chapter', calculationInfo.regulationChapter)
      .then((result) => setRegulation(result.length !== 1 ? null : result[0]));
  }, [calculationInfo.regulationChapter]);

  const classes = useStyles();

  const closeHtmlPreviewHandle = (): void => setShowHtmlPreview('');

  return (
    <>
      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow className={classes.head}>
              <TableCell />
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
            {calculationInfo && (
              <>
                <TableRow hover key="1">
                  <TableCell className={classes.head} />
                  <TableCell>{calculationInfo.title}</TableCell>
                  <TableCell>
                    <img
                      style={{ width: 30 }}
                      src={`${calculationInfo.iconFile}`}
                    />
                  </TableCell>
                  <TableCell>{calculationInfo.explanation}</TableCell>
                  <TableCell>{calculationInfo.regulationButtonText}</TableCell>
                  <TableCell>
                    {regulation && (
                      <FindInPageTwoToneIcon
                        color="primary"
                        style={{ cursor: 'pointer', marginBottom: -5 }}
                        onClick={() => setShowHtmlPreview(regulation?.chapter)}
                      />
                    )}
                    {showHtmlPreview && (
                      <HtmlPreview
                        showHtmlPreview={regulation?.htmlFile}
                        closeHtmlPreviewHandle={closeHtmlPreviewHandle}
                      />
                    )}
                  </TableCell>
                </TableRow>
                <TableRow hover key="2">
                  <TableCell className={classes.head}>
                    <strong>Remafstand afbeelding</strong>
                  </TableCell>
                  <TableCell colSpan={5}>
                    <img
                      style={{ width: 600 }}
                      src={`${calculationInfo.calculationImage}`}
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
