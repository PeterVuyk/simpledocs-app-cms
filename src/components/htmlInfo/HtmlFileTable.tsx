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
import ViewHTMLFileAction from '../ItemAction/ViewHTMLFileAction';
import DeleteItemAction from '../ItemAction/DeleteItemAction';
import DownloadHtmlFileAction from '../ItemAction/DownloadHtmlFileAction';
import { HtmlFileInfo } from '../../model/HtmlFileInfo';
import {
  HTML_FILE_CATEGORY_DECISION_TREE,
  HTML_FILE_CATEGORY_SNIPPET,
  HTML_FILE_CATEGORY_TEMPLATE,
  HtmlFileCategory,
} from '../../model/HtmlFileCategory';

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
  htmlFileInfos: HtmlFileInfo[];
  deleteHandle: (id: string) => void;
}

const HtmlFileTable: FC<Props> = ({
  aggregate,
  htmlFileInfos,
  deleteHandle,
}) => {
  const classes = useStyles();
  const history = useHistory();

  const getTranslatedCategory = (category: HtmlFileCategory) => {
    switch (category) {
      case HTML_FILE_CATEGORY_DECISION_TREE:
        return 'Beslisboom';
      case HTML_FILE_CATEGORY_TEMPLATE:
        return 'Template';
      case HTML_FILE_CATEGORY_SNIPPET:
        return 'Snippet';
      default:
        return '';
    }
  };

  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow className={classes.head}>
            <TableCell>
              <strong>ID HTML bestanden</strong>
            </TableCell>
            <TableCell>
              <strong>Titel</strong>
            </TableCell>
            <TableCell>
              <strong>Categorie</strong>
            </TableCell>
            <TableCell />
          </TableRow>
        </TableHead>
        <TableBody>
          {htmlFileInfos.map((row) => (
            <TableRow key={row.id}>
              <TableCell component="th" scope="row">
                {row.id}
              </TableCell>
              <TableCell>{row.title}</TableCell>
              <TableCell>
                {getTranslatedCategory(row.htmlFileCategory)}
              </TableCell>
              <TableCell align="right" className={classes.toolBox}>
                <Tooltip title="Wijzigen">
                  <EditTwoTone
                    style={{ cursor: 'pointer' }}
                    onClick={() =>
                      history.push(
                        `/${
                          aggregate === 'decision-tree'
                            ? 'decision-tree'
                            : 'html-layout'
                        }/html/${row.id}`
                      )
                    }
                  />
                </Tooltip>
                <DownloadHtmlFileAction
                  htmlFile={row.htmlFile}
                  fileName={row.title}
                />
                <ViewHTMLFileAction htmlFile={row.htmlFile} />
                <DeleteItemAction
                  title="Weet je zeker dat je dit html bestand wilt verwijderen?"
                  dialogText={`ID: ${row.id}\nTitel: ${row.title}`}
                  onSubmit={deleteHandle}
                  itemId={row.id!}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default HtmlFileTable;
