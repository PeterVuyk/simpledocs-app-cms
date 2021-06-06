import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import { useHistory } from 'react-router-dom';
import GetAppIcon from '@material-ui/icons/GetApp';
import Menu from '@material-ui/core/Menu';
import regulationRepository, {
  Regulation,
} from '../../../firebase/database/regulationRepository';
import PageHeading from '../../../layout/PageHeading';
import DownloadRegulationsMenuItem from '../batch/DownloadRegulationsMenuItem';
import DownloadRegulationsHTMLMenuItem from '../batch/DownloadRegulationsHTMLMenuItem';
import DownloadRegulationsIconsMenuItem from '../batch/DownloadRegulationsIconsMenuItem';
import EditStatusToggle from '../../../components/form/EditStatusToggle';
import RegulationList from './RegulationList';

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

const Regulations: React.FC = () => {
  const [downloadMenuElement, setDownloadMenuElement] =
    React.useState<null | HTMLElement>(null);
  const [regulations, setRegulations] = React.useState<Regulation[]>([]);
  const [editStatus, setEditStatus] =
    React.useState<'draft' | 'published'>('draft');
  const classes = useStyles();
  const history = useHistory();

  const openDownloadMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setDownloadMenuElement(event.currentTarget);
  };

  const loadRegulationsHandle = (): void => {
    regulationRepository
      .getRegulations(editStatus === 'draft')
      .then((result) => setRegulations(result));
  };

  React.useEffect(() => {
    regulationRepository
      .getRegulations(editStatus === 'draft')
      .then((result) => setRegulations(result));
  }, [editStatus]);

  return (
    <>
      <PageHeading title="Regelgevingen beheer">
        <EditStatusToggle
          editStatus={editStatus}
          setEditStatus={setEditStatus}
        />
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
          id="regulation-download-menu"
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
      <RegulationList
        editStatus={editStatus}
        loadRegulationsHandle={loadRegulationsHandle}
        regulations={regulations}
      />
    </>
  );
};

export default Regulations;
