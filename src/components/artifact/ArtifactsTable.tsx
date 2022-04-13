import React, { FC } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Artifact } from '../../model/artifacts/Artifact';
import ArtifactsTableRow from './ArtifactsTableRow';

interface Props {
  aggregate: string;
  artifacts: Artifact[] | null;
  onDelete: (id: string) => Promise<void>;
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
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow style={{ backgroundColor: '#ddd' }}>
            {showIdColumn && (
              <TableCell>
                <strong>ID bestand</strong>
              </TableCell>
            )}
            <TableCell>
              <strong>Titel</strong>
            </TableCell>
            <TableCell>
              <strong>Inhoudstype</strong>
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
            artifacts
              .sort((a, b) => a.contentType.localeCompare(b.contentType))
              .map((row) => (
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
