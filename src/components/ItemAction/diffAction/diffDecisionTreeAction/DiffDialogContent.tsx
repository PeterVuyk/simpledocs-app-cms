import React, { FC, useState } from 'react';
import { Grid } from '@mui/material';
import 'diff2html/bundles/css/diff2html.min.css';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import { diffWords } from 'diff';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import useDiff from '../../../hooks/useDiff';
import DiffDecisionTreeContent from './DiffDecisionTreeContent';
import { DecisionTree } from '../../../../model/DecisionTree/DecisionTree';
import { DecisionTreeStep } from '../../../../model/DecisionTree/DecisionTreeStep';

interface Props {
  conceptDecisionTree: DecisionTree;
  publishedDecisionTree: DecisionTree;
}

const DiffDialogContent: FC<Props> = ({
  conceptDecisionTree,
  publishedDecisionTree,
}) => {
  const [showDecisionTreeContent, setShowDecisionTreeContent] =
    useState<DecisionTreeStep | null>(null);
  const { mapDiff, getRemovedSpan, getAddedSpan } = useDiff();

  const getRemovedSteps = () => {
    const conceptIds = conceptDecisionTree.steps.map((value) => value.id);
    return publishedDecisionTree.steps.filter(
      (value) => !conceptIds.includes(value.id)
    );
  };

  const getAddedSteps = () => {
    const publishedIds = publishedDecisionTree.steps.map((value) => value.id);
    return conceptDecisionTree.steps.filter(
      (value) => !publishedIds.includes(value.id)
    );
  };

  const getSteps = () => {
    return conceptDecisionTree.steps
      .filter((conceptStep) =>
        publishedDecisionTree.steps.find(
          (publishedStep) => publishedStep.id === conceptStep.id
        )
      )
      .sort((a, b) => a.id - b.id);
  };

  return (
    <Grid
      sx={(theme) => ({
        paddingLeft: theme.spacing(3),
        paddingRight: theme.spacing(3),
      })}
      container
      spacing={0}
      alignItems="flex-start"
      justifyContent="flex-start"
      direction="row"
    >
      <Grid container item sm={12} style={{ marginBottom: 18 }}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow style={{ backgroundColor: '#ddd' }}>
                <TableCell>
                  <strong>ID</strong>
                </TableCell>
                <TableCell>
                  <strong>Label</strong>
                </TableCell>
                <TableCell>
                  <strong>Parent ID</strong>
                </TableCell>
                <TableCell>
                  <strong>Antwoord</strong>
                </TableCell>
                <TableCell />
              </TableRow>
            </TableHead>
            <TableBody>
              {getSteps().map((row) => {
                const publishedStep = publishedDecisionTree.steps.find(
                  (value) => value.id === row.id
                )!;
                return (
                  <TableRow key={row.id}>
                    <TableCell component="th" scope="row">
                      {row.id}
                    </TableCell>
                    <TableCell>
                      {mapDiff(diffWords(publishedStep.label ?? '', row.label))}
                    </TableCell>
                    <TableCell>
                      {mapDiff(
                        diffWords(
                          publishedStep.parentId?.toString() ?? '',
                          row.parentId?.toString() ?? ''
                        )
                      )}
                    </TableCell>
                    <TableCell>
                      {mapDiff(
                        diffWords(
                          publishedStep.lineLabel ?? '',
                          row.lineLabel ?? ''
                        )
                      )}
                    </TableCell>
                    <TableCell>
                      {row.contentId && (
                        <CompareArrowsIcon
                          onClick={() => {
                            setShowDecisionTreeContent(null);
                            setShowDecisionTreeContent(row);
                          }}
                          color="primary"
                          style={{ cursor: 'pointer' }}
                        />
                      )}
                      {row.contentId === undefined &&
                        publishedStep.content &&
                        getRemovedSpan('Pagina verwijderd')}
                    </TableCell>
                  </TableRow>
                );
              })}
              {getAddedSteps().map((row) => (
                <TableRow key={row.id}>
                  <TableCell component="th" scope="row">
                    {getAddedSpan(row.id)}
                  </TableCell>
                  <TableCell>{getAddedSpan(row.label)}</TableCell>
                  <TableCell>{getAddedSpan(row.parentId)}</TableCell>
                  <TableCell>{getAddedSpan(row.lineLabel)}</TableCell>
                  <TableCell>
                    {row.contentId !== null && getAddedSpan('Met toelichting')}
                  </TableCell>
                </TableRow>
              ))}
              {getRemovedSteps().map((row) => (
                <TableRow key={row.id}>
                  <TableCell component="th" scope="row">
                    {getRemovedSpan(row.id)}
                  </TableCell>
                  <TableCell>{getRemovedSpan(row.label)}</TableCell>
                  <TableCell>{getRemovedSpan(row.parentId)}</TableCell>
                  <TableCell>{getRemovedSpan(row.lineLabel)}</TableCell>
                  <TableCell>
                    {row.content !== undefined &&
                      getRemovedSpan('Pagina verwijderd')}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
      {showDecisionTreeContent && (
        <DiffDecisionTreeContent
          conceptDecisionTreeArtifactId={showDecisionTreeContent.contentId!}
          publishedDecisionTreeStep={publishedDecisionTree.steps.find(
            (value) => value.id === showDecisionTreeContent.id
          )}
        />
      )}
    </Grid>
  );
};

export default DiffDialogContent;
