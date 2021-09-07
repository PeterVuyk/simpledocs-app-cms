import React, { FC } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { Artifact } from '../../model/Artifact';
import ArtifactsTableRow from './ArtifactsTableRow';

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
                <ArtifactsTableRow
                  artifact={row}
                  showArtifactType={showArtifactType}
                  aggregate={aggregate}
                  onDelete={onDelete}
                  showIdColumn={showIdColumn}
                />
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ArtifactsTable;
