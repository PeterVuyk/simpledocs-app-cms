import React, { FC } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TableCell from '@material-ui/core/TableCell';
import Chip from '@material-ui/core/Chip';
import DialogContentText from '@material-ui/core/DialogContentText';
import Highlight from 'react-highlight';
import ViewContentAction from '../ItemAction/ViewContentAction';
import DeleteItemAction from '../ItemAction/DeleteItemAction';
import DownloadContentAction from '../ItemAction/DownloadContentAction';
import { AGGREGATE_DECISION_TREE } from '../../model/Aggregate';
import { Artifact } from '../../model/Artifact';
import {
  ARTIFACT_TYPE_CSS_STYLESHEET,
  ARTIFACT_TYPE_DECISION_TREE,
  ARTIFACT_TYPE_SNIPPET,
  ARTIFACT_TYPE_TEMPLATE,
} from '../../model/ArtifactType';
import HelpAction from '../ItemAction/helpAction/HelpAction';
import EditItemAction from '../ItemAction/EditItemAction';

const useStyles = makeStyles({
  toolBox: {
    width: 150,
  },
});

interface Props {
  artifact: Artifact;
  aggregate: string;
  onDelete: (id: string) => void;
  showIdColumn: boolean;
  showArtifactType: boolean;
}

const ArtifactsTableRow: FC<Props> = ({
  artifact,
  aggregate,
  onDelete,
  showIdColumn,
  showArtifactType,
}) => {
  const classes = useStyles();

  const getTranslatedCategory = () => {
    switch (artifact.type) {
      case ARTIFACT_TYPE_DECISION_TREE:
        return 'Beslisboom';
      case ARTIFACT_TYPE_TEMPLATE:
        return 'Template';
      case ARTIFACT_TYPE_SNIPPET:
        return 'Snippet';
      case ARTIFACT_TYPE_CSS_STYLESHEET:
        return 'CSS stylesheet';
      default:
        return '';
    }
  };

  const getStylesheetExplanation = (): React.ReactNode => {
    return (
      <DialogContentText
        color="textPrimary"
        style={{ whiteSpace: 'pre-line' }}
        id="alert-dialog-slide-description"
      >
        Met deze stylesheet kun je het uiterlijk van de html pagina&apos;s
        globaal veranderen door alleen dit bestand te wijzigen. Deze wijzigingen
        worden doorgevoerd op het moment dat je ze individueel wijzigt of nieuwe
        pagina&apos;s toevoegt. <br /> <br />
        Bewerk je html bestanden op je eigen computer? Maak dan lokaal een
        stylesheet aan (bijvoorbeeld: stylesheet.css) en plaats hier de styling.
        Voeg vervolgens de link in het html bestand met referentie naar deze
        stylesheet toe, deze moet (met uitzondering van href) gelijk zijn aan:
        <Highlight className="html">{`<link rel="stylesheet" href="stylesheet.css">`}</Highlight>
        Ben je klaar met je lokale wijzigingen en upload je het html bestand,
        dan wordt deze link automatisch verwijderd en vervangen door de
        stylesheet van de styleguide.
      </DialogContentText>
    );
  };

  const isDefaultTemplate = (): boolean => {
    if (artifact.type !== ARTIFACT_TYPE_TEMPLATE) {
      return false;
    }
    return artifact.title.toLowerCase() === 'standaard';
  };

  const showDeleteIcon = (): boolean => {
    if ([ARTIFACT_TYPE_CSS_STYLESHEET].includes(artifact.type)) {
      return false;
    }
    return !isDefaultTemplate();
  };

  const showEditIcon = (): boolean =>
    ![ARTIFACT_TYPE_CSS_STYLESHEET].includes(artifact.type);

  const showPreviewIcon = (): boolean =>
    ![ARTIFACT_TYPE_CSS_STYLESHEET].includes(artifact.type);

  const getSlugFromType = (): string => {
    switch (artifact.type) {
      case ARTIFACT_TYPE_DECISION_TREE:
        return 'decision-tree';
      default:
        return artifact.type;
    }
  };

  return (
    <>
      {showIdColumn && (
        <TableCell component="th" scope="row">
          {artifact.id}
        </TableCell>
      )}
      <TableCell>
        {artifact.title}&nbsp;
        {isDefaultTemplate() && (
          <Chip label="Default template" variant="outlined" />
        )}
      </TableCell>
      <TableCell>{artifact.contentType}</TableCell>
      {showArtifactType && <TableCell>{getTranslatedCategory()}</TableCell>}
      <TableCell align="right" className={classes.toolBox}>
        {artifact.type === ARTIFACT_TYPE_CSS_STYLESHEET && (
          <HelpAction title="Gebruik CSS Stylesheet">
            {getStylesheetExplanation()}
          </HelpAction>
        )}
        {showEditIcon() && (
          <EditItemAction
            urlSlug={`/${
              aggregate === AGGREGATE_DECISION_TREE
                ? 'artifacts/'
                : 'styleguide/'
            }${getSlugFromType()}/${artifact.id}`}
          />
        )}
        <DownloadContentAction
          content={artifact.content}
          contentType={artifact.contentType}
          fileName={artifact.title}
        />
        {showPreviewIcon() && (
          <ViewContentAction
            content={artifact.content}
            contentType={artifact.contentType}
          />
        )}
        {showDeleteIcon() && (
          <DeleteItemAction
            title="Weet je zeker dat je dit bestand wilt verwijderen?"
            dialogText={`ID: ${artifact.id}\nTitel: ${artifact.title}`}
            onSubmit={onDelete}
            itemId={artifact.id!}
          />
        )}
      </TableCell>
    </>
  );
};

export default ArtifactsTableRow;
