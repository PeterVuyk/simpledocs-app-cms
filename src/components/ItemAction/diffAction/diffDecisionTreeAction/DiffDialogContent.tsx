import React, { FC, useState } from 'react';
import { Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import 'diff2html/bundles/css/diff2html.min.css';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';
import TableContainer from '@material-ui/core/TableContainer';
import { diffWords } from 'diff';
import CompareArrowsIcon from '@material-ui/icons/CompareArrows';
import { DecisionTreeStep } from '../../../../model/DecisionTreeStep';
import useDiff from '../../../hooks/useDiff';
import DiffDecisionTreeContent from './DiffDecisionTreeContent';

const useStyles = makeStyles((theme) => ({
  container: {
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(3),
  },
  icon: {
    width: 45,
    display: 'inline',
    verticalAlign: 'middle',
  },
  table: {
    width: '100%',
  },
  head: {
    backgroundColor: '#ddd',
  },
}));

interface Props {
  conceptDecisionTree: DecisionTreeStep[];
  publishedDecisionTree: DecisionTreeStep[];
}

const DiffDialogContent: FC<Props> = ({
  conceptDecisionTree,
  publishedDecisionTree,
}) => {
  const [showDecisionTreeContent, setShowDecisionTreeContent] =
    useState<DecisionTreeStep | null>(null);
  const { mapDiff, getRemovedSpan, getAddedSpan } = useDiff();
  const classes = useStyles();

  const getRemovedSteps = () => {
    const conceptIds = conceptDecisionTree.map((value) => value.id);
    return publishedDecisionTree.filter(
      (value) => !conceptIds.includes(value.id)
    );
  };

  const getAddedSteps = () => {
    const publishedIds = publishedDecisionTree.map((value) => value.id);
    return conceptDecisionTree.filter(
      (value) => !publishedIds.includes(value.id)
    );
  };

  const getSteps = () => {
    return conceptDecisionTree
      .filter((conceptStep) =>
        publishedDecisionTree.find(
          (publishedStep) => publishedStep.id === conceptStep.id
        )
      )
      .sort((a, b) => a.id - b.id);
  };

  return (
    <Grid
      className={classes.container}
      container
      spacing={0}
      alignItems="flex-start"
      justifyContent="flex-start"
      direction="row"
    >
      <Grid container item sm={12} style={{ marginBottom: 18 }}>
        <TableContainer component={Paper}>
          <Table className={classes.table}>
            <TableHead>
              <TableRow className={classes.head}>
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
                const publishedStep = publishedDecisionTree.find(
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
          publishedDecisionTreeStep={publishedDecisionTree.find(
            (value) => value.id === showDecisionTreeContent.id
          )}
        />
      )}
    </Grid>
  );
};

export default DiffDialogContent;
