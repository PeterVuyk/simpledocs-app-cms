import {
  AGGREGATE_CALCULATIONS,
  AGGREGATE_DECISION_TREE,
  AGGREGATE_INSTRUCTION_MANUAL,
  AGGREGATE_REGULATIONS,
} from '../model/Aggregate';

const getTranslatedAggregate = (aggregate: string): string => {
  switch (aggregate) {
    case AGGREGATE_REGULATIONS:
      return 'regelgeving';
    case AGGREGATE_INSTRUCTION_MANUAL:
      return 'handboek';
    case AGGREGATE_DECISION_TREE:
      return 'beslisboom';
    case AGGREGATE_CALCULATIONS:
      return 'berekeningen';
    default:
      return 'onbekend';
  }
};

const translationHelper = {
  getTranslatedAggregate,
};

export default translationHelper;
