import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TableCell from '@material-ui/core/TableCell';
import DeleteTwoToneIcon from '@material-ui/icons/DeleteTwoTone';
import FindInPageTwoToneIcon from '@material-ui/icons/FindInPageTwoTone';
import { connect } from 'react-redux';
import { EditTwoTone } from '@material-ui/icons';
import { useHistory } from 'react-router-dom';
import regulationRepository, {
  Regulation,
} from '../../../firebase/database/regulationRepository';
import RegulationDialog from '../../../components/dialog/RegulationDialog';
import notification, {
  NotificationOptions,
} from '../../../redux/actions/notification';
import HtmlPreview from '../../../components/dialog/HtmlPreview';

const useStyles = makeStyles({
  icon: {
    width: 20,
  },
  toolBox: {
    width: 110,
  },
});

interface Props {
  regulation: Regulation;
  loadRegulationsHandle: () => void;
  setNotification: (notificationOptions: NotificationOptions) => void;
}

const RegulationListItem: React.FC<Props> = ({
  regulation,
  loadRegulationsHandle,
  setNotification,
}) => {
  const [
    showHtmlPreview,
    setShowHtmlPreview,
  ] = React.useState<Regulation | null>(null);
  const [
    openDeleteDialog,
    setOpenDeleteDialog,
  ] = React.useState<Regulation | null>(null);
  const classes = useStyles();
  const history = useHistory();

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
      .then(() => loadRegulationsHandle())
      .then(() =>
        setNotification({
          notificationType: 'success',
          notificationOpen: true,
          notificationMessage: 'Pagina is verwijderd.',
        })
      );
  };

  const closeHtmlPreviewHandle = (): void => {
    setShowHtmlPreview(null);
  };

  return (
    <>
      <TableCell component="th" scope="row">
        {regulation.chapter}
      </TableCell>
      <TableCell>{regulation.title}</TableCell>
      <TableCell>{getLevel(regulation.level)}</TableCell>
      <TableCell>{regulation.pageIndex}</TableCell>
      <TableCell>
        <img
          className={classes.icon}
          src={`${regulation.iconFile}`}
          alt={regulation.chapter}
        />
      </TableCell>
      <TableCell align="right" className={classes.toolBox}>
        <EditTwoTone
          style={{ cursor: 'pointer' }}
          onClick={() => history.push(`/regulations/${regulation.id}`)}
        />
        <FindInPageTwoToneIcon
          color="primary"
          style={{ cursor: 'pointer' }}
          onClick={() => setShowHtmlPreview(regulation)}
        />
        <DeleteTwoToneIcon
          color="secondary"
          style={{ cursor: 'pointer' }}
          onClick={() => setOpenDeleteDialog(regulation)}
        />
        {showHtmlPreview && showHtmlPreview.chapter === regulation.chapter && (
          <HtmlPreview
            showHtmlPreview={showHtmlPreview.htmlFile}
            closeHtmlPreviewHandle={closeHtmlPreviewHandle}
          />
        )}
        {openDeleteDialog &&
          openDeleteDialog.chapter === regulation.chapter && (
            <RegulationDialog
              dialogTitle="Weet je zeker dat je dit artikel wilt verwijderen?"
              dialogText={`Hoofdstuk: ${regulation.chapter}\nTitel: ${
                regulation.title
              }\nMarkering: ${getLevel(regulation.level)}`}
              openDialog={openDeleteDialog}
              setOpenDialog={setOpenDeleteDialog}
              onSubmit={onDelete}
            />
          )}
      </TableCell>
    </>
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

export default connect(mapStateToProps, mapDispatchToProps)(RegulationListItem);
