import { DecisionTree } from '../model/DecisionTree/DecisionTree';
import { DecisionTreeStep } from '../model/DecisionTree/DecisionTreeStep';

const validateRootQuestion = (
  rootQuestion: DecisionTreeStep,
  errorMessages: string[]
): string[] => {
  if (rootQuestion.id !== 1) {
    errorMessages.push('- De id van de eerste vraag moet 1 zijn.');
  }
  if (rootQuestion.parentId) {
    errorMessages.push('- De parentId van de eerste vraag moet leeg blijven.');
  }
  if (rootQuestion.lineLabel) {
    errorMessages.push('- De lineLabel van de eerste vraag moet leeg blijven.');
  }
  if (rootQuestion.contentId) {
    errorMessages.push('- contentId van de eerste vraag moet leeg blijven.');
  }
  return errorMessages;
};

const ValidateNodes = (
  steps: DecisionTreeStep[],
  errorMessages: string[]
): string[] => {
  if (steps.find((step) => !step.id)) {
    errorMessages.push(
      '- id is een verplicht veld maar is leeg bij tenminste 1 van de stappen.'
    );
  }
  if (steps.find((step) => !step.label)) {
    errorMessages.push(
      '- label is een verplicht veld maar is leeg bij tenminste 1 van de stappen.'
    );
  }
  return errorMessages;
};

const hasLeafNodesValidAnswers = (leafNodes: DecisionTreeStep[]): boolean => {
  const expectedAnswers = ['ja', 'nee'];
  return leafNodes
    .map((step) => step.lineLabel)
    .every((answer) => expectedAnswers.includes(answer ?? ''));
};

const validateParentIdShouldExist = (
  leafNodes: DecisionTreeStep[]
): boolean => {
  const ids = leafNodes.map((step) => step.id);
  ids.push(1);
  const parentIds = leafNodes.map((step) => step.parentId);
  return parentIds.every((id) => id !== undefined && ids.includes(id));
};

const ValidateLeafNodes = (
  steps: DecisionTreeStep[],
  errorMessages: string[]
): string[] => {
  const leafNodes = steps.slice(1);
  if (leafNodes.find((step) => !step.parentId)) {
    errorMessages.push(
      '- parentId is een verplicht veld maar is leeg bij tenminste 1 van de stappen.'
    );
  }
  if (leafNodes.find((step) => !step.lineLabel)) {
    errorMessages.push(
      '- lineLabel is een verplicht veld maar is leeg bij tenminste 1 van de stappen.'
    );
  }
  if (
    leafNodes.find((step) => !step.lineLabel) ||
    hasLeafNodesValidAnswers(leafNodes)
  ) {
    errorMessages.push(
      '- lineLabel is met uitzondering van de eerste vraag een verplicht veld en kan alleen met ja of nee worden beantwoord.'
    );
  }
  if (!validateParentIdShouldExist(leafNodes)) {
    errorMessages.push(
      '- parentId is met uitzondering van de eerste vraag een verplicht veld en moet verwijzen naar een bestaand id.'
    );
  }
  return errorMessages;
};

const validateOnlyLastLeafHasContentId = (
  steps: DecisionTreeStep[],
  errorMessages: string[]
): string[] => {
  const parentIds = steps.map((step) => step.parentId);
  const finalStepIds = steps
    .filter((step) => {
      return step.contentId !== null;
    })
    .map((step) => step.id);

  if (!finalStepIds.every((id) => !parentIds.includes(id))) {
    errorMessages.push(
      '- Alleen de laatste en niet de tussenliggende antwoorden/vragen mag een contentId hebben.'
    );
  }
  return errorMessages;
};

const createValidationErrorMessage = (errorMessages: string[]): string => {
  return `De stappen van de beslisboom is gevalideerd, hierbij zijn de volgende fouten gevonden: \n${errorMessages.join(
    '\n'
  )}`;
};

const validate = (decisionTree: DecisionTree): string => {
  const rootQuestion = decisionTree.steps[0];
  if (decisionTree.steps.length < 3 || !rootQuestion) {
    return 'Het ontvangen csv bestand is leeg en dient tenminste 1 vraag en 2 antwoorden te hebben (ja en nee).';
  }
  let errorMessages: string[] = [];
  errorMessages = validateRootQuestion(rootQuestion, errorMessages);
  errorMessages = ValidateNodes(decisionTree.steps, errorMessages);
  errorMessages = ValidateLeafNodes(decisionTree.steps, errorMessages);
  errorMessages = validateOnlyLastLeafHasContentId(
    decisionTree.steps,
    errorMessages
  );

  return errorMessages.length === 0
    ? ''
    : createValidationErrorMessage(errorMessages);
};

const decisionTreeValidator = {
  validate,
};

export default decisionTreeValidator;
