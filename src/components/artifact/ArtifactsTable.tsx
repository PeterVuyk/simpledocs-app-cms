import React, { FC } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { EditTwoTone } from '@material-ui/icons';
import { useHistory } from 'react-router-dom';
import { Tooltip } from '@material-ui/core';
import Chip from '@material-ui/core/Chip';
import ViewHTMLFileAction from '../ItemAction/ViewHTMLFileAction';
import DeleteItemAction from '../ItemAction/DeleteItemAction';
import DownloadFileAction from '../ItemAction/DownloadFileAction';
import { AGGREGATE_DECISION_TREE } from '../../model/Aggregate';
import { Artifact } from '../../model/Artifact';
import {
  ARTIFACT_TYPE_CSS_STYLESHEET,
  ARTIFACT_TYPE_DECISION_TREE,
  ARTIFACT_TYPE_SNIPPET,
  ARTIFACT_TYPE_TEMPLATE,
  ArtifactType,
} from '../../model/ArtifactType';

const useStyles = makeStyles({
  table: {
    width: '100%',
  },
  head: {
    backgroundColor: '#ddd',
  },
  toolBox: {
    width: 150,
  },
});

interface Props {
  aggregate: string;
  artifacts: Artifact[] | null;
  onDelete: (id: string) => void;
  showIdColumn: boolean;
  showArtifactType: boolean;
}

const ArtifactsTable: FC<Props> = ({
  aggregate,
  artifacts,
  onDelete,
  showIdColumn,
  showArtifactType,
}) => {
  const classes = useStyles();
  const history = useHistory();

  const getTranslatedCategory = (type: ArtifactType) => {
    switch (type) {
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

  const isDefaultTemplate = (artifact: Artifact): boolean => {
    if (artifact.type !== ARTIFACT_TYPE_TEMPLATE) {
      return false;
    }
    return artifact.title.toLowerCase() === 'standaard';
  };

  const showDeleteIcon = (artifact: Artifact): boolean => {
    if ([ARTIFACT_TYPE_CSS_STYLESHEET].includes(artifact.type)) {
      return false;
    }
    return !isDefaultTemplate(artifact);
  };

  const showEditIcon = (artifact: Artifact): boolean =>
    ![ARTIFACT_TYPE_CSS_STYLESHEET].includes(artifact.type);

  const showPreviewIcon = (artifact: Artifact): boolean =>
    ![ARTIFACT_TYPE_CSS_STYLESHEET].includes(artifact.type);

  const getSlugFromType = (artifactType: ArtifactType): string => {
    switch (artifactType) {
      case ARTIFACT_TYPE_DECISION_TREE:
        return 'decision-tree';
      default:
        return artifactType;
    }
  };

  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow className={classes.head}>
            {showIdColumn && (
              <TableCell>
                <strong>ID bestand</strong>
              </TableCell>
            )}
            <TableCell>
              <strong>Titel</strong>
            </TableCell>
            <TableCell>
              <strong>Extensie</strong>
            </TableCell>
            {showArtifactType && (
              <TableCell>
                <strong>Categorie</strong>
              </TableCell>
            )}
            <TableCell />
          </TableRow>
        </TableHead>
        <TableBody>
          {artifacts !== null &&
            artifacts.map((row) => (
              <TableRow key={row.id}>
                {showIdColumn && (
                  <TableCell component="th" scope="row">
                    {row.id}
                  </TableCell>
                )}
                <TableCell>
                  {row.title}&nbsp;
                  {isDefaultTemplate(row) && (
                    <Chip label="Default template" variant="outlined" />
                  )}
                </TableCell>
                <TableCell>{row.extension}</TableCell>
                {showArtifactType && (
                  <TableCell>{getTranslatedCategory(row.type)}</TableCell>
                )}
                <TableCell align="right" className={classes.toolBox}>
                  {showEditIcon(row) && (
                    <Tooltip title="Wijzigen">
                      <EditTwoTone
                        style={{ cursor: 'pointer' }}
                        onClick={() =>
                          history.push(
                            `/${
                              aggregate === AGGREGATE_DECISION_TREE
                                ? 'html/'
                                : 'styleguide/'
                            }${getSlugFromType(row.type)}/${row.id}`
                          )
                        }
                      />
                    </Tooltip>
                  )}
                  <DownloadFileAction
                    htmlFile={row.file}
                    fileName={row.title}
                    extension={row.extension}
                  />
                  {showPreviewIcon(row) && (
                    <ViewHTMLFileAction htmlFile={row.file} />
                  )}
                  {showDeleteIcon(row) && (
                    <DeleteItemAction
                      title="Weet je zeker dat je dit html bestand wilt verwijderen?"
                      dialogText={`ID: ${row.id}\nTitel: ${row.title}`}
                      onSubmit={onDelete}
                      itemId={row.id!}
                    />
                  )}
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ArtifactsTable;
