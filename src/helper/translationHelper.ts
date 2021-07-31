import {
  AGGREGATE_APP_CONFIG,
  AGGREGATE_CALCULATIONS,
  AGGREGATE_DECISION_TREE,
  AGGREGATE_INSTRUCTION_MANUAL,
  AGGREGATE_REGULATION_BRANCHERICHTLIJN_MEDISCHE_HULPVERLENING,
  AGGREGATE_REGULATION_OGS_2009,
  AGGREGATE_REGULATION_ONTHEFFING_GOEDE_TAAKUITVOERING,
  AGGREGATE_REGULATION_RVV_1990,
} from '../model/Aggregate';

const getTranslatedAggregate = (aggregate: string): string => {
  switch (aggregate) {
    case AGGREGATE_REGULATION_OGS_2009:
      return 'Regeling OGS 2009 (Regelgeving)';
    case AGGREGATE_REGULATION_ONTHEFFING_GOEDE_TAAKUITVOERING:
      return 'Ontheffing goede taakuitoefening (Regelgeving)';
    case AGGREGATE_REGULATION_RVV_1990:
      return 'RVV 1990 (Regelgeving)';
    case AGGREGATE_REGULATION_BRANCHERICHTLIJN_MEDISCHE_HULPVERLENING:
      return 'Brancherichtlijn medische hulpverlening (Regelgeving)';
    case AGGREGATE_INSTRUCTION_MANUAL:
      return 'Handboek';
    case AGGREGATE_DECISION_TREE:
      return 'Beslisboom';
    case AGGREGATE_CALCULATIONS:
      return 'Berekeningen';
    case AGGREGATE_APP_CONFIG:
      return 'Configuratie app';
    default:
      return 'Onbekend';
  }
};

const translationHelper = {
  getTranslatedAggregate,
};

export default translationHelper;
