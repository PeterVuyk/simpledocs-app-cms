import showdown from 'showdown';
import getTextFromHtml from '../../firebase/functions/getTextFromHtml';
import {
  CONTENT_TYPE_CALCULATIONS,
  CONTENT_TYPE_DECISION_TREE,
  CONTENT_TYPE_MARKDOWN,
  ContentType,
} from '../../model/ContentType';
import { DecisionTree } from '../../model/DecisionTree/DecisionTree';
import { CalculationInfo } from '../../model/calculations/CalculationInfo';

const getTextFromDecisionTree = (decisionTree: DecisionTree) => {
  const { title } = decisionTree;
  const decisionLabels = decisionTree.steps.map((value) => `${value.label}\n`);
  return `Beslisboom ${title}\n\n${decisionLabels}`;
  // TODO: Testen.
};

const getTextFromSourceCode = (
  content: string,
  contentType: ContentType
): Promise<string> => {
  if (content === '') {
    return Promise.resolve('');
  }

  if (contentType === CONTENT_TYPE_DECISION_TREE) {
    return Promise.resolve(
      getTextFromDecisionTree(JSON.parse(content) as DecisionTree)
    );
  }

  let html = content;
  if (contentType === CONTENT_TYPE_CALCULATIONS) {
    const calculationInfo = JSON.parse(content) as CalculationInfo;
    html = calculationInfo.content;
  }

  if (contentType === CONTENT_TYPE_MARKDOWN) {
    const converter = new showdown.Converter();
    html = converter.makeHtml(content);
  }
  return getTextFromHtml(html);
};

export default getTextFromSourceCode;
