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
import Typography from '@material-ui/core/Typography';
import { useHistory } from 'react-router-dom';
import DeleteTwoToneIcon from '@material-ui/icons/DeleteTwoTone';
import { connect } from 'react-redux';
import regulationRepository, {
  Regulation,
} from '../firebase/database/regulationRepository';
import RegulationDialog from '../component/RegulationDialog';
import notification, {
  NotificationOptions,
} from '../redux/actions/notification';

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
  head: {
    backgroundColor: '#ddd',
  },
  icon: {
    width: 30,
  },
});

interface Props {
  setNotification: (notificationOptions: NotificationOptions) => void;
}

const RegulationsTable: React.FC<Props> = ({ setNotification }) => {
  const [regulations, setRegulations] = React.useState<Regulation[]>([]);
  const [openDialog, setOpenDialog] = React.useState<Regulation | null>(null);
  const classes = useStyles();
  const history = useHistory();

  const updateRegulationState = (): void => {
    regulationRepository
      .getRegulations()
      .then((result) => setRegulations(result));
  };

  React.useEffect(() => {
    updateRegulationState();
  }, []);

  const getLevel = (level: string): string => {
    const levels = {
      chapter: 'Hoofdstuk',
      section: 'Paragraaf',
      subSection: 'Subparagraaf',
      attachment: 'Bijlage',
      legislation: 'Wetgeving',
    };
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return level in levels ? levels[level] : '';
  };

  const onDelete = (id: string): void => {
    regulationRepository
      .deleteRegulation(id)
      .then(() => updateRegulationState())
      .then(() =>
        setNotification({
          notificationType: 'success',
          notificationOpen: true,
          notificationMessage: 'Pagina is verwijderd.',
        })
      );
  };

  return (
    <div>
      <div style={{ overflow: 'hidden', marginTop: 10, marginBottom: 10 }}>
        <div style={{ float: 'left' }}>
          <Typography variant="h5">Regelgevingen beheer</Typography>
        </div>
        <div style={{ float: 'right' }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => history.push('/regulations/add')}
          >
            Pagina toevoegen
          </Button>
        </div>
      </div>
      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow className={classes.head}>
              <TableCell>Hoofdstuk</TableCell>
              <TableCell>Titel</TableCell>
              <TableCell>Markering</TableCell>
              <TableCell>Index</TableCell>
              <TableCell>Illustratie</TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {regulations.map((row) => (
              <TableRow
                hover
                onClick={() => console.log('TODO: Go to edit page')}
                key={row.title}
              >
                <TableCell component="th" scope="row">
                  {row.chapter}
                </TableCell>
                <TableCell>{row.title}</TableCell>
                <TableCell>{getLevel(row.level)}</TableCell>
                <TableCell>{row.pageIndex}</TableCell>
                <TableCell>
                  <img
                    className={classes.icon}
                    src={`${row.iconFile}`}
                    alt={row.chapter}
                  />
                </TableCell>
                <TableCell>
                  <DeleteTwoToneIcon
                    color="secondary"
                    style={{ cursor: 'pointer' }}
                    onClick={() => setOpenDialog(row)}
                  />
                  {openDialog && openDialog.chapter === row.chapter && (
                    <RegulationDialog
                      dialogTitle="Weet je zeker dat je dit artikel wilt verwijderen?"
                      dialogText={`Hoofdstuk: ${row.chapter}\nTitel: ${
                        row.title
                      }\nMarkering: ${getLevel(row.level)}`}
                      openDialog={openDialog}
                      setOpenDialog={setOpenDialog}
                      onSubmit={onDelete}
                    />
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

const mapStateToProps = (state: any) => {
  return {
    notificationOptions: state.notification.notificationOptions,
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    setNotification: (notificationOptions: NotificationOptions) =>
      // eslint-disable-next-line import/no-named-as-default-member
      dispatch(notification.setNotification(notificationOptions)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(RegulationsTable);
