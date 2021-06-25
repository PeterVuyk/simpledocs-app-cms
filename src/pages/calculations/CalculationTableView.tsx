import React, { FC, useEffect, useState } from 'react';
import TableContainer from '@material-ui/core/TableContainer';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';
import { makeStyles } from '@material-ui/core/styles';
import FindInPageTwoToneIcon from '@material-ui/icons/FindInPageTwoTone';
import HtmlPreview from '../../components/dialog/HtmlPreview';
import articleRepository from '../../firebase/database/articleRepository';
import { ARTICLE_TYPE_REGULATIONS } from '../../model/ArticleType';
import { Article } from '../../model/Article';
import { CalculationInfo } from '../../model/CalculationInfo';

const useStyles = makeStyles({
  table: {
    width: '100%',
  },
  button: {
    marginLeft: 8,
  },
  head: {
    backgroundColor: '#ddd',
  },
});

interface Props {
  calculationInfo: CalculationInfo;
}

const CalculationTableView: FC<Props> = ({ calculationInfo }) => {
  const [showHtmlPreview, setShowHtmlPreview] = useState<string>('');
  const [article, setArticle] = useState<Article | null>(null);

  useEffect(() => {
    articleRepository
      .getArticlesByField(
        calculationInfo.articleType,
        'chapter',
        calculationInfo.articleChapter
      )
      .then((result) => setArticle(result.length !== 1 ? null : result[0]));
  }, [calculationInfo]);

  const classes = useStyles();

  const closeHtmlPreviewHandle = (): void => setShowHtmlPreview('');

  return (
    <>
      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow className={classes.head}>
              <TableCell />
              <TableCell>
                <strong>Titel</strong>
              </TableCell>
              <TableCell>
                <strong>Illustratie</strong>
              </TableCell>
              <TableCell>
                <strong>Toelichting</strong>
              </TableCell>
              <TableCell>
                <strong>Artikel knop tekst</strong>
              </TableCell>
              <TableCell>
                <strong>Verwijzing artikel</strong>
              </TableCell>
              <TableCell>
                <strong>Verwijzing hoofdstuk</strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {calculationInfo && (
              <>
                <TableRow hover key="1">
                  <TableCell className={classes.head} />
                  <TableCell>{calculationInfo.title}</TableCell>
                  <TableCell>
                    <img
                      style={{ width: 30 }}
                      src={`${calculationInfo.iconFile}`}
                    />
                  </TableCell>
                  <TableCell>{calculationInfo.explanation}</TableCell>
                  <TableCell>{calculationInfo.articleButtonText}</TableCell>
                  <TableCell>
                    {calculationInfo.articleType === ARTICLE_TYPE_REGULATIONS
                      ? 'Regelgeving'
                      : 'Handboek'}
                  </TableCell>
                  <TableCell>
                    {calculationInfo.articleChapter}
                    {article && (
                      <FindInPageTwoToneIcon
                        color="primary"
                        style={{ cursor: 'pointer', marginBottom: -5 }}
                        onClick={() => setShowHtmlPreview(article?.chapter)}
                      />
                    )}
                    {showHtmlPreview && (
                      <HtmlPreview
                        showHtmlPreview={article?.htmlFile}
                        closeHtmlPreviewHandle={closeHtmlPreviewHandle}
                      />
                    )}
                  </TableCell>
                </TableRow>
                <TableRow hover key="2">
                  <TableCell className={classes.head}>
                    <strong>Remafstand afbeelding</strong>
                  </TableCell>
                  <TableCell colSpan={6}>
                    <img
                      style={{ width: 600 }}
                      src={`${calculationInfo.calculationImage}`}
                    />
                  </TableCell>
                </TableRow>
              </>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default CalculationTableView;
