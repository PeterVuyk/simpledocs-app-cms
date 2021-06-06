import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TableCell from '@material-ui/core/TableCell';
import DeleteTwoToneIcon from '@material-ui/icons/DeleteTwoTone';
import FindInPageTwoToneIcon from '@material-ui/icons/FindInPageTwoTone';
import { connect } from 'react-redux';
import { EditTwoTone } from '@material-ui/icons';
import { useHistory } from 'react-router-dom';
import GetAppIcon from '@material-ui/icons/GetApp';
import FileSaver from 'file-saver';
import RestoreFromTrashTwoToneIcon from '@material-ui/icons/RestoreFromTrashTwoTone';
import regulationRepository, {
  Regulation,
} from '../../../firebase/database/regulationRepository';
import RegulationDialog from '../../../components/dialog/RegulationDialog';
import notification, {
  NotificationOptions,
} from '../../../redux/actions/notification';
import HtmlPreview from '../../../components/dialog/HtmlPreview';
import fileHelper from '../../../helper/fileHelper';
import logger from '../../../helper/logger';

const useStyles = makeStyles({
  icon: {
    width: 20,
  },
  toolBox: {
    width: 150,
  },
});

interface Props {
  regulation: Regulation;
  loadRegulationsHandle: () => void;
  setNotification: (notificationOptions: NotificationOptions) => void;
  editStatus: 'draft' | 'published';
}

const RegulationListItem: React.FC<Props> = ({
  regulation,
  loadRegulationsHandle,
  setNotification,
  editStatus,
}) => {
  const [showHtmlPreview, setShowHtmlPreview] =
    React.useState<Regulation | null>(null);
  const [openDeleteDialog, setOpenDeleteDialog] =
    React.useState<Regulation | null>(null);
  const classes = useStyles();
  const history = useHistory();

  const getLevel = (level: string): string => {
    const levels = {
      chapter: 'Hoofdstuk',
      section: 'Paragraaf',
      subSection: 'Subparagraaf',
      subSubSection: 'Sub-subparagraaf',
      subHead: 'Tussenkop',
      attachment: 'Bijlage',
      legislation: 'Wetgeving',
    };
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return level in levels ? levels[level] : '';
  };

  const onDelete = (id: string): void => {
    if (regulation.isDraft) {
      regulationRepository
        .deleteRegulation(id)
        .then(() => loadRegulationsHandle())
        .then(() =>
          setNotification({
            notificationType: 'success',
            notificationOpen: true,
            notificationMessage: 'Pagina is verwijderd.',
          })
        )
        .catch((reason) =>
          logger.errorWithReason('Failed deleting regulation', reason)
        );
      return;
    }
    regulationRepository
      .markRegulationForDeletion(id)
      .then(() => loadRegulationsHandle())
      .then(() =>
        setNotification({
          notificationType: 'success',
          notificationOpen: true,
          notificationMessage: 'Pagina is gemarkeerd voor verwijdering.',
        })
      )
      .catch((reason) =>
        logger.errorWithReason('Failed marking regulation for deletion', reason)
      );
  };

  const undoMarkDeletion = () => {
    regulationRepository
      .removeMarkForDeletion(regulation.id ?? '')
      .then(() => loadRegulationsHandle())
      .then(() =>
        setNotification({
          notificationType: 'success',
          notificationOpen: true,
          notificationMessage:
            'De markering voor het verwijderen van het artikel is ongedaan gemaakt.',
        })
      )
      .catch((reason) =>
        logger.errorWithReason(
          `Failed removing the mark for deletion from the regulation id${regulation.id}`,
          reason
        )
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
        {!regulation.markedForDeletion && (
          <EditTwoTone
            style={{ cursor: 'pointer' }}
            onClick={() => history.push(`/regulations/${regulation.id}`)}
          />
        )}
        <GetAppIcon
          color="action"
          style={{ cursor: 'pointer' }}
          onClick={() =>
            FileSaver.saveAs(
              fileHelper.getBase64FromHtml(regulation.htmlFile),
              `${regulation.chapter}.html`
            )
          }
        />
        <FindInPageTwoToneIcon
          color="primary"
          style={{ cursor: 'pointer' }}
          onClick={() => setShowHtmlPreview(regulation)}
        />
        {regulation.markedForDeletion && editStatus === 'draft' && (
          <RestoreFromTrashTwoToneIcon
            style={{ cursor: 'pointer', color: '#099000FF' }}
            onClick={() => undoMarkDeletion()}
          />
        )}
        {!regulation.markedForDeletion && (
          <DeleteTwoToneIcon
            color="secondary"
            style={{ cursor: 'pointer' }}
            onClick={() => setOpenDeleteDialog(regulation)}
          />
        )}
        {showHtmlPreview && showHtmlPreview.chapter === regulation.chapter && (
          <HtmlPreview
            showHtmlPreview={showHtmlPreview.htmlFile}
            closeHtmlPreviewHandle={closeHtmlPreviewHandle}
          />
        )}
        {openDeleteDialog &&
          openDeleteDialog.chapter === regulation.chapter && (
            <RegulationDialog
              dialogTitle="Weet je zeker dat je dit artikel wilt markeren voor verwijdering?"
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
