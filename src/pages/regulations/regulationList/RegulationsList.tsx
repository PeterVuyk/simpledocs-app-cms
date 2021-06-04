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
import { useHistory } from 'react-router-dom';
import GetAppIcon from '@material-ui/icons/GetApp';
import Menu from '@material-ui/core/Menu';
import regulationRepository, {
  Regulation,
} from '../../../firebase/database/regulationRepository';
import RegulationListItem from './RegulationListItem';
import PageHeading from '../../../layout/PageHeading';
import DownloadRegulationsMenuItem from '../batch/DownloadRegulationsMenuItem';
import DownloadRegulationsHTMLMenuItem from '../batch/DownloadRegulationsHTMLMenuItem';
import DownloadRegulationsIconsMenuItem from '../batch/DownloadRegulationsIconsMenuItem';

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

const RegulationsList: React.FC = () => {
  const [
    downloadMenuElement,
    setDownloadMenuElement,
  ] = React.useState<null | HTMLElement>(null);
  const [regulations, setRegulations] = React.useState<Regulation[]>([]);
  const classes = useStyles();
  const history = useHistory();

  const openDownloadMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setDownloadMenuElement(event.currentTarget);
  };

  const loadRegulationsHandle = (): void => {
    regulationRepository
      .getRegulations()
      .then((result) => setRegulations(result));
  };

  React.useEffect(() => {
    loadRegulationsHandle();
  }, []);

  return (
    <>
      <PageHeading title="Regelgevingen beheer">
        {regulations.length !== 0 && (
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
          onClick={() => history.push('/regulations/add')}
        >
          Pagina toevoegen
        </Button>
        <Menu
          id="simple-menu"
          anchorEl={downloadMenuElement}
          keepMounted
          open={Boolean(downloadMenuElement)}
          onClose={() => setDownloadMenuElement(null)}
        >
          <DownloadRegulationsMenuItem regulations={regulations} />
          <DownloadRegulationsHTMLMenuItem regulations={regulations} />
          <DownloadRegulationsIconsMenuItem regulations={regulations} />
        </Menu>
      </PageHeading>
      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow className={classes.head}>
              <TableCell>
                <strong>Hoofdstuk</strong>
              </TableCell>
              <TableCell>
                <strong>Titel</strong>
              </TableCell>
              <TableCell>
                <strong>Markering</strong>
              </TableCell>
              <TableCell>
                <strong>Index</strong>
              </TableCell>
              <TableCell>
                <strong>Illustratie</strong>
              </TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {regulations.map((row) => (
              <TableRow hover key={row.chapter}>
                <RegulationListItem
                  regulation={row}
                  loadRegulationsHandle={loadRegulationsHandle}
                />
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default RegulationsList;
